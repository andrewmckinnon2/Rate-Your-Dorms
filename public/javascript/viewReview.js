$(document).ready(function(){
const topPossibleScore = 45;
$("#writeReview").click(function(){
  window.location="../html/writeReview.html";
})

var dormNames = ["Alderman", "Alexander", "Avery", "Aycock", "Carmichael",
"Cobb","Connor", "Craige", "Craige-North", "Ehringhaus", "Everett", "Graham", "Grimes",
"Hardin", "Hinton-James", "Horton", "Joyner", "Kenan", "Koury", "Lewis", "Mangum", "Manly",
"McIver", "Morrison", "Old-East", "Old-West", "Parker", "Ruffin", "Spencer", "Stacy", "Teague",
"Winston"];

for(var i=0; i<dormNames.length; i++){
  $("#dormName").append("<option id=\"" + dormNames[i].toLowerCase() + "\">" + dormNames[i] + "</option>");
}

var currentDormSelected = "Alderman"
$("#reviewHolder").empty();
getCurrentInfo();

$("#dormName").change(function(){
  currentDormSelected = $("#dormName").find(":selected").text()
  $("#reviewHolder").empty();
  console.log(currentDormSelected);
  getCurrentInfo();
})

function getCurrentInfo(){
  var numReviews;
  var topTotalScorePossible;
  var grandScore = 0;
  var grandStudyDist = 0;
  var grandPartyDist = 0;
  var grandGymDist = 0;

  firebase.database().ref("/ratings/" + currentDormSelected + "/").once("value").then(function(snap){
    numReviews = snap.val().numReviews;
    topTotalScorePossible = topPossibleScore * numReviews;
    console.log(numReviews);
  }).then(function(){
    firebase.database().ref("/ratings/" + currentDormSelected + "/").once("value").then(function(snap){
      snap.forEach(function(childSnap){
        if(childSnap.key != "numReviews"){
          var ratingInfo = childSnap.val();
          console.log(ratingInfo);
          var bathroom = parseInt(ratingInfo.bathroom);
          var cleanliness = parseInt(ratingInfo.cleanliness);
          var kitchen = parseInt(ratingInfo.kitchen);
          var writtenReview = ratingInfo.review;
          var name = ratingInfo.name;
          var culture = ratingInfo.culture;
          var partyDist = ratingInfo.partyProximity;
          var studyDist = ratingInfo.studyProximity;
          var gymDist = ratingInfo.gymProximity;

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


          $("#reviewHolder").append("<div class=\"comment\"> <div class=\"tagscontainer\">" + "<div class=\"tagstitle\"><p5>" +
            name + "</p5></div> <div class=\"tag\"><p5>" + culture + "</p5></div> <div class=\"tag\"><p5>" + clean +
            "</p5></div> </div>" + "<div class=\"commentcontainer\"> <div class=\"dormRating\"> <div class=\"overall1\"><p3>" +
            "Overall Score:" + "</p3></div> <div class=\"indiv1\"><p4>" + weightedScorePercent + "%</p4></div> </div>" +
            "<div class=\"commentsection\">" + writtenReview + "</div></div></div>");
        }
      })
    }).then(function(){
      var finalPercentage = Math.round((grandScore/topTotalScorePossible)*100);
      var avgPartyDist = Math.round(grandPartyDist/numReviews);
      var avgStudyDist = Math.round(grandStudyDist/numReviews);
      var avgGymDist = Math.round(grandGymDist/numReviews);
      $(".dormtitle").empty();
      $(".dormtitle").append("<h8>" + currentDormSelected + "</h8>");
      $(".left > h10").empty();
      $(".left > h10").append(finalPercentage + "%");
      $("#distToParty").empty();
      $("#distToParty").append(avgPartyDist + " min");
      $("#distToStudy").empty();
      $("#distToStudy").append(avgStudyDist + " min");
      $("#distToGym").empty();
      $("#distToGym").append(avgGymDist + " min");
    })
  });
}

})
