$("#writerev").click(function(){
  window.location = "../writeReview.html";
})
$(".dropdown").hide();
$(".dropdown").empty();

//Managing search bar navigation
$(".searchbar").keyup(function(event){
  $(".dropdown").show();
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
  console.log("captured dropdowncontent event");
  var dormName = $(this).children("p14").html().replace(" - UNC", "");
  window.location = "dorms/" + dormName + ".html";
})

$("#logobar").focusout(function(){
  $(".dropdown").hide();
  $(".searchbar").css("border-radius","5px 0px 0px 5px");
  $("#searchbutton").css("border-radius","0px 5px 5px 0px");
  $(".searchbar").val("");
  /**if(!($(".dropdowncontent").is(":focus"))){
    $(".dropdown").hide();
    console.log("inside of if statement for focus out");
  }*/
})

$("#closemobile").click(function(){
  $("#mobilepopup").toggle();
  console.log("close popup handler triggered.");
})
