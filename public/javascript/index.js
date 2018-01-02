var dormNames = [];
//When html has loaded, create list of dormNames and set stars to 5
$(document).ready(function(){
  $("#starFive").click();
  firebase.database().ref("/UNC-CH/ratings").on("child_added", function(snap){
    //TODO: add the dorms from other schools (will need double for loop to go through all schools and gather dorms)
    dormNames.push(snap.key);
  })
})
$(".dropdown").hide();
$(".dropdown").empty();

var currentOptions = []; //global var for holding the currently searchable dorms based on user input.
//Listen for typing into the search bar and add dorms matching the query to our dropdown
$(".searchbar").keyup(function(event){
  $(".dropdown").show();
  var keyPress;
  if(window.event){//IE
    keyPress = event.which;
  }else{keyPress = event.keyCode;}

  if(keyPress == 13){//.searchbar is pressed either redirect to top match, or print error.
    if(currentOptions.length == 0){
      //Need to add redirect
    }else{
      //Need to add redirect
    }
  }else{
    $(".dropdown").empty();
    currentOptions = [];
  }

  var userInput = $(".searchBar1").val(); //Normal search bar val.
  var userInput2 = $(".searchBar2").val(); //Mobile search bar val.
  //Get dorms that match the current query in the search bar entered by user
  for(var i=0; i<dormNames.length; i++){
    if(userInput.length>dormNames[i].length){
      continue;
    }

    //If the letters currently in the search are equal to those letter in a dorm, append them to the courrentOptions
    if(dormNames[i].slice(0,userInput.length).toLowerCase() == userInput.toLowerCase()){
      currentOptions.push(dormNames[i]);
      $(".dropdown1").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i] + " - UNC</p14></div>");
    }
    //Same operation for the mobile search bar
    if(dormNames[i].slice(0,userInput2.length).toLowerCase() == userInput2.toLowerCase()){
      currentOptions.push(dormNames[i]);
      $(".dropdown2").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i] + " - UNC</p14></div>");
    }
  }
})
//Listen for the user to click on the search bar and append all dorms to the dropdown when they do.
$(".searchbar").click(function(){
  $(this).attr("placeholder", "");//Clear text in search bar
  //Fix corners of search button
  $(this).css("border-radius","5px 0px 0px 0px");
  $("#mobileSearch").css("border-radius", "0px 0px 0px 0px");
  $("#searchbutton").css("border-radius","0px 5px 0px 0px");

  $(".dropdown1").show();//Show normal dropdown
  $(".dropdown2").show();//Show mobile dropdown
  for(var i=0; i<dormNames.length; i++){
    $(".dropdown1").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i] + " - UNC</p14></div>");
    $(".dropdown2").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i] + " - UNC</p14></div>")
  }
})

//Listen for click on dropdown to redirect to clicked on dorm
$(document).on("mousedown", "div.dropdowncontent", function(){
  $("#logobar").focus();
  var dormName = $(this).children("p14").html().replace(" - UNC", "");
  window.location = "UNC-CH/" + dormName + ".html";
})

//When user clicks outside of logobar hide dropdown, fix corners, and replace the searchbar text
$("#logobar").focusout(function(){
  $(".dropdown").hide();
  $(".searchbar").css("border-radius","5px 0px 0px 5px");
  $("#searchbutton").css("border-radius","0px 5px 5px 0px");
  $(".searchbar").attr("placeholder", "Search...");
})

//Remaining code is listeners for redirects

$("#writeAReviewCenter").click(function(){
  window.location = "writeReview.html";
})

$("#ViewSchoolOverviewCenter").click(function(){
  window.location= "Landingpage.html";
})

$("#closemobile").click(function(){
  $("#mobilepopup").toggle();
})

$("#contactUs").click(function(){
  window.location = "contact.html";
})

$("#contactLink").click(function(){
  window.location = "contact.html";
})

$("#legalLink").click(function(){
  window.location = "Legal.html";
})

$("#aboutLink").click(function(){
  window.location = "index.html#theteam";
})

$(".mobileReview").click(function(){
  window.location = "html/writeReview.html";
})

$("#writeareview").click(function(){
  window.location = "html/writeReview.html";
})
