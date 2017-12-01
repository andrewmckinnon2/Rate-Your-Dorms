var currentNumberOfRatings;
var dormNames = ["Alderman", "Alexander", "Avery", "Aycock", "Carmichael",
"Cobb","Connor", "Craige", "Craige North", "Ehringhaus", "Everett", "Graham", "Grimes", "Granville",
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
    $('.loadPlaceHolder').toggle();
    $(this).css("cursor", "wait");
    console.log("checkForInputs returned true");
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

    dormRatingNode.once("value").then(function(snap){
      if(snap.hasChild("culture")){
        var currentCulture = snap.child("culture").child(cultureReview).val();
        currentCulture = currentCulture + 1;

        dormRatingNode.child("culture").child(cultureReview).set(currentCulture);
        var currentHighestVotes = snap.child("avgCulture").val();
        if(currentCulture > currentHighestVotes || currentHighestVotes == undefined || currentHighestVotes == null){
          dormRatingNode.child("avgCulture").set(cultureReview);
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

        currentNumberOfRatings = currentNumberOfRatings+1;
        dormRatingNode.child("numReviews").set(currentNumberOfRatings);
      }).then(function(){ //Update the averages for this dorm.
      var avgGymDist;
      var avgBathroom;
      var avgBuilding; //Changed from avgCleanliness to avgBuilding
      var avgStudyDist;
      var avgPartyDist;
      var avgCulture;
      var avgRoom;
      dormRatingNode.once("value").then(function(snapshot){
          if(snapshot.hasChild("avgGymDist")){
            avgGymDist = snapshot.child("avgGymDist").val();
            avgGymDist = (avgGymDist)*(currentNumberOfRatings-1) + parseInt(gymProximityRating);
            avgGymDist = Math.round(avgGymDist/currentNumberOfRatings);
            dormRatingNode.child("avgGymDist").set(parseInt(avgGymDist));
          }else{
            dormRatingNode.child("avgGymDist").set(parseInt(gymProximityRating));
          }
          if(snapshot.hasChild("avgBathroom")){
            avgBathroom = snapshot.child("avgBathroom").val();
            avgBathroom = (avgBathroom)*(currentNumberOfRatings -1) + parseInt(bathroomRating);
            avgBathroom = Math.round(avgBathroom/currentNumberOfRatings);
            dormRatingNode.child("avgBathroom").set(parseInt(avgBathroom));
          }else{
            dormRatingNode.child("avgBathroom").set(parseInt(bathroomRating));
          }
          //Updated avgCleanliness to be avgBuilding
          if(snapshot.hasChild("avgbuilding")){
            avgBuilding = snapshot.child("avgbuilding").val();
            avgBuilding = (avgBuilding)*(currentNumberOfRatings - 1) + parseInt(buildingRating);
            avgBuilding = Math.round(avgBuilding/currentNumberOfRatings);
            dormRatingNode.child("avgbuilding").set(parseInt(avgBuilding));
          }else{
            dormRatingNode.child("avgbuilding").set(parseInt(buildingRating));
          }
          if(snapshot.hasChild("avgStudyDist")){
            avgStudyDist = snapshot.child("avgStudyDist").val();
            avgStudyDist = (avgStudyDist)*(currentNumberOfRatings - 1) + parseInt(studyProximityRating);
            avgStudyDist = Math.round(avgStudyDist/currentNumberOfRatings);
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
          //dormRatingNode.child("culture").child(cultureReview).set(numOfCulturePoints);
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
          setTimeout(function(){
            window.location = "../html/exitReview.html";
          }, 3000)

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
  }else if($("input:radio[name ='recommend']:checked").val() == undefined){
    return false;
  }else if($("input:radio[name ='bathroomStar']:checked").val() == undefined || $("input:radio[name ='buildingStar']:checked").val() == undefined
      || $("input:radio[name ='roomStar']:checked").val() == undefined){
        return false;
  }else if($("#name").val() == ""){
    return false;
  }else if($("#email").val() == ""){
    return false
  }else if(!($("#agreeToTerms").is(":checked"))){
    return false;
  }else if($("#textReview").val().split(' ').length <15){
    return false;
  }else if($("#dormName").find(":selected").text() == "Select"){
    return false;
  }else{
    return true;
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

$("#findADorm").click(function(){
  window.location="Landingpage.html";
});

$(".mobileReview").click(function(){
  window.location="writeReview.html";
})

$(".searchbar").click(function(){
  $(this).css("border-radius","5px 0px 0px 0px");
  $("#mobileSearch").css("border-radius", "0px 0px 0px 0px");
  $("#searchbutton").css("border-radius","0px 5px 0px 0px");

  $(".dropdown1").show();
  $(".dropdown2").show();
  for(var i=0; i<dormNames.length; i++){
    $(".dropdown1").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i] + " - UNC</p14></div>");
    $(".dropdown2").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i] + " - UNC</p14></div>")
  }
})
