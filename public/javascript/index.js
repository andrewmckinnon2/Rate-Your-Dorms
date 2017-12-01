var dormNames = [];
$(document).ready(function(){
  $("#starFive").click();
  firebase.database().ref("/UNC-CH/ratings").on("child_added", function(snap){
    dormNames.push(snap.key);
  })
})
$(".dropdown").hide();
$(".dropdown").empty();

$("#writeReview").click(function(){
  window.location="html/writeReview.html"
})

$("#findADorm").click(function(){
  window.location="html/Landingpage.html";
})

$("#contactUs").click(function(){
  window.location = "html/contact.html";
})

$("#writeareview").click(function(){
  window.location = "html/writeReview.html";
})

var currentOptions = [];
$(".searchbar").keyup(function(event){
  $(".dropdown").show();
  var keyPress;
  if(window.event){//IE
    keyPress = event.which;
  }else{keyPress = event.keyCode;}

  if(keyPress == 13){//.searchbarton is pressed either redirect to top match, or print error.
    if(currentOptions.length == 0){
      //Need to add redirect
    }else{
      //Need to add redirect
    }
  }else{
    $(".dropdown").empty();
    currentOptions = [];
  }

  var userInput = $(".searchBar1").val();
  var userInput2 = $(".searchBar2").val();
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
  $("#mobileSearch").css("border-radius", "0px 0px 0px 0px");
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
})

$("#writeAReviewCenter").click(function(){
  window.location = "html/writeReview.html";
})

$("#ViewSchoolOverviewCenter").click(function(){
  window.location= "html/Landingpage.html";
})

$("#closemobile").click(function(){
  $("#mobilepopup").toggle();
})

$("#contactUs").click(function(){
  window.location = "html/contact.html";
})


$("#contactLink").click(function(){
  window.location = "html/contact.html";
})

$("#legalLink").click(function(){
  window.location = "html/Legal.html";
})

$("#aboutLink").click(function(){
  window.location = "index.html#theteam";
})

$(".mobileReview").click(function(){
  window.location = "html/writeReview.html";
})
