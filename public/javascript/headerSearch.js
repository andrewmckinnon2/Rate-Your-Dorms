/*This js file is for all searchbar functionality accross documents in the index level*/
//Initialize empty array to hold all dorm names and all school names
var dormNames = []
var schoolNames = []
//Add all possible dorm names to dormNames array upon loading of html page
$(document).ready(function(){
  firebase.database().ref("/").on("child_added", function(snap){
    var key = snap.key;
    var ratings = snap.val().ratings;
    if(!(snap.key == "Contact Messages")){
      schoolNames.push(key); //Add all schools to the schoolNames arr
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

//When text is entered by user into search show dropdown and check input for corresponding dorms to display
$(".searchbar").keyup(function(event){
  var searchType = $("#searchtype").find(":selected").text();
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
  if(searchType == "Dorm"){
    for(var i=0; i<dormNames.length; i++){
      if(userInput.length>dormNames[i][0].length){
        continue;
      }

      //If query matches corresponding characters in dorms, add to currentOptions and append to dropdown
      if(dormNames[i][0].slice(0,userInput.length).toLowerCase() == userInput.toLowerCase()){
        currentOptions.push(dormNames[i]);
        //Standard dropdown
        $(".dropdown1").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i][0] + " - " + dormNames[i][1] + "</p14></div>");
      }

      if(dormNames[i][0].slice(0,userInput2.length).toLowerCase() == userInput2.toLowerCase()){
        currentOptions.push(dormNames[i]);
        //mobile dropdown
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

//Listener for click in search bar. On click adjust corners of search bar, make dropdown visible and append all dorms
$(".searchbar").click(function(){
  var searchType = $("#searchtype").find(":selected").text();
  $(this).attr("placeholder", "");
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
  $(".dropdown1").show();
  $(".dropdown2").show();
})

//On click in dropdown redirect to appropriate dorm page
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

//On click out of logo bar, hide dropdown and adjust border radii
$("#logobar").focusout(function(){
  $(".dropdown").hide();
  $(".searchbar").css("border-radius","5px 0px 0px 5px");
  $("#searchbutton").css("border-radius","0px 5px 5px 0px");
  $(".searchbar").attr("placeholder", "Search...");
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
