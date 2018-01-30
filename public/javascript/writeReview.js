var currentNumberOfRatings;//Global var to be updated with the current number of ratings
//dormNamesWritRev holds names of all dorms we will display as review options
var dormNamesWriteRev = [];
var schoolNamesWriteRev = [];
//Add all possible dorm names to dormNamesWriteRev array upon loading of html page
//Also, the dormNamesWriteRev variable mimics what dormNames accomplishes in headerSearch.js but needs different name to allow for seperate array
$(document).ready(function(){
    //Add every dorm name in dormNamesWriteRev to the dropdown for selecting what dorm to review
    firebase.database().ref("/").once("value").then(function(snap){
      snap.forEach(function(schoolNode){
        var key = schoolNode.key;
        var ratings = schoolNode.val().ratings;
        if(!(key == "Contact Messages")){
          schoolNamesWriteRev.push(key);
          for (dorm in ratings){
            //Create array, where first element is name of dorm, second is name of school.
            var nextDorm = [];
            nextDorm.push(dorm);
            nextDorm.push(key);
            dormNamesWriteRev.push(nextDorm);
          }
        }
      })
    }).then(function(){
      for(var i=0; i<schoolNamesWriteRev.length; i++){
        $("#school").append("<option id=\"" + schoolNamesWriteRev[i].toLowerCase() + "\">" + schoolNamesWriteRev[i] + "</option>");
      }
    })
})



var cultureArr = ["Greek", "Work-hard", "Play-hard", "Hipster", "Quiet", "Social", "Sporty"];

var bathroomRadios = $(".bathroomRating");
var cleanlinessRadios = $(".cleanlinessRating");
var kitchenRadios = $(".kitchenRating");

