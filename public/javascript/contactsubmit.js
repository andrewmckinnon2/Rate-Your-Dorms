$("#writeReview").click(function(){
  window.location = "../html/writeReview.html";
})

$("#returnHome").click(function(){
  window.location = "../index.html";
})

$("#findADorm").click(function(){
  window.location = "../html/Landingpage.html";
})

var dormNames = [];
$(document).ready(function(){
  firebase.database().ref("/UNC-CH/ratings").on("child_added", function(snap){
    dormNames.push(snap.key);
  })
})
$("#dropdown").hide();

$("#findADorm").click(function(){
  window.location="html/Landingpage.html";
})

$("#contactUs").click(function(){
  window.location = "html/contact.html";
})

$("#writerev").click(function(){
  window.location = "html/writeReview.html";
})

$("#writeReview").click(function(){
  window.location="html/writeReview.html"
})

var currentOptions = [];
$("#searchbar").keyup(function(event){
  $("#dropdown").show();
  var keyPress;
  if(window.event){//IE
    keyPress = event.which;
  }else{keyPress = event.keyCode;}

  if(keyPress == 13){//If enter button is pressed either redirect to top match, or print error.
    if(currentOptions.length == 0){
      //Need to add redirect
    }else{

    }
  }else{
    $("#dropdown").empty();
    currentOptions = [];
  }

  var userInput = $("#searchbar").val();
  //Get dorms that match the current query in the search bar entered by user
  for(var i=0; i<dormNames.length; i++){
    if(userInput.length>dormNames[i].length){
      continue;
    }


    if(dormNames[i].slice(0,userInput.length).toLowerCase() == userInput.toLowerCase()){
      currentOptions.push(dormNames[i]);
      $("#dropdown").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i] + "- UNC</p14></div>");
    }

  }
})

$("#searchbar").click(function(){
  $(this).attr("placeholder", "");
  $("#dropdown").show();
  for(var i=0; i<dormNames.length; i++){
    $("#dropdown").append("<div class=\'dropdowncontent\'><p14>" + dormNames[i] + "-UNC</p14></div>");
  }
})

$(document).on("mousedown", "div.dropdowncontent", function(){
  $("#logobar").focus();
  var dormName = $(this).children("p14").html().replace("- UNC", "");
  window.location = "../html/dorms/" + dormName + ".html";
})

$("#logobar").focusout(function(){
  $("#dropdown").hide();
  $("#searchbar").attr("placeholder", "Find a dorm...");
})
