var roomObjects = []; //This is where objects representing all the dorms will be placed
var currentRooms = []; //This is where objects representing the currently displayed dorms will be placed.
const topPossibleScore = 15; //3 different areas of quantitative review therefore, with each one out of 5, top score possible is 20;

//hide and empty dropdown when page is loaded
$(".dropdown").hide();
$(".dropdown").empty();
var schoolName = $("#schoolName").html();
var currentDormSelected = $(".dormtitle").children("h8").html().toLowerCase();

generateDormObjects();

dormNames = []; //Empty array, will be populated with names of all dorms and corresponding school
schoolNames = []; //Empty array, will be populated with names of all schools

$(document).ready(function(){
  //Add every dorm to the dormNames array
  firebase.database().ref("/").once('value').then(function(snap){
    for(node in snap.val()){
      if(!(node == "Contact Messages")){
      schoolNames.push(node);
      var key = node;
      var ratings = snap.val()[node].ratings;
      for(dorm in ratings){
          //Create a 2d array, where first element is name of dorm, second is name of school and push to dormNames
          newDorm = [];
          newDorm.push(dorm);
          newDorm.push(key);
          dormNames.push(newDorm);
      }
    }
  }
  }).then(function(){
    //Filter by only including dorms where school name is equal to the dorms school
    var count = 0;
    for(var i=0; i<dormNames.length; i++){
      if(schoolName == dormNames[i][1]){
        count = count+1;
        $("#rankings").append("<div class=\'ranking\'><div class=\'number\'><h12>" + count + "</h12></div>" +
        "<div class=\'name\'><h11>" + dormNames[i][0] + "</h11></div>" + "<div class=\'overallscore\'><h13> </h13></div></div>");
      }
    }
    //Get dorm name with correct case from list generated previously
    for(var i=0; i<dormNames.length; i++){
      if(dormNames[i][0].toLowerCase() == currentDormSelected){
        currentDormSelected = dormNames[i][0];
      }
    }
  }).then(function(){
    getCurrentInfo();
  })
})

