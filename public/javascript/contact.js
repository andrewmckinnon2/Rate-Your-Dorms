$("#submit").click(function(){
  if($("#name").val()!="" && $("#emailAddress").val()!="" && ($("#messageField").val()!="" && !($("#messageField").text().includes("Message...")))){
      //window.location="../html/contactsubmit.html"
      var newNode = firebase.database().ref("/Contact Messages/").push();
      var emailVal = $("#emailAddress").val();
      var nameVal = $("#name").val();
      var messageVal = $("#messageField").val();
      console.log("emailval is " + emailVal + " nameVal is " + nameVal + " messageVal is " + messageVal);
      newNode.set({
        Email: emailVal,
        Message: messageVal,
        Name: nameVal
      });
      window.location = "../html/contactsubmit.html";
  }else{
    alert("Please be sure that all fields are filled in");
  }

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
  console.log('event fired');
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
      console.log("no matches with our dorm");
    }else{
      console.log("redirect to " + currentOptions[0] + " review page");
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

      //console.log(dormNames[i]);
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
  console.log("captured dropdowncontent event");
  var dormName = $(this).children("p14").html().replace("- UNC", "");
  window.location = "../html/dorms/" + dormName + ".html";
})

$("#logobar").focusout(function(){
  $("#dropdown").hide();
  $("#searchbar").attr("placeholder", "Find a dorm...");
  /**if(!($(".dropdowncontent").is(":focus"))){
    $("#dropdown").hide();
    console.log("inside of if statement for focus out");
  }*/
})

$("#messageField").click(function(){
  $(this).text("");
  console.log("message Field event triggered");
})
