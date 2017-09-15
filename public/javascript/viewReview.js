var roomObjects = []; //This is where objects representing all the dorms will be placed
var currentRooms = []; //This is where objects representing the currently displayed dorms will be placed.
const topPossibleScore = 20; //4 different areas of quantitative review therefore, with each one out of 5, top score possible is 20;
$("#writeReview").click(function(){
  window.location="../html/writeReview.html";
})

//Class to be placed into arrays, holding average ratings for the various facets of a dorm
//Need to add getters for this class

generateDormObjects()
var dormNames = ["Alderman", "Alexander", "Avery", "Aycock", "Carmichael",
"Cobb","Connor", "Craige", "Craige North", "Ehringhaus", "Everett", "Graham", "Grimes",
"Hardin", "Hinton James", "Horton", "Joyner", "Kenan", "Koury", "Lewis", "Mangum", "Manly",
"McIver", "Morrison", "Old East", "Old West", "Parker", "Ruffin", "Spencer", "Stacy", "Teague",
"Winston", "Granville"];

for(var i=0; i<dormNames.length; i++){
  $("#rankings").append("<div class=\'ranking\'><div class=\'number\'><h12>" + i + "</h12></div>" +
  "<div class=\'name\'><h11>" + dormNames[i] + "</h11></div>" + "<div class=\'overallscore\'><h13>" + 1.0 + "</h13></div></div>");
}


var currentDormSelected = "Alderman"
$("#reviewHolder").empty();
getCurrentInfo();

$(".ranking").click(function(){
  currentDormSelected = $(this).children(".name").children("h11").text()
  console.log("dorm that was clicked is " + currentDormSelected)
  $("#closeReviewNav").click();
  $("#reviewHolder").empty();
  $(".dormtitle > h8").empty();
  $(".dormtitle > h2").text(currentDormSelected);
  console.log(currentDormSelected);
  getCurrentInfo();
})

$("#sortButton").click(function(){

})

function getCurrentInfo(){
  $("#reviewHolder").empty();
  $("#commentsHolder").empty();
  var numReviews;
  var topTotalScorePossible;
  var dormStyle;
  var laundry;
  var population;
  var grandScore = 0;
  var grandStudyDist = 0;
  var grandPartyDist = 0;
  var grandGymDist = 0;
  var grandKitchenScore = 0;

  var avgBathroom;
  var avgCleanliness;
  var avgCulture;
  var avgGymDist;
  var avgKitchen;
  var partyDist;
  var avgRoom;
  var avgStudyDist;

  firebase.database().ref("UNC-CH/ratings/" + currentDormSelected + "/Objective Info/").once("value").then(function(snapshot){
    population = snapshot.child("Population").val();
    laundry = snapshot.child("Laundry").val();
    dormStyle = snapshot.child("Dorm Style");
  }).then(function(){
    firebase.database().ref("UNC-CH/ratings/" + currentDormSelected + "/").once("value").then(function(snap){
      numReviews = parseInt(snap.val().numReviews);
      topTotalScorePossible = topPossibleScore * numReviews;
      avgBathroom = parseInt(snap.val().avgBathroom);
      avgCleanliness = parseInt(snap.val().avgCleanliness);
      avgCulture = parseInt(snap.val().avgCulture);
      avgGymDist = parseInt(snap.val().avgGymDist);
      avgKitchen = parseInt(snap.val().avgKitchen);
      avgPartyDist = parseInt(snap.val().avgPartyDist);
      avgRoom = parseInt(snap.val().avgRoom);
      avgStudyDist = parseInt(snap.val().avgStudyDist);
      console.log(numReviews);
    }).then(function(){
      firebase.database().ref("UNC-CH/ratings/" + currentDormSelected + "/").once("value").then(function(snap){
        snap.forEach(function(childSnap){
          if(childSnap.key != "numReviews" && childSnap.key !="Objective Info" && childSnap.key!="avgBathroom" &&
        childSnap.key!="avgCleanliness" && childSnap.key!="avgCulture" && childSnap.key!="avgGymDist" && childSnap.key!="avgKitchen"
      && childSnap.key!="avgPartyDist" && childSnap.key!="avgRoom" && childSnap.key!="avgStudyDist" && childSnap.key!="culture"){
            console.log("review key is" + childSnap.key);
            var ratingInfo = childSnap.val();
            console.log(ratingInfo);
            var bathroom = parseInt(ratingInfo.bathroom);
            var cleanliness = parseInt(ratingInfo.cleanliness);
            var kitchen = parseInt(ratingInfo.kitchen);
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
            var overall = Math.round(((bathroom + cleanliness + kitchen + partyDist + studyDist + gymDist)/(15*6))*100);

            var clean = "dirty";
            if(cleanliness >=7){
              clean="clean";
            }

            var totalScore = bathroom + cleanliness + kitchen + room;
            var weightedScore = totalScore/topPossibleScore;
            var weightedScorePercent = Math.round(weightedScore*100);
            grandScore = grandScore + totalScore;
            grandPartyDist = grandPartyDist + partyDist;
            grandStudyDist = grandStudyDist + studyDist;
            grandGymDist = grandGymDist + gymDist;
            grandKitchenScore = grandKitchenScore + kitchen;

            $("#commentsHolder").append("<div class=\"comment\"><div class=\"tagscontainer\"><div class=\"tagstitle\"><p5>" + date +
            "</p5></div><div class=\"year\"><p5>" + year + "</p5></div><div class=\"tag\"><p5>" + culture + "</p5></div></div>" +
            "<div class=\"commentcontainer\"><div class=\"dormrating\"><div class=\"commentrate\"><div class=\"row\"><div class=\"box4\">" +
            "<p8>" + overall + "</p8></div><div class=\"description1\"><p8 class=\"info2\">OVERALL</p8></div></div>" +
            "<div class=\"row\"><div class=\"box3\"><p7>" + room + "</p7></div><div class=\"description1\"><p7 class=\"info2\">ROOM</p7></div></div>" +
            "<div class=\"row\"><div class=\"box3\"><p7>" + bathroom + "</p7></div><div class=\"description1\"><p7 class=\"info2\">BATHROOM</p7></div></div>" +
            "<div class=\"row\"><div class=\"box3\"><p7>" + kitchen + "</p7></div><div class=\"description1\"><p7 class=\"info2\">KITCHEN</p7></div></div>" +
            "</div></div>" + "<div class=\"commentsection\"><p9>" + writtenReview + "</p9></div></div></div>");
          }
        })
    }).then(function(){
      console.log("grand score is " + grandScore + " top possible score is " + topTotalScorePossible);
      var finalPercentage = Number(grandScore/topTotalScorePossible).toFixed(2);
      $(".dormtitle").empty();
      $(".dormtitle").append("<h8>" + currentDormSelected + "</h8>");
      $(".left > h10").empty();
      $(".left > h10").append(finalPercentage + "%");

      console.log("avg room is " + avgRoom);
      console.log("avg bathroom is " + avgBathroom);
      console.log("avg kitchen is " + avgKitchen);
      $("#roomPar").text(avgRoom);
      $("#bathroomPar").text(avgBathroom);
      $("#kitchenPar").text(avgKitchen);

      var studyDistPerc = Math.round((avgStudyDist/15)*50) + 50;
      $("#distToStudy").width(studyDistPerc+"%");
      $("#graph div:nth-child(2) > p3").text(avgStudyDist + "min");

      var partyDistPerc = Math.round((avgPartyDist/15)*50) + 50;
      $("#distToParty").width(partyDistPerc+"%")
      $("#graph div:nth-child(3) > p3").text(avgPartyDist + "min");

      var gymDistPerc = Math.round((avgGymDist/15)*50) + 50;
      $("#distToGym").width(gymDistPerc+"%");
      $("#graph div:nth-child(4) > p3").text(avgGymDist + "min");

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
      console.log("got into the part of getCurrentInfo that should re write everything");
    })

    })
  });
}