//Populate the page with reviews and avg scores for this dorm from firebase
function getCurrentInfo(){
  var cultureArr = [7];
  var sortedCulture = [7]
  $("#commentsHolder").empty(); //Remove reviews so new ones can populate
  var numReviews;
  var dormStyle;
  var laundry;
  var population;

  var avgBathroom;
  var avgBuilding;
  var avgCulture;
  var avgGymDist;
  var partyDist;
  var avgRoom;
  var avgStudyDist;

  //Get static information i.e. not user generated
  firebase.database().ref("/" + schoolName + "/ratings/" + currentDormSelected + "/Objective Info/").once("value").then(function(snapshot){
    population = snapshot.child("Population").val();
    laundry = snapshot.child("Laundry").val();
    dormStyle = snapshot.child("Dorm Style").val();
  }).then(function(){
    //Get all average scores and the number of reviews from the currently selected dorm
    firebase.database().ref("/" + schoolName + "/ratings/" + currentDormSelected + "/").once("value").then(function(snap){
      numReviews = parseInt(snap.val().numReviews);
      avgBathroom = parseInt(snap.val().avgBathroom);
      avgBuilding = parseInt(snap.val().avgbuilding);
      avgCulture = parseInt(snap.val().avgCulture);
      avgGymDist = parseInt(snap.val().avgGymDist);
      avgPartyDist = parseInt(snap.val().avgPartyDist);
      avgRoom = parseInt(snap.val().avgRoom);
      avgStudyDist = parseInt(snap.val().avgStudyDist);
    }).then(function(){
      //Fill the cultureArr with the score for each culture and sort array once filled
      firebase.database().ref("/" + schoolName + "/ratings/" + currentDormSelected + "/").once("value").then(function(snap){

          var numGreekReviews = snap.child("culture").child("Greek").val();
          cultureArr[0] = new cultureReviewObject(numGreekReviews, "Greek");

          var numHipsterReviews = snap.child("culture").child("Hipster").val();
          cultureArr[1] = new cultureReviewObject(numHipsterReviews, "Hipster");

          var numPlayHardReviews = snap.child("culture").child("Play-hard").val();
          cultureArr[2] = new cultureReviewObject(numPlayHardReviews, "Play-hard");

          var numQuietReviews = snap.child("culture").child("Quiet").val();
          cultureArr[3] = new cultureReviewObject(numQuietReviews, "Quiet");

          var numSocialReviews = snap.child("culture").child("Social").val();
          cultureArr[4] = new cultureReviewObject(numSocialReviews, "Social");

          var numSportyReviews = snap.child("culture").child("Sporty").val();
          cultureArr[5] = new cultureReviewObject(numSportyReviews, "Sporty");

          var numWorkHardReviews = snap.child("culture").child("Work-hard").val();
          cultureArr[6] = new cultureReviewObject(numWorkHardReviews, "Work-hard");

          //Set sortedCulture equal to the sorted cultureArr
          sortedCulture = getSortedCultures(cultureArr);

        //snap is equal to the json object representing this dorm
        snap.forEach(function(childSnap){
          //Iterate through each review and populate page appropriately, while ignoring all reviews that don't correspond to a user review
          if(childSnap.key != "numReviews" && childSnap.key !="Objective Info" && childSnap.key!="avgBathroom" &&
        childSnap.key!="avgbuilding" && childSnap.key!="avgCulture" && childSnap.key!="avgGymDist" && childSnap.key!="avgPartyDist" && childSnap.key!="avgRoom" && childSnap.key!="avgStudyDist" && childSnap.key!="culture"){
            var ratingInfo = childSnap.val();
            var bathroom = parseInt(ratingInfo.bathroom);
            var building = parseInt(ratingInfo.building);
            var room = parseInt(ratingInfo.room);
            var writtenReview = ratingInfo.review;
            var name = ratingInfo.name;
            var culture = ratingInfo.culture;
            var date = ratingInfo.date;
            var year = ratingInfo.year;
            var room = parseInt(ratingInfo.room);
            var partyDist = parseInt(ratingInfo.partyProximity);
            var studyDist = parseInt(ratingInfo.studyProximity);
            var gymDist = parseInt(ratingInfo.gymProximity);
            var overall = Number((bathroom + building + room)/(3)).toFixed(1);

            var clean = "dirty";
            if(building >=3){
              clean="clean";
            }

            //Append all info inside of the commentsHolder
            $("#commentsHolder").append("<div class=\"comment\"><div class=\"tagscontainer\"><div class=\"tagstitle\"><p5>" + date +
            "</p5></div><div class=\"year\"><p5>" + year + "</p5></div><div class=\"tag\"><p5>" + culture + "</p5></div></div>" +
            "<div class=\"commentcontainer\"><div class=\"dormrating\"><div class=\"commentrate\"><div class=\"row\"><div class=\"box4\">" +
            "<p8>" + overall + "</p8></div><div class=\"description1\"><p8 class=\"info2\">OVERALL</p8></div></div>" +
            "<div class=\"row\"><div class=\"box3\"><p7>" + room + "</p7></div><div class=\"description1\"><p7 class=\"info2\">ROOM</p7></div></div>" +
            "<div class=\"row\"><div class=\"box3\"><p7>" + building + "</p7></div><div class=\"description1\"><p7 class=\"info2\">BUILDING</p7></div></div>" +
            "<div class=\"row\"><div class=\"box3\"><p7>" + bathroom + "</p7></div><div class=\"description1\"><p7 class=\"info2\">BATHROOM</p7></div></div>" +
            "</div></div>" + "<div class=\"commentsection\"><p9>" + writtenReview + "</p9></div></div></div>");
          }
        })
    }).then(function(){
      var finalScore = Number((avgRoom+avgBathroom+avgBuilding)/3).toFixed(1);//Get the avg overall score to one decimal point
      $(".dormtitle").empty();
      $(".dormtitle").append("<h8>" + currentDormSelected + "</h8>");
      $(".left > h10").empty();
      $(".left > h10").append(finalScore);

      $("#roomPar").text(avgRoom);
      $("#bathroomPar").text(avgBathroom);
      $("#kitchenPar").text(avgBuilding)

      var studyDistPerc = Math.round((avgStudyDist/15)*50) + 50;
      $("#distToStudy").width(studyDistPerc+"%");
      $("#graph div:nth-child(2) > p3").text(avgStudyDist + "min");

      var partyDistPerc = Math.round((avgPartyDist/15)*50) + 50;
      $("#distToParty").width(partyDistPerc+"%")
      $("#graph div:nth-child(3) > p3").text(avgPartyDist + "min");

      var gymDistPerc = Math.round((avgGymDist/15)*50) + 50;
      $("#distToGym").width(gymDistPerc+"%");
      $("#graph div:nth-child(4) > p3").text(avgGymDist + "min");

      $("#dormmain div:nth-child(2) > p6").text(sortedCulture[0].getName());
      $("#dormmain div:nth-child(3) > p6").text(sortedCulture[1].getName());


      $("#population").text(population + " RESIDENTS")
      if(dormStyle == "Hall"){
        $("#hallStyle").text("HALL STYLE");
      }else{
        $("#hallStyle").text("SUITE STYLE");
      }

      if(laundry == "yes"){
        $("#laundry").text("LAUNDRY ROOMS");
      }else{
        $("#laundry").text("NO LAUNDRY ROOMS");
      }
    })

    })
  });
}

