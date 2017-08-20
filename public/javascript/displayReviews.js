var dormNames = ["Alderman", "Alexander", "Avery", "Aycock", "Carmichael",
"Cobb","Connor", "Craige", "Craige-North", "Ehringhaus", "Everett", "Graham", "Grimes",
"Hardin", "Hinton-James", "Horton", "Joyner", "Kenan", "Koury", "Lewis", "Mangum", "Manly",
"McIver", "Morrison", "Old-East", "Old-West", "Parker", "Ruffin", "Spencer", "Stacy", "Teague",
"Winston"];

for(var i=0; i<dormNames.length; i++){
  $("#dormName").append("<option id=\"" + dormNames[i].toLowerCase() + "\">" + dormNames[i] + "</option>");
}
$("#dormName").change();

$("#dormName").change(function(){
  var dorm = $(this).val();
  firebase.database().ref("ratings/" + dorm + "/").on("child_added", function(snap){
    if(snap.key!="numReviews"){
      var rating = snap.val();
      var bathroomScore = rating.bathroom;
      var cleanlinessScore = rating.cleanliness;
      var culture = rating.culture;
      var kitchen = rating.kitchen;
      var laundry = rating.laundry;
      var name = rating.name;
      var partyProximity = rating.partyProximity;
      var studyProximity = rating.studyProximity;
      var year = rating.year;
      console.log("rating is " + rating + " bathroom score is " + bathroomScore);

      $("#writtenReviewsdisplay").append("<div class=\"writenReview\">" + "<div class=\"headOfReview\">" + "<p>" + name + "</p>");
      $("#writtenReviewsdisplay").append("<p>" + year + "</p>");
      $("#writtenReviewsdisplay").append("</div>" + "div class=\"scoresOfReview\">");
      $("#writtenReviewsdisplay").append("<p>" + bathroomScore + "</p>" + "<p>" + cleanlinessScore + "</p>");
      $("#writtenReviewsdisplay").append("<p>" + kitchen + "</p>" + "<p>" + partyProximity + "</p>" + "<p>" + studyProximity + "</p>");
      $("#writtenReviewsdisplay").append("<p>" + culture  + "</p>");
      if(laundry == true){
        $("#writtenReviewsdisplay").append("<p>Laundry: Has facilities</p>");
      }else{
        $("#writtenReviewsdisplay").append("<p>Laundry: Does not have facilities</p>");
      }

      //need to write review to the actual page.
    }

  })
})
