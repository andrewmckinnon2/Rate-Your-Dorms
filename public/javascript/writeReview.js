var dormNames = ["Alderman", "Alexander", "Avery", "Aycock", "Carmichael",
"Cobb","Connor", "Craige", "Craige-North", "Ehringhaus", "Everett", "Graham", "Grimes",
"Hardin", "Hinton-James", "Horton", "Joyner", "Kenan", "Koury", "Lewis", "Mangum", "Manly",
"McIver", "Morrison", "Old-East", "Old-West", "Parker", "Ruffin", "Spencer", "Stacy", "Teague",
"Winston"];

for(var i=0; i<dormNames.length; i++){
  $("#dormName").append("<option id=\"" + dormNames[i].toLowerCase() + "\">" + dormNames[i] + "</option>");
}

var bathroomRadios = $(".bathroomRating");
var cleanlinessRadios = $(".cleanlinessRating");
var kitchenRadios = $(".kitchenRating");

function addListeners(classElements){
  classElements.each(function(){
    var Radio = $(this);
    $(this).on("click", function(){
      removeClicks(classElements);
      var optionNumber = parseInt(Radio.attr("id").slice(-1));
      var idMinusNum = Radio.attr("id").slice(0, Radio.attr("id").length-1);
      console.log("id is " + idMinusNum);
      console.log("option number is " + optionNumber);
      for(var i=0; i<=optionNumber; i++){
        //console.log("#" + idMinusNum + i)
        $("#" + idMinusNum + i).prop("checked", true);
      }
    })
  })
}
function removeClicks(classElements){
  console.log("remove clicks was triggered");
  classElements.each(function(){
    var currentId = $(this).attr("id")
    $(this).prop('checked', false);
  })
}

addListeners(bathroomRadios);
addListeners(cleanlinessRadios);
addListeners(kitchenRadios);

$("#submit").click(function(){
  console.log("submit event click fired");
  //if(checkForInputs() == false){
    //alert("Please make sure all fields are filled in.");
  //}else{
    var reviewerName = $("#name").val();
    var yearInDorm = $("#yearSelector").find(":selected").text();
    var dorm = $("#dormName").find(":selected").text();
    var bathroomRating = getValChecked(bathroomRadios);
    var cleanlinessRating = getValChecked(cleanlinessRadios);
    var kitchenRating = getValChecked(kitchenRadios);
    var studyProximityRating = $("#slider1").val();
    var partyProximityRating = $("#slider2").val();
    var cultureReview = $("#cultureSelector").find(":selected").text();
    var hasLaundry = false;
    var email = $("#email").val();
    var bathStyle = $("#dormStyle").find(":selected").text();
    var writtenReview = $("#textReview").val();
    if($("#hasLaundry").find(":selected").text() == "Yes"){
      hasLaundry = true;
    }
    var wouldLiveAgain;
    if($("#wouldLiveHereAgain").find(":selected").text() == "Yes"){
      wouldLiveAgain = true;
    }else {
      wouldLiveAgain = false;
    }
    alert(reviewerName + yearInDorm + dorm + bathroomRating + cleanlinessRating + kitchenRating +
      studyProximityRating + partyProximityRating + cultureReview + hasLaundry);
    var database = firebase.database();
    var dormRatingNode = database.ref("/ratings/" + dorm + "/");
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
      culture: cultureReview,
      laundry: hasLaundry,
      wouldLiveHereAgain: wouldLiveAgain,
      bathroomStyle: bathStyle,
      review: writtenReview
    });

    //update the number of ratings
    dormRatingNode.once("value", function(snap){
      currentNumberOfRatings = parseInt(snap.val().numReviews);
      currentNumberOfRatings = currentNumberOfRatings+1;
      dormRatingNode.child("numReviews").set(currentNumberOfRatings);
    });
  //}
})

function checkForInputs(){
  //return true or false depending on whether or not values from inputs have been chosen
  if(!($("#name").val())){
    return false;
  }else if(!($("#bathroom1").val() || $("#bathroom2").val() || $("#bathroom3").val() || $("#bathroom4").val() || $("#bathroom5").val())){
    return false;
  }else if(!($("#cleanliness1").val() || $("#cleanliness2").val() || $("#cleanliness3").val() || $("#cleanliness4").val() || $("#cleanliness5").val())){
    return false;
  }else if(!($("#kitchen1").val() || $("#kitchen2").val() || $("#kitchen3").val() || $("#kitchen4").val() || $("#kitchen5").val())){
    return false;
  }else if(!($("#proximityParty1").val() || $("#proximityParty2").val() || $("#proximityParty3").val() || $("#proximityParty4").val() || $("#proximityParty5").val())){
    return false;
  }else if(!($("#proximityStudy1").val() || $("#proximityStudy2").val() || $("#proximityStudy3").val() || $("#proximityStudy4").val() || $("#proximityStudy5").val())){
    return false;
  }else if(!($("#hasLaundry").val() || $("#noLaundry").val())){
    return false;
  }else{
    return true;
  }




}

function getValChecked(classElements){ //Gets the highest checked radio out of those given as argument classElements
  var highestChecked = 0;
  for(var i=0; i<classElements.length; i++){
    var radio = $(classElements[i]);
    var rating = parseInt(radio.attr("id").slice(-1));
    console.log("rating is " + rating)
    if($(classElements[i]).is(":checked") && rating>highestChecked){
      highestChecked = rating;
    }
  }
  return highestChecked;
}

$("#hamburger").click(function(){
    $("#mobilepopup").show();
});

$("#exitMobilePopup").click(function(){
    console.log("button presed");
    $("#mobilepopup").hide();
})