//Populates both the roomObjects and currentRooms arrays with all values from the appropriate firebase node
function generateDormObjects(){
  firebase.database().ref("/" + schoolName + "/ratings/").on("child_added", function(snapshot){
    var snapVal = snapshot.val();
    var room = new roomObj(snapshot.key, snapVal.avgBathroom, snapVal.avgbuilding, snapVal.avgGymDist, snapVal.avgPartyDist, snapVal.avgRoom, snapVal.avgStudyDist, snapVal.avgCulture);
    roomObjects.push(room);
    currentRooms.push(room);
  })
}

//Store the name of a culture review and the number of votes is has
function cultureReviewObject(score, name){
  this.score = score;
  this.name = name;

  this.getScore = function(){
    return this.score;
  }

  this.getName = function(){
    return this.name;
  }
}

function getSortedCultures(arr){//array of cultureReviewObjects; this will sort the array according to score val.
  var arr2 = arr;
  for(var j=0; j<arr.length-1; j++){
    for(var i=0; i<arr.length-1; i++){
      if(arr[i].getScore() < arr[i+1].getScore()){
        var temp = arr2[i];
        arr2[i] = arr2[i+1];
        arr2[i+1] = temp;
      }
    }
  }
  return arr2;
}

$("#sortButton").click(function(){
  var sortParam = $("#sortOption").find(":selected").text();
  var filterParam = $("#filterOption").find(":selected").text();
  var noSortParam = false; //should be true if no sort parameter is selected
  var noFilterParam = false; // should be true if no filter parameter is selected
  if(sortParam == "Sort by"){
    noSortParam = true;
    sortParam = "Overall Rating"; //If no sortParam is selected, filter by overall rating
  }

  if(filterParam == "Filter by"){
    noFilterParam = true;
  }

  var newDorms = [];
  for(var i = 0; i<roomObjects.length; i++){ //Filter out the dorms with mismatching culture from the one requested
    if(filterParam == roomObjects[i].getCulture()){
      newDorms.push(roomObjects[i]);
    }else if(noFilterParam){ //if no filter parameter is selected, display results for all dorms
      newDorms.push(roomObjects[i]);
    }
  }

  if(sortParam == "Proximity to Class" || sortParam == "Proximity to Party" || sortParam == "Proximity to Workout"){
    for(var n=0; n<newDorms.length; n++){
      for(var i=newDorms.length-1; i>0; i--){
        if(newDorms[i].get(sortParam) < newDorms[i-1].get(sortParam) || newDorms[i-1].get(sortParam) == undefined){
          var temp = newDorms[i];
          newDorms[i] = newDorms[i-1];
          newDorms[i-1] = temp;
        }
      }
    }
  }else{//Sort the list of dorms after filtering based on sortParam
    for(var n=0;n<newDorms.length; n++){
      for(var i=0;i<newDorms.length-1; i++){
        if(newDorms[i].get(sortParam) < newDorms[i+1].get(sortParam) || newDorms[i].get(sortParam) == undefined){
          var temp = newDorms[i];
          newDorms[i] = newDorms[i+1];
          newDorms[i+1] = temp;
        }
      }
    }

  }

  //Now that dorms are sorted, we write them to page
  //Remove all children of rankings to make space for new filter
  $("#rankings").empty();
  for(var i=0; i<newDorms.length; i++){
      $("#rankings").append("<div class=\'ranking\'><div class=\'number\'><h12>" + parseInt(i+1) + "<h/12></div>" +
    "<div class=\'name\'><h11>" + newDorms[i].getDormName() + "</h11></div>" + "<div class=\'overallscore\'><h13>" + newDorms[i].get(sortParam) + "</h13></div></div>");
  }

})

$("#filterButton").click(function(){
    $("#sortButton").click();
});

$("#writeareview").click(function(){
  window.location = "../../writeReview.html";
})