$("#sortButton").click(function(){
  var sortParam = $("#sortOption").find(":selected").text();
  var filterParam = $("#filterOption").find(":selected").text();
  console.log("sort parameter is " + sortParam);
  var newDorms = [];
  for(var i = 0; i<roomObjects.length; i++){ //Filter out the dorms with mismatching culture from the one requested
    if(filterParam == roomObjects[i].getCulture()){
      newDorms.push(roomObjects[i]);
      console.log("dorm just added has " + roomObjects[i].get(sortParam) + " for the sort parameter " + sortParam);
    }
  }
  if(sortParam == "Proximity to Study" && sortParam == "Proximity to Party" && sortParam == "Proximity to Workout"){
    for(var n=0; n<newDorms.length; n++){
      for(var i=newDorms.length-1; i>0; i--){
        if(newDorms[i].get(sortParam) > newDorms[i-1].get(sortParam) || newDorms[i-1].get(sortParam) == undefined){
          var temp = newDorms[i];
          newDorms[i] = newDorms[i-1];
          newDorms[i-1] = temp;
        }
      }
    }
  }else{//Sort the list of dorms after filtering
    for(var n=0;n<newDorms.length; n++){
      for(var i=0;i<newDorms.length-1; i++){
        if(newDorms[i].get(sortParam) > newDorms[i+1].get(sortParam) || newDorms[i+1].get(sortParam) == undefined){
          var temp = newDorms[i];
          newDorms[i] = newDorms[i+1];
          newDorms[i+1] = temp;
        }
      }
    }
  }

  console.log("number of dorms to be written to page is " + newDorms.length);
  //Now that dorms are sorted, we write them to page
  //Remove all children of rankings to make space for new filter
  $("#rankings").empty();
  for(var i=0; i<newDorms.length; i++){
      $("#rankings").append("<div class=\'ranking\'><div class=\'number\'><h12>" + parseInt(i+1) + "<h/12></div>" +
    "<div class=\'name\'><h11>" + currentRooms[i].getDormName() + "</h11></div>" + "<div class=\'overallscore\'><h13>" + currentRooms[i].get(sortParam) + "</h13></div></div>");
  }

})