//On submit check that all fields are filled in and update appropriate database fields
$("#submit").click(function(){
  //Check for all inputs
  if(checkForInputs() == false){
    alert("Please make sure all fields are filled in.");
  }else{
    //Get all inputs from appropriate jquery selectors and make mouse wait
    $('.loadPlaceHolder').toggle();
    $(this).css("cursor", "wait");
    var reviewerName = $("#name").val();
    var email = $("#email").val();
    var yearInDorm = $("#yearSelector").find(":selected").text();
    var dorm = $("#dormName").find(":selected").text();
    var bathroomRating = $("input:radio[name ='bathroomStar']:checked").val();
    var buildingRating = $("input:radio[name ='buildingStar']:checked").val();
    var roomRating = $("input:radio[name ='roomStar']:checked").val();
    var studyProximityRating = parseInt($("#slider1").val());
    var partyProximityRating = parseInt($("#slider2").val());
    var gymProximityRating = parseInt($("#slider6").val());
    var cultureReview = $("#cultureSelector").find(":selected").text();
    var writtenReview = $("#textReview").val();
    var recommendationVal = $("input:radio[name ='recommend']:checked").val();
    var school = $("#school").find(":selected").text();

    //Initialize firebase database var, dormRatingNode var, get date, and generate new node
    var database = firebase.database();
    var dormRatingNode = database.ref("/" + school + "/ratings/" + dorm + "/");
    var d = new Date();
    var dateWritten = (d.getMonth()+1).toString() + "/" + d.getDate().toString() + "/" + d.getFullYear().toString();

    var thisPush = dormRatingNode.push();
    //set new data fields for this review
    thisPush.set({
      name: reviewerName,
      email: email,
      year: yearInDorm,
      bathroom:bathroomRating,
      building: buildingRating,
      studyProximity: studyProximityRating,
      partyProximity: partyProximityRating,
      gymProximity: gymProximityRating,
      culture: cultureReview,
      review: writtenReview,
      room: roomRating,
      recomendation:recommendationVal,
      date: dateWritten
    });

    //Update culture rating in firebase
    dormRatingNode.once("value").then(function(snap){
      if(snap.hasChild("culture")){
        //increment score for selected culture rating and update highest score
        var currentCulture = snap.child("culture").child(cultureReview).val();
        currentCulture = currentCulture + 1;

        dormRatingNode.child("culture").child(cultureReview).set(currentCulture);
        var currentHighestVotes = snap.child("avgCulture").val();
        if(currentCulture > currentHighestVotes || currentHighestVotes == undefined || currentHighestVotes == null){
          dormRatingNode.child("avgCulture").set(cultureReview);
        }
      }else{
        //Initialize culture ratings at 0, and set avgCulture as the selected culture
        for(var i=0; i<cultureArr.length; i++){
          if(cultureArr[i]!=cultureReview){
            dormRatingNode.child("culture").child(cultureArr[i]).set(0);
          }else{
            dormRatingNode.child("culture").child(cultureReview).set(1);
          }
        }
        dormRatingNode.child("avgCulture").set(cultureReview);
      }

    }).then(function(){
        //Update number of ratings in firebase
        dormRatingNode.once("value").then(function(snap){//update the number of ratings
        currentNumberOfRatings = parseInt(snap.val().numReviews);

        currentNumberOfRatings = currentNumberOfRatings+1;
        dormRatingNode.child("numReviews").set(currentNumberOfRatings);
      }).then(function(){
        //Update the averages for this dorm.
        var avgGymDist;
        var avgBathroom;
        var avgBuilding;
        var avgStudyDist;
        var avgPartyDist;
        var avgCulture;
        var avgRoom;
        dormRatingNode.once("value").then(function(snapshot){
          //Update avgGymDist score if it exists, otherwise initialize to score from this review
            if(snapshot.hasChild("avgGymDist")){
              avgGymDist = snapshot.child("avgGymDist").val();
              avgGymDist = (avgGymDist)*(currentNumberOfRatings-1) + parseInt(gymProximityRating);
              avgGymDist = Math.round(avgGymDist/currentNumberOfRatings);
              dormRatingNode.child("avgGymDist").set(parseInt(avgGymDist));
            }else{
              dormRatingNode.child("avgGymDist").set(parseInt(gymProximityRating));
            }
          //Update avgBathr0om score if it exists, otherwise initialize to score from this review
            if(snapshot.hasChild("avgBathroom")){
              avgBathroom = snapshot.child("avgBathroom").val();
              avgBathroom = (avgBathroom)*(currentNumberOfRatings -1) + parseInt(bathroomRating);
              avgBathroom = Math.round(avgBathroom/currentNumberOfRatings);
              dormRatingNode.child("avgBathroom").set(parseInt(avgBathroom));
            }else{
              dormRatingNode.child("avgBathroom").set(parseInt(bathroomRating));
            }
          //Update avgbuilding score if it exists, otherwise initialize to score from this review
            if(snapshot.hasChild("avgbuilding")){
              avgBuilding = snapshot.child("avgbuilding").val();
              avgBuilding = (avgBuilding)*(currentNumberOfRatings - 1) + parseInt(buildingRating);
              avgBuilding = Math.round(avgBuilding/currentNumberOfRatings);
              dormRatingNode.child("avgbuilding").set(parseInt(avgBuilding));
            }else{
              dormRatingNode.child("avgbuilding").set(parseInt(buildingRating));
            }
          //Update avgStudyDist score if it exists, otherwise initialize to score from this review
            if(snapshot.hasChild("avgStudyDist")){
              avgStudyDist = snapshot.child("avgStudyDist").val();
              avgStudyDist = (avgStudyDist)*(currentNumberOfRatings - 1) + parseInt(studyProximityRating);
              avgStudyDist = Math.round(avgStudyDist/currentNumberOfRatings);
              dormRatingNode.child("avgStudyDist").set(parseInt(avgStudyDist));
            }else{
              dormRatingNode.child("avgStudyDist").set(parseInt(studyProximityRating));
            }
          //Update avgPartyDist score if it exists, otherwise initialize to score from this review
            if(snapshot.hasChild("avgPartyDist")){
              avgPartyDist = snapshot.child("avgPartyDist").val();
              avgPartyDist = (avgPartyDist)*(currentNumberOfRatings - 1) + parseInt(partyProximityRating);
              avgPartyDist = Math.round(avgPartyDist/currentNumberOfRatings);
              dormRatingNode.child("avgPartyDist").set(parseInt(avgPartyDist));
            }else{
              dormRatingNode.child("avgPartyDist").set(parseInt(partyProximityRating));
            }

          //Update culture score from this review (not sure if this was already accomplished in earlier portion of review)
            var numOfCulturePoints = snapshot.child("culture").child(cultureReview).val();
            numOfCulturePoints = numOfCulturePoints + 1;
            var currentPopularCulture = snapshot.child("avgCulture").val();
            var currentVotesMostPopular = snapshot.child("culture").child(currentPopularCulture).val();
            if(numOfCulturePoints > currentVotesMostPopular){
              dormRatingNode.child("avgCulture").set(cultureReview);
            }
          //Update avgRoom score if it exists, otherwise initialize to score from this review
            if(snapshot.hasChild("avgRoom")){
              avgRoom = snapshot.child("avgRoom").val();
              avgRoom = (avgRoom)*(currentNumberOfRatings - 1) + parseInt(roomRating);
              avgRoom = Math.round(avgRoom/currentNumberOfRatings);
              dormRatingNode.child("avgRoom").set(parseInt(avgRoom));
            }else{
              dormRatingNode.child("avgRoom").set(parseInt(roomRating));
            }
          }).then(function(){
            //Redirect after 3 seconds; long enough to write review information to firebase
            setTimeout(function(){
              window.location = "exitReview.html";
            }, 3000)

          });
      })
    })
  }
});