//Managing search bar navigation
$(".searchbar").keyup(function(event){
  var searchType = $("#searchtype").find(":selected").text();
  $(".dropdown").show();
  var keyPress;
  if(window.event){//IE
    keyPress = event.which;
  }else{keyPress = event.keyCode;}

  if(keyPress == 13){//If enter button is pressed either redirect to top match, or print error.
    if(currentOptions.length == 0){
      //Need to add redirect code
    }else{
      //Need to add redirect code
    }
  }else{
    $(".dropdown").empty();
    currentOptions = [];
  }

  var userInput = $(".searchBar1").val();
  var userInput2 = $(".searchBar2").val();
  if(searchType == "Dorm"){
    //Get dorms that match the current query in the search bar entered by user
    for(var i=0; i<dormNames.length; i++){
      if(userInput.length>dormNames[i][0].length){
        continue;
      }

      //If query matches corresponding characters in dorms, add to currentOptions and append to dropdown
      if(dormNames[i][0].slice(0,userInput.length).toLowerCase() == userInput.toLowerCase()){
        currentOptions.push(dormNames[i]);
        //Standard dropdown
        $(".dropdown1").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i][0] + " - " + dormNames[i][1] + "</p14></div>");
      }

      if(dormNames[i][0].slice(0,userInput2.length).toLowerCase() == userInput2.toLowerCase()){
        currentOptions.push(dormNames[i]);
        //mobile dropdown
        $(".dropdown2").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i][0] + " - " + dormNames[i][1] + "</p14></div>");
      }

    }
  }else{
    for(var i=0; i<schoolNames.length; i++){
      if(userInput.length>schoolNames[i].length){
        continue;
      }

      //If query matches corresponding characters in schools, add to current options and append to dropdown
      if(schoolNames[i].slice(0,userInput.length).toLowerCase() == userInput.toLowerCase()){
        currentOptions.push(schoolNames[i]);
        //Standard dropdown
        $(".dropdown1").append("<div class=\'dropdowncontent\'><p14>" + schoolNames[i] + "</p14></div>");
      }

      if(schoolNames[i].slice(0,userInput2.length).toLowerCase() == userInput2.toLowerCase()){
        currentOptions.push(schoolNames[i]);
        //mobile dropdown
        $(".dropdown2").append("<div class=\'dropdowncontent\'><p14>" + schoolNames[i] + "</p14></div>");
      }
    }
  }
})

//Listener for click in search bar. On click adjust corners of search bar, make dropdown visible and append all dorms
$(".searchbar").click(function(){
  var searchType = $("#searchtype").find(":selected").text();
  $(this).attr("placeholder", "");
  $(this).css("border-radius","5px 0px 0px 0px");
  $("#mobileSearch").css("border-radius", "0px 0px 0px 0px");
  $("#searchbutton").css("border-radius","0px 5px 0px 0px");

  $(".dropdown1").empty();
  $(".dropdown2").empty();
  if(searchType == "Dorm"){
    for(var i=0; i<dormNames.length; i++){
      $(".dropdown1").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i][0] + " - " + dormNames[i][1] + "</p14></div>");
      $(".dropdown2").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i][0] + " - " + dormNames[i][1] + "</p14></div>");
    }
  }else{
    for(var i=0; i<schoolNames.length; i++){
      $(".dropdown1").append("<div class=\'dropdowncontent\'><p14>" + schoolNames[i] + "</p14></div>");
      $(".dropdown2").append("<div class=\'dropdowncontent\'><p14>" + schoolNames[i] + "</p14></div>");
    }
  }
  $(".dropdown1").show();//Show normal drop down
  $(".dropdown2").show();//Show mobile drop down
})

$(document).on("mousedown", "div.dropdowncontent", function(){
  $("#logobar").focus();
  var searchType = $("#searchtype").find(":selected").text();
  if(searchType == "Dorm"){
    var dormName = $(this).children("p14").html().split(" - ")[0];
    var schoolName = $(this).children("p14").html().split(" - ")[1];
    window.location = "../" + schoolName + "/" + dormName + ".html";
  }else{
    var schoolName = $(this).children("p14").html();
    window.location = "../" + schoolName + "/Landingpage.html";
  }
})

$("#logobar").focusout(function(){
  $(".dropdown").hide();
  $(".searchBar1").css("border-radius","5px 0px 0px 5px");
  $(".searchBar2").css("border-radius", "0px 0px 0px 0px");
  $("#searchbutton").css("border-radius","0px 5px 5px 0px");
  $(".searchbar").val("");
})

$(".ranking").click(function(){
  var dormName = $(this).find("h11").html();
  window.location = "../" + schoolName + "/" + dormName + ".html";
})

//Same functionality of listener above (".ranking").click...but allows for dynamic binding whenever a ".ranking" element is created
$("#rankings").on("click", ".ranking", function(){
  var dormName = $(this).find("h11").html();
  window.location = "../" + schoolName + "/" + dormName + ".html";
})

$("#contactLink").click(function(){
  window.location = "../../contact.html";
})

$("#legalLink").click(function(){
  window.location = "../../Legal.html";
})

$("#aboutLink").click(function(){
  window.location = "../../index.html#theteam";
})

$(".mobileReview").click(function(){
  window.location = "../../writeReview.html";
})

$("#writeReview").click(function(){
  window.location="../../writeReview.html";
})

$("#closemobile").click(function(){
  $("#mobilepopup").toggle();
});
