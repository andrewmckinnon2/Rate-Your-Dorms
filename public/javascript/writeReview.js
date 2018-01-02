var currentNumberOfRatings;//Global var to be updated with the current number of ratings
//dormNamesWritRev holds names of all dorms we will display as review options
var dormNamesWriteRev = []
//Add all possible dorm names to dormNamesWriteRev array upon loading of html page
//Also, the dormNamesWriteRev variable mimics what dormNames accomplishes in headerSearch.js but needs different name to allow for seperate array
$(document).ready(function(){
    //Add every dorm name in dormNamesWriteRev to the dropdown for selecting what dorm to review
    firebase.database().ref("/UNC-CH/ratings").once('value').then(function(snap){
      snap.forEach(function(childSnap){
        dormNamesWriteRev.push(childSnap.key);
      })
    }).then(function(){
      for(var i=0; i<dormNamesWriteRev.length; i++){
        $("#dormName").append("<option id=\"" + dormNamesWriteRev[i].toLowerCase() + "\">" + dormNamesWriteRev[i] + "</option>")
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

    //Initialize firebase database var, dormRatingNode var, get date, and generate new node
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
