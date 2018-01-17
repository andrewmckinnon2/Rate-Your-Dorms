var dormNames = [];
var schoolNames = []; //List of schools
//When html has loaded, create list of dormNames and set stars to 5
$(document).ready(function(){
  $("#starFive").click();
  firebase.database().ref("/").on("child_added", function(snap){
    var key = snap.key;
    var ratings = snap.val().ratings;
    if(!(snap.key == "Contact Messages")){
      schoolNames.push(key);
      for(dorm in ratings){
        //Create a 2d array, where first element is name of dorm, second is name of school and push to dormNames
        newDorm = [];
        newDorm.push(dorm);
        newDorm.push(key);
        dormNames.push(newDorm);
      }
    }
  })
})
$(".dropdown").hide();
$(".dropdown").empty();

var currentOptions = []; //global var for holding the currently searchable dorms based on user input.
//Listen for typing into the search bar and add dorms matching the query to our dropdown
$(".searchbar").keyup(function(event){
  var searchType = $("#searchtype").find(":selected").text();
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
  if(searchType == "Dorm"){
    for(var i=0; i<dormNames.length; i++){
      if(userInput.length>dormNames[i][0].length){
        continue;
      }

      //If the letters currently in the search are equal to those letter in a dorm, append them to the courrentOptions
      if(dormNames[i][0].slice(0,userInput.length).toLowerCase() == userInput.toLowerCase()){
        currentOptions.push(dormNames[i]);
        $(".dropdown1").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i][0] + " - " + dormNames[i][1] + "</p14></div>");
      }
      //Same operation for the mobile search bar
      if(dormNames[i][0].slice(0,userInput2.length).toLowerCase() == userInput2.toLowerCase()){
        currentOptions.push(dormNames[i][0]);
        $(".dropdown2").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i][0] + " - " + dormNames[i][1] + "</p14></div>");
      }
    }
  }else{
    for(var i=0; i<schoolNames.length; i++){
      if(userInput.length>schoolNames[i].length){
        continue;
      }

      //If query matches corresponding characters in schools, add to current options and append to dropdown
      if(schoolNames[i].slice(0,userInput.length).toLowerCase() == userInput.toLowerCase()){
        currentOptions.push(schoolNames[i]);
        //Standard dropdown
        $(".dropdown1").append("<div class=\'dropdowncontent\'><p14>" + schoolNames[i] + "</p14></div>");
      }

      if(schoolNames[i].slice(0,userInput2.length).toLowerCase() == userInput2.toLowerCase()){
        currentOptions.push(schoolNames[i]);
        //mobile dropdown
        $(".dropdown2").append("<div class=\'dropdowncontent\'><p14>" + schoolNames[i] + "</p14></div>");
      }
    }
  }
})
//Listen for the user to click on the search bar and append all dorms to the dropdown when they do.
$(".searchbar").click(function(){
  var searchType = $("#searchtype").find(":selected").text();
  $(this).attr("placeholder", "");//Clear text in search bar
  //Fix corners of search button
  $(this).css("border-radius","5px 0px 0px 0px");
  $("#mobileSearch").css("border-radius", "0px 0px 0px 0px");
  $("#searchbutton").css("border-radius","0px 5px 0px 0px");

  $(".dropdown1").empty();
  $(".dropdown2").empty();

  if(searchType == "Dorm"){
    for(var i=0; i<dormNames.length; i++){
      $(".dropdown1").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i][0] + " - " + dormNames[i][1] + "</p14></div>");
      $(".dropdown2").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i][0] + " - " + dormNames[i][1] + "</p14></div>");
    }
  }else{
    for(var i=0; i<schoolNames.length; i++){
      $(".dropdown1").append("<div class=\'dropdowncontent\'><p14>" + schoolNames[i] + "</p14></div>");
      $(".dropdown2").append("<div class=\'dropdowncontent\'><p14>" + schoolNames[i] + "</p14></div>");
    }
  }
  $(".dropdown1").show();//Show normal drop down
  $(".dropdown2").show();//Show mobile drop down
})

//Listen for click on dropdown to redirect to clicked on dorm
$(document).on("mousedown", "div.dropdowncontent", function(){
  $("#logobar").focus();
  var searchType = $("#searchtype").find(":selected").text();
  if(searchType == "Dorm"){
    var dormName = $(this).children("p14").html().split(" - ")[0];
    var schoolName = $(this).children("p14").html().split(" - ")[1];
    window.location = "dorms/" + schoolName + "/" + dormName + ".html";
  }else{
    var schoolName = $(this).children("p14").html();
    window.location = "dorms/" + schoolName + "/Landingpage.html";
  }
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
  window.location= "writeReview.html";
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
  window.location = "writeReview.html";
})

$("#writeareview").click(function(){
  window.location = "writeReview.html";
})

$("#unc").click(function(){
  window.location = "dorms/UNC-CH/Landingpage.html";
})

$("#ncstate").click(function(){
  window.location = "dorms/NC-STATE/Landingpage.html";
})

$("#duke").click(function(){
  window.location = "dorms/DUKE/Landingpage.html";
})