$("#filterButton").click(function(){
  var sortParam = $("#sortOption").find(":selected").text();
  var filterParam = $("#filterOption").find(":selected").text();
  console.log("sort parameter is " + sortParam);
  var newDorms = [];
  for(var i = 0; i<roomObjects.length; i++){ //Filter out the dorms with mismatching culture from the one requested
    if(filterParam == roomObjects[i].getCulture()){
      newDorms.push(roomObjects[i]);
      console.log("dorm just added has " + roomObjects[i].get(sortParam) + " for the sort parameter " + sortParam);
      console.log("name of dorm just added is " + roomObjects[i].getDormName());
    }
  }
  if(sortParam == "Proximity to Study" && sortParam == "Proximity to Party" && sortParam == "Proximity to Workout"){
    for(var n=0; n<newDorms.length; n++){
      for(var i=newDorms.length-1; i>0; i--){
        if(newDorms[i].get(sortParam) > newDorms[i-1].get(sortParam) || newDorms[i-1].get(sortParam) == undefined){
          var temp = newDorms[i];
          newDorms[i] = newDorms[i-1];
          newDorms[i-1] = temp;
        }
      }
    }
  }else{//Sort the list of dorms after filtering
    for(var n=0;n<newDorms.length; n++){
      for(var i=0;i<newDorms.length-1; i++){
        if(newDorms[i].get(sortParam) > newDorms[i+1].get(sortParam) || newDorms[i+1].get(sortParam) == undefined){
          var temp = newDorms[i];
          newDorms[i] = newDorms[i+1];
          newDorms[i+1] = temp;
        }
      }
    }
  }

  console.log("number of dorms to be written to page is " + newDorms.length);
  //Now that dorms are sorted, we write them to page
  //Remove all children of rankings to make space for new filter
  $("#rankings").empty();
  for(var i=0; i<newDorms.length; i++){
    console.log("name of dorm about to be pushed to screen is " + newDorms[i].getDormName());
      $("#rankings").append("<div class=\'ranking\'><div class=\'number\'><h12>" + parseInt(i+1) + "<h/12></div>" +
    "<div class=\'name\'><h11>" + newDorms[i].getDormName() + "</h11></div>" + "<div class=\'overallscore\'><h13>" + newDorms[i].get(sortParam) + "</h13></div></div>");
  }

  //Need to add listener for if any of the dorms are clicked after they are filtered and displayed.
  $("#rankings").children().click(function(){
    currentDormSelected = $("#rankings > .ranking > .name > h11").text();
    getCurrentInfo();
    $("#closeReviewNav").click();
  })
  //Need to close pop up and return to newly rendered information

})

function roomObj(dormName, bathroom, cleanliness, gym, kitchen, party, room, study, culture){
    this.dormName = dormName;
    this.bathroom = bathroom;
    this.cleanliness = cleanliness;
    this.gym = gym;
    this.kitchen = kitchen;
    this.party = party;
    this.room = room;
    this.study = study;
    this.culture = culture;

    this.overall = Math.round((bathroom+cleanliness+gym+kitchen+party+room+study)/7);

  this.get = function(aspect){
    if(aspect == "Overall Rating"){
      return this.overall;
    }else if(aspect == "Room Rating"){
      return this.room;
    }else if(aspect == "Bathroom Rating"){
      return this.bathroom;
    }else if(aspect == "Kitchen Rating"){
      return this.kitchen;
    }else if(aspect == "Proximity to Study"){
      return this.study;
    }else if(aspect == "Proximity to Party"){
      return this.party;
    }else if(aspect == "Proximity to Workout"){
      return this.gym;
    }
  }

  this.getCulture = function(){
    return this.culture;
  }

  this.getOverall = function(){
    return this.overall;
  }

  this.getDormName = function(){
    return this.dormName;
  }

  this.getBathroom = function(){
    return this.bathroom;
  }

  this.getCleanliness = function(){
    return this.cleanliness
  }

  this.getGym = function(){
    return this.gym;
  }

  this.getKitchen = function(){
    return this.kitchen;
  }

  this.getParty = function(){
    return this.party;
  }

  this.getRoom = function(){
    return this.room;
  }

  this.getStudy = function(){
    return this.study;
  }
}

function generateDormObjects(){
  firebase.database().ref("/UNC-CH/ratings").on("child_added", function(snapshot){
    var snapVal = snapshot.val();
    var room = new roomObj(snapshot.key, snapVal.avgBathroom, snapVal.avgCleanliness, snapVal.avgGymDist, snapVal.avgKitchen, snapVal.avgPartyDist, snapVal.avgRoom, snapVal.avgStudyDist, snapVal.avgCulture);
    roomObjects.push(room);
    currentRooms.push(room);
    console.log("avg culture of " + room.getDormName() + " is " + room.getCulture());
  })
}
