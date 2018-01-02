/*This js file is for all searchbar functionality accross documents in the index level*/
//Initialize empty array to hold all dorm names
var dormNames = []
//Add all possible dorm names to dormNames array upon loading of html page
$(document).ready(function(){
  firebase.database().ref("/UNC-CH/ratings").on("child_added", function(snap){
    dormNames.push(snap.key);
  })
})

$(".dropdown").hide();
$(".dropdown").empty();

//When text is entered by user into search show dropdown and check input for corresponding dorms to display
$(".searchbar").keyup(function(event){
  $(".dropdown").show();
  var keyPress;
  if(window.event){//IE
    keyPress = event.which;
  }else{keyPress = event.keyCode;}

  if(keyPress == 13){//If enter button is pressed either redirect to top match, or print error.
    if(currentOptions.length == 0){
      //Need to add redirect code
    }else{

    }
  }else{
    $(".dropdown").empty();
    currentOptions = [];
  }

  var userInput = $(".searchBar1").val();//Normal search bar input
  var userInput2 = $(".searchBar2").val();//Mobile search bar input
  //Get dorms that match the current query in the search bar entered by user
  for(var i=0; i<dormNames.length; i++){
    if(userInput.length>dormNames[i].length){
      continue;
    }

    //If query matches corresponding characters in dorms, add to currentOptions and append to dropdown
    if(dormNames[i].slice(0,userInput.length).toLowerCase() == userInput.toLowerCase()){
      currentOptions.push(dormNames[i]);
      //Standard dropdown
      $(".dropdown1").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i] + " - UNC</p14></div>");
    }

    if(dormNames[i].slice(0,userInput2.length).toLowerCase() == userInput2.toLowerCase()){
      currentOptions.push(dormNames[i]);
      //mobile dropdown
      $(".dropdown2").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i] + " - UNC</p14></div>");
    }

  }
})

//Listener for click in search bar. On click adjust corners of search bar, make dropdown visible and append all dorms
$(".searchbar").click(function(){
  $(this).attr("placeholder", "");
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

//On click in dropdown redirect to appropriate dorm page
$(document).on("mousedown", "div.dropdowncontent", function(){
  $("#logobar").focus();
  var dormName = $(this).children("p14").html().replace(" - UNC", "");
  window.location = "UNC-CH/" + dormName + ".html";
})

//On click out of logo bar, hide dropdown and adjust border radii
$("#logobar").focusout(function(){
  $(".dropdown").hide();
  $(".searchbar").css("border-radius","5px 0px 0px 5px");
  $("#searchbutton").css("border-radius","0px 5px 5px 0px");
  $(".searchbar").val("");
})

//Toggle modile view with regular view when mobile exit is clicked
$("#closemobile").click(function(){
  $("#mobilepopup").toggle();
})

$(".mobileReview").click(function(){
  window.location = "writeReview.html";
})

//writeReview.html redirect
$("#writeareview").click(function(){
  window.location = "writeReview.html";
})
