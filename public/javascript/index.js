var dormNames = [];
$(document).ready(function(){
  firebase.database().ref("/UNC-CH/ratings").on("child_added", function(snap){
    dormNames.push(snap.key);
  })
})
$(".dropdown").hide();
$(".dropdown").empty();

$("#writeReview").click(function(){
  window.location="html/writeReview.html"
  console.log('event fired');
})

$("#findADorm").click(function(){
  window.location="html/Landingpage.html";
})

$("#contactUs").click(function(){
  window.location = "html/contact.html";
})

$("#writerev").click(function(){
  window.location = "html/writeReview.html";
})

var currentOptions = [];
$(".searchbar").keyup(function(event){
  $(".dropdown").show();
  console.log(".searchbar.keyup event triggered");
  var keyPress;
  if(window.event){//IE
    keyPress = event.which;
  }else{keyPress = event.keyCode;}

  if(keyPress == 13){//.searchbarton is pressed either redirect to top match, or print error.
    if(currentOptions.length == 0){
      console.log("no matches with our dorm");
    }else{
      console.log("redirect to " + currentOptions[0] + " review page");
    }
  }else{
    $(".dropdown").empty();
    currentOptions = [];
  }

  var userInput = $(".searchBar1").val();
  var userInput2 = $(".searchBar2").val();
  console.log("user input is "+ userInput);
  console.log("user input2 is " + userInput2);
  //Get dorms that match the current query in the search bar entered by user
  for(var i=0; i<dormNames.length; i++){
    if(userInput.length>dormNames[i].length){
      continue;
    }


    if(dormNames[i].slice(0,userInput.length).toLowerCase() == userInput.toLowerCase()){
      currentOptions.push(dormNames[i]);
      $(".dropdown1").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i] + " - UNC</p14></div>");
    }

    if(dormNames[i].slice(0,userInput2.length).toLowerCase() == userInput2.toLowerCase()){
      currentOptions.push(dormNames[i]);
      $(".dropdown2").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i] + " - UNC</p14></div>");
    }
  }
})

$(".searchbar").click(function(){
  $(this).attr("placeholder", "");
  $(this).css("border-radius","5px 0px 0px 0px");
  $("#searchbutton").css("border-radius","0px 5px 0px 0px");

  $(".dropdown1").show();
  $(".dropdown2").show();
  for(var i=0; i<dormNames.length; i++){
    $(".dropdown1").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i] + " - UNC</p14></div>");
    $(".dropdown2").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i] + " - UNC</p14></div>")
  }
})

$(document).on("mousedown", "div.dropdowncontent", function(){
  $("#logobar").focus();
  var dormName = $(this).children("p14").html().replace(" - UNC", "");
  window.location = "html/dorms/" + dormName + ".html";
})

$("#logobar").focusout(function(){
  $(".dropdown").hide();
  $(".searchbar").css("border-radius","5px 0px 0px 5px");
  $("#searchbutton").css("border-radius","0px 5px 5px 0px");
  $(".searchbar").attr("placeholder", "Search...");
  /**if(!($(".dropdowncontent").is(":focus"))){
    $(".dropdown").hide();
    console.log("inside of if statement for focus out");
  }*/
})

$("#writeAReviewCenter").click(function(){
  window.location = "html/writeReview.html";
})

$("#ViewSchoolOverviewCenter").click(function(){
  window.location= "html/Landingpage.html";
})

$("#closemobile").click(function(){
  $("#mobilepopup").toggle();
  console.log("close popup handler triggered.");
})

$("#contactUs").click(function(){
  window.location = "html/contact.html";
})

console.log("footer.js loaded");

$("#contactLink").click(function(){
  window.location = "html/contact.html";
})

$("#legalLink").click(function(){
  window.location = "html/Legal.html";
})

$("#aboutLink").click(function(){
  window.location = "index.html#infographic";
})

$(".mobileReview").click(function(){
  console.log('mobileReview action listener was entered');
  window.location = "html/writeReview.html";
})