function checkForInputs(){
  //return true or false depending on whether or not values from inputs have been chosen
  var isIncomplete = true;
  if($("#yearSelector").find(":selected").text() == "Select"){
    $("#yearSelector").css("border", "solid 2px red");
    isIncomplete = false;
  }else{
    $("#yearSelector").css("border", "solid 2px #97C0E4");
  }

 if($("#cultureSelector").find(":selected").text() == "Select"){
   $("#cultureSelector").css("border", "solid 2px red");
    isIncomplete = false;
  }else{
    $("#cultureSelector").css("border", "solid 2px #97C0E4");
  }

  if($("input:radio[name ='recommend']:checked").val() == undefined){
    $("#recommendationSelector").css("border", "solid 2px red");
    isIncomplete = false;
  }else{
    $("#recommendationSelector").css("border", "0");
  }

  if($("input:radio[name ='bathroomStar']:checked").val() == undefined){
    $("#roomHolder").css("border", "solid 2px red");
    isIncomplete = false;
  }else{
    $("#roomHolder").css("border", "0");
  }

  if($("input:radio[name ='buildingStar']:checked").val() == undefined){
    $("#buildingHolder").css("border", "solid 2px red");
    isIncomplete = false;
  }else{
    $("#buildingHolder").css("border", "0");
  }

  if($("input:radio[name ='roomStar']:checked").val() == undefined){
    $("#bathroomHolder").css("border", "solid 2px red");
    isIncomplete = false;
  }else{
    $("#bathroomHolder").css("border", "0");
  }

  if($("#name").val() == ""){
    $("#name").css("border", "solid 2px red");
    isIncomplete = false;
  }else{
    $("#name").css("border", "solid 2px #97C0E4");
  }

  if($("#email").val() == ""){
    $("#email").css("border", "solid 2px red");
    isIncomplete = false;
  }else{
    $("#email").css("border", "solid 2px #97C0E4");
  }

  if(!($("#agreeToTerms").is(":checked"))){
    console.log("agreeToTerms isn't checked");
    $("#agreeToTermsHolder").css("border", "solid 2px red");
    isIncomplete = false;
  }else{
    console.log("agreeToTerms is checked");
    $("#agreeToTermsHolder").css("border", "0");
  }

  if($("#textReview").val().split(' ').length <15){
    $("#textReview").css("border", "solid 2px red");
    isIncomplete = false;
  }else{
    $("#textReview").css("border", "solid 2px #97C0E4");
  }

  if($("#dormName").find(":selected").text() == "Select"){
    $("#dormName").css("border", "solid 2px red");
    isIncomplete = false;
  }else{
    $("#dormName").css("border", "solid 2px #97C0E4");
  }

  if($("#school").find(":selected").text() == "Select"){
    $("#school").css("border", "solid 2px red");
    isIncomplete = false;
  }else{
    $("#school").css("border", "solid 2px #97C0E4");
  }

  return isIncomplete;
}

//Logic to handle school and dorm selection; force user to select a school before selecting a dorm, and toggle list of dorms based on school selected.
$("#school").change(function(){
  //Empty options and then write Select as first option
  $("#dormName").empty();
  $("#dormName").append("<option>Select</option>")
  if($("#school").find(":selected").text() != "Selected"){
    $("#chooseSchool").css("visibility", "hidden");
    $("#school").css("border", "solid 2px #97C0E4");
  }
  for(var i=0; i<dormNamesWriteRev.length; i++){
    //Check if the school for current dorm matches the school just selected
    if(dormNamesWriteRev[i][1] == $("#school").find(":selected").text()){
      $("#dormName").append("<option id=\"" + dormNamesWriteRev[i][0].toLowerCase() + "\">" + dormNamesWriteRev[i][0] + "</option>");
    }else{
      continue;
    }
  }
})
//If user clicks choose a dorm selector before the school selector, redirect them to pick school
$("#dormName").click(function(){
  if($("#school").find(":selected").text() == "Select"){
    $("#chooseSchool").css("visibility", "visible");
    $("#school").css("border", "solid 2px #ff0000");
  }
})

//Listen to dropdown even when on mobile
$(document).on("mousedown", "div.dropdowncontent", function(){
  $("#logobar").focus();
  var searchType = $("#searchtype").find(":selected").text();
  if(searchType == "Dorm"){
    var dormName = $(this).children("p14").html().split(" - ")[0];
    var schoolName = $(this).children("p14").html().split(" - ")[1];
    window.location = "dorms/" + schoolName + "/" + dormName + ".html";
  }else{
    var schoolName = $(this).children("p14").html();
    window.location = "dorms/" + schoolName + "/Landingpage.html";
  }
})

//Listen for the user to click on the search bar and append all dorms to the dropdown when they do.
$(".searchbar").click(function(){
  var searchType = $("#searchtype").find(":selected").text();
  $(this).attr("placeholder", "");//Clear text in search bar
  //Fix corners of search button
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


//When user clicks outside of logobar hide dropdown, fix corners, and replace the searchbar text
$("#logobar").focusout(function(){
  $(".dropdown").hide();
  $(".searchbar").css("border-radius","5px 0px 0px 5px");
  $("#searchbutton").css("border-radius","0px 5px 5px 0px");
  $(".searchbar").attr("placeholder", "Search...");
})
