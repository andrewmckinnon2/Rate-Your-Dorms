$(document).ready(function(){
const topPossibleScore = 45;
$("#writeReview").click(function(){
  window.location="../html/writeReview.html";
})

//Class to be placed into arrays, holding average ratings for the various facets of a dorm
class bathroomObj{
  constructor(dormName, bathroom, cleanliness, gym, kitchen, party, room, study){
    this.dormName = dormName;
    this.bathroom = bathroom;
    this.cleanliness = cleanliness;
    this.gym = gym;
    this.kitchen = kitchen;
    this.party = party;
    this.room = room;
    this.study = study;
  }

  getDormName(){
    return dormName;
  }
}

var dormNames = ["Alderman", "Alexander", "Avery", "Aycock", "Carmichael",
"Cobb","Connor", "Craige", "Craige North", "Ehringhaus", "Everett", "Graham", "Grimes",
"Hardin", "Hinton James", "Horton", "Joyner", "Kenan", "Koury", "Lewis", "Mangum", "Manly",
"McIver", "Morrison", "Old East", "Old West", "Parker", "Ruffin", "Spencer", "Stacy", "Teague",
"Winston", "Granville"];

for(var i=0; i<dormNames.length; i++){
  $("#dormsearch").append("<div class=\'ranking\'><div class=\'number\'><h12>" + i + "</h12></div>" +
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

  firebase.database().ref("UNC-CH/ratings/" + currentDormSelected + "/Objective Info/").once("value").then(function(snapshot){
    population = snapshot.child("Population").val();
    laundry = snapshot.child("Laundry").val();
    dormStyle = snapshot.child("Dorm Style");
  }).then(function(){
    firebase.database().ref("UNC-CH/ratings/" + currentDormSelected + "/").once("value").then(function(snap){
      numReviews = snap.val().numReviews;
      topTotalScorePossible = topPossibleScore * numReviews;
      console.log(numReviews);
    })
  }).then(function(){
    firebase.database().ref("UNC-CH/ratings/" + currentDormSelected + "/").once("value").then(function(snap){
      snap.forEach(function(childSnap){
        if(childSnap.key != "numReviews" && childSnap.key !="Objective Info"){
          var ratingInfo = childSnap.val();
          console.log(ratingInfo);
          var bathroom = parseInt(ratingInfo.bathroom);
          var cleanliness = parseInt(ratingInfo.cleanliness);
          var kitchen = parseInt(ratingInfo.kitchen);
          var writtenReview = ratingInfo.review;
          var name = ratingInfo.name;
          var culture = ratingInfo.culture;
          var date = ratingInfo.date;
          var year = ratingInfo.year;
          var room = ratingInfo.room;
          var partyDist = parseInt(ratingInfo.partyProximity);
          var studyDist = parseInt(ratingInfo.studyProximity);
          var gymDist = parseInt(ratingInfo.gymProximity);
          var overall = Math.round(((bathroom + cleanliness + kitchen + partyDist + studyDist + gymDist)/(15*6))*100);
          console.log("overall for rating is " + overall);
          var roomPerc = Math.round((room/15)*100);
          var bathroomPerc = Math.round((bathroom/15)*100);
          var kitchenPerc = Math.round((kitchen/15)*100);

          var clean = "dirty";
          if(cleanliness >=7){
            clean="clean";
          }

          var totalScore = bathroom + cleanliness + kitchen;
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
          "<div class=\"row\"><div class=\"box3\"><p7>" + roomPerc + "</p7></div><div class=\"description1\"><p7 class=\"info2\">ROOM</p7></div></div>" +
          "<div class=\"row\"><div class=\"box3\"><p7>" + bathroomPerc + "</p7></div><div class=\"description1\"><p7 class=\"info2\">BATHROOM</p7></div></div>" +
          "<div class=\"row\"><div class=\"box3\"><p7>" + kitchenPerc + "</p7></div><div class=\"description1\"><p7 class=\"info2\">KITCHEN</p7></div></div>" +
          "</div></div>" + "<div class=\"commentsection\"><p9>" + writtenReview + "</p9></div></div></div>");
        }
      })
    }).then(function(){
      var finalPercentage = Math.round((grandScore/topTotalScorePossible)*100);
      console.log("total party score is " + grandPartyDist);
      var avgPartyDist = Math.round(grandPartyDist/numReviews);
      var avgStudyDist = Math.round(grandStudyDist/numReviews);
      var avgGymDist = Math.round(grandGymDist/numReviews);
      var avgKitchenScore = Math.round(grandKitchenScore/numReviews);
      $(".dormtitle").empty();
      $(".dormtitle").append("<h8>" + currentDormSelected + "</h8>");
      $(".left > h10").empty();
      $(".left > h10").append(finalPercentage + "%");

      var partyDistPerc = Math.round((avgPartyDist/15)*100);
      console.log("party dist % is " + partyDistPerc);
      $("#distToParty").width(partyDistPerc+"%")
      $("#distToParty > p3").text(avgPartyDist + "min");

      var studyDistPerc = Math.round((avgStudyDist/15)*100);
      console.log("study dist % is " + studyDistPerc);
      $("#distToStudy").width(studyDistPerc+"%");
      $("#distToStudy > p3").text(avgStudyDist + "min");

      var gymDistPerc = Math.round((avgGymDist/15)*100);
      console.log("gym dist % is " + gymDistPerc);
      $("#distToGym").width(gymDistPerc+"%");
      $("#distToGym > p3").text(avgGymDist + "min");

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
  });
}

})
