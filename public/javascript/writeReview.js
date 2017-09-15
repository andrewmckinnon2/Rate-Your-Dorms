var currentNumberOfRatings;
var dormNames = ["Alderman", "Alexander", "Avery", "Aycock", "Carmichael",
"Cobb","Connor", "Craige", "Craige North", "Ehringhaus", "Everett", "Graham", "Grimes",
"Hardin", "Hinton James", "Horton", "Joyner", "Kenan", "Koury", "Lewis", "Mangum", "Manly",
"McIver", "Morrison", "Old East", "Old West", "Parker", "Ruffin", "Spencer", "Stacy", "Teague",
"Winston", ];

var cultureArr = ["Rowdy", "Work-hard", "Play-hard", "Greek", "Chill"];

for(var i=0; i<dormNames.length; i++){
  $("#dormName").append("<option id=\"" + dormNames[i].toLowerCase() + "\">" + dormNames[i] + "</option>");
}

var bathroomRadios = $(".bathroomRating");
var cleanlinessRadios = $(".cleanlinessRating");
var kitchenRadios = $(".kitchenRating");

$("#submit").click(function(){
  console.log("submit event click fired");
  if(checkForInputs() == false){
    alert("Please make sure all fields are filled in.");
  }else{
    var reviewerName = $("#name").val();
    var yearInDorm = $("#yearSelector").find(":selected").text();
    var dorm = $("#dormName").find(":selected").text();
    var bathroomRating = $("#slider3").val();
    var cleanlinessRating = $("#slider6").val();
    var kitchenRating = $("#slider4").val();
    var studyProximityRating = $("#slider1").val();
    var partyProximityRating = $("#slider2").val();
    var gymProximityRating = $("#slider5").val();
    var cultureReview = $("#cultureSelector").find(":selected").text();
    var email = $("#email").val();
    var writtenReview = $("#textReview").val();
    var roomRating = $("#slider7").val();

    if($("#hasLaundry").find(":selected").text() == "Yes"){
      hasLaundry = true;
    }

    if(writtenReview.includes("Additional Comments")){
      writtenReview = "";
    }

    var database = firebase.database();
    var dormRatingNode = database.ref("UNC-CH/ratings/" + dorm + "/");
    var d = new Date();
    var dateWritten = (d.getMonth()+1).toString() + "/" + d.getDate().toString() + "/" + d.getFullYear().toString();

    var thisPush = dormRatingNode.push();
    //set new data fields for this review
    thisPush.set({
      name: reviewerName,
      email: email,
      year: yearInDorm,
      bathroom: bathroomRating,
      cleanliness: cleanlinessRating,
      kitchen: kitchenRating,
      studyProximity: studyProximityRating,
      partyProximity: partyProximityRating,
      gymProximity: gymProximityRating,
      culture: cultureReview,
      review: writtenReview,
      room: roomRating,
      date: dateWritten
    });

    dormRatingNode.once("value").then(function(snap){
      if(snap.hasChild("culture")){
        var currentCulture = snap.child("culture").child(cultureReview).val();
        currentCulture = currentCulture + 1;
        dormRatingNode.child("culture").child(cultureReview).set(currentCulture);
        var currentHighestVotes = snap.child("avgCulture").val();
        if(currentCulture > snap.child("culture").child(currentHighestVotes)){
          snap.child("avgCulture").set(cultureReview);
        }
      }else{
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
        dormRatingNode.once("value").then(function(snap){//update the number of ratings
        currentNumberOfRatings = parseInt(snap.val().numReviews);
        alert("current number of ratings is " + currentNumberOfRatings);
        currentNumberOfRatings = currentNumberOfRatings+1;
        dormRatingNode.child("numReviews").set(currentNumberOfRatings);
        alert("current number of updated ratings is " + currentNumberOfRatings);
      }).then(function(){ //Update the averages for this dorm.
      var avgGymDist;
      var avgKitchen;
      var avgBathroom;
      var avgCleanliness;
      var avgStudyDist;
      var avgPartyDist;
      var avgCulture;
      var avgRoom;
      dormRatingNode.once("value").then(function(snapshot){
          if(snapshot.hasChild("avgGymDist")){
            avgGymDist = snapshot.child("avgGymDist").val();
            avgGymDist = (avgGymDist)*(currentNumberOfRatings-1) + parseInt(gymProximityRating);
            avgGymDist = Math.round(avgGymDist/currentNumberOfRatings);
            alert("average gym distance is " + avgGymDist + "; current number of ratings is " + currentNumberOfRatings);
            dormRatingNode.child("avgGymDist").set(parseInt(avgGymDist));
          }else{
            dormRatingNode.child("avgGymDist").set(parseInt(gymProximityRating));
          }
          if(snapshot.hasChild("avgKitchen")){
            avgKitchen = snapshot.child("avgKitchen").val();
            avgKitchen = (avgKitchen)*(currentNumberOfRatings-1) + parseInt(kitchenRating);
            avgKitchen = Math.round(avgKitchen/currentNumberOfRatings);
            dormRatingNode.child("avgKitchen").set(parseInt(avgKitchen));
          }else{
            dormRatingNode.child("avgKitchen").set(parseInt(kitchenRating));
          }
          if(snapshot.hasChild("avgBathroom")){
            avgBathroom = snapshot.child("avgBathroom").val();
            avgBathroom = (avgBathroom)*(currentNumberOfRatings -1) + parseInt(bathroomRating);
            avgBathroom = Math.round(avgBathroom/currentNumberOfRatings);
            dormRatingNode.child("avgBathroom").set(parseInt(avgBathroom));
          }else{
            dormRatingNode.child("avgBathroom").set(parseInt(bathroomRating));
          }
          if(snapshot.hasChild("avgCleanliness")){
            avgCleanliness = snapshot.child("avgCleanliness").val();
            avgCleanliness = (avgCleanliness)*(currentNumberOfRatings - 1) + parseInt(cleanlinessRating);
            avgCleanliness = Math.round(avgCleanliness/currentNumberOfRatings);
            dormRatingNode.child("avgCleanliness").set(parseInt(avgCleanliness));
          }else{
            dormRatingNode.child("avgCleanliness").set(parseInt(cleanlinessRating));
          }
          if(snapshot.hasChild("avgStudyDist")){
            avgStudyDist = snapshot.child("avgStudyDist").val();
            alert("average study dist before any computation is " + avgStudyDist);
            avgStudyDist = (avgStudyDist)*(currentNumberOfRatings - 1) + parseInt(studyProximityRating);
            alert("average study dist after multiplication and addition of new study score is " + avgStudyDist);
            avgStudyDist = Math.round(avgStudyDist/currentNumberOfRatings);
            alert("average Study distance after full computation is " + avgStudyDist);
            dormRatingNode.child("avgStudyDist").set(parseInt(avgStudyDist));
          }else{
            dormRatingNode.child("avgStudyDist").set(parseInt(studyProximityRating));
          }

          if(snapshot.hasChild("avgPartyDist")){
            avgPartyDist = snapshot.child("avgPartyDist").val();
            avgPartyDist = (avgPartyDist)*(currentNumberOfRatings - 1) + parseInt(partyProximityRating);
            avgPartyDist = Math.round(avgPartyDist/currentNumberOfRatings);
            dormRatingNode.child("avgPartyDist").set(parseInt(avgPartyDist));
          }else{
            dormRatingNode.child("avgPartyDist").set(parseInt(partyProximityRating));
          }

          var numOfCulturePoints = snapshot.child("culture").child(cultureReview).val();
          numOfCulturePoints = numOfCulturePoints + 1;
          dormRatingNode.child("culture").child(cultureReview).set(numOfCulturePoints);
          var currentPopularCulture = snapshot.child("avgCulture").val();
          var currentVotesMostPopular = snapshot.child("culture").child(currentPopularCulture).val();
          if(numOfCulturePoints > currentVotesMostPopular){
            dormRatingNode.child("avgCulture").set(cultureReview);
          }

          if(snapshot.hasChild("avgRoom")){
            avgRoom = snapshot.child("avgRoom").val();
            avgRoom = (avgRoom)*(currentNumberOfRatings - 1) + parseInt(roomRating);
            avgRoom = Math.round(avgRoom/currentNumberOfRatings);
            dormRatingNode.child("avgRoom").set(parseInt(avgRoom));
          }else{
            dormRatingNode.child("avgRoom").set(parseInt(roomRating));
          }
        }).then(function(){
          window.location = "../html/exitReview.html";
        });
      })
    })
  }
  });

function checkForInputs(){
  //return true or false depending on whether or not values from inputs have been chosen
  if($("#yearSelector").find(":selected").text() == "Select"){
    return false;
  }else if($("#cultureSelector").find(":selected").text() == "Selected"){
    return false;
  }
}

$("#hamburger").click(function(){
    $("#mobilepopup").show();
});

$("#exitMobilePopup").click(function(){
    console.log("button presed");
    $("#mobilepopup").hide();
})

$("#writeReview").click(function(){
  window.location = "writeReview.html";
})

var clicked = false;
$("#textReview").click(function(){

  if(clicked == false){
    $(this).val("");
    clicked = true;
  }
  console.log("text box was clicked");
});

$("#findADorm").click(function(){
  window.location="Landingpage.html";
});
