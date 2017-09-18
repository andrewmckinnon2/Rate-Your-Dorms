var dormNames = [];
$(document).ready(function(){
  firebase.database().ref("/UNC-CH/ratings").on("child_added", function(snap){
    dormNames.push(snap.key);
  })
})

$("#writeReview").click(function(){
  window.location="html/writeReview.html"
  console.log('event fired');
})

$("#searchbar > input").click(function(){
  for(var i=0; i<dormNames.length; i++){
    console.log(dormNames[i]);
  }
})

$("#findADorm").click(function(){
  window.location="html/Landingpage.html";
})

$("#contactUs").click(function(){
  window.location = "html/contact.html";
})

var currentOptions = [];
$("#searchbar").keyup(function(event){
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
    currentOptions = [];
  }

  var userInput = $("#searchbar > input").val();
  //Get dorms that match the current query in the search bar entered by user
  for(var i=0; i<dormNames.length; i++){
    if(userInput.length>dormNames[i].length){
      continue;
    }

    if(dormNames[i].slice(0,userInput.length).toLowerCase() == userInput.toLowerCase()){
      console.log(dormNames[i]);
      currentOptions.push(dormNames[i]);
    }
  }
})
