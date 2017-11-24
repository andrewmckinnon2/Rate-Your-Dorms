var dormNames = ["Alderman", "Alexander", "Avery", "Aycock", "Carmichael",
"Cobb","Connor", "Craige", "Craige-North", "Ehringhaus", "Everett", "Graham", "Grimes",
"Hardin", "Hinton-James", "Horton", "Joyner", "Kenan", "Koury", "Lewis", "Mangum", "Manly",
"McIver", "Morrison", "Old-East", "Old-West", "Parker", "Ruffin", "Spencer", "Stacy", "Teague",
"Winston"];

for (var i=0; i<dormNames.length; i++){
  $("#allDormsHolder").append("<div class=\"dormPicHolder\" id=\"" + dormNames[i].toLowerCase()
   + "\"><h3>" + dormNames[i] + "</h3></div>")
}

$(".dormPicHolder").each(function(){
    this.addEventListener("mouseover", function(){
    $(this).children("h3").css("font-weight", "bold");
    $(this).css("box-shadow", "inset 0 0 0 1000px rgba(0,0,0,.2)");
  });

  this.addEventListener("mouseout", function(){
    $(this).children("h3").css("font-weight", "normal");
    $(this).css("box-shadow", "none");
  })

  this.addEventListener("click", function(){
    $("#infoDisplay > img").fadeOut(function(){$(this).remove();});


    var image = $(this).css("background-image");
    image = image.replace("url(\"", "");
    image = image.replace("\")", "");
    $("<img src=\"" + image + "\"" + ">").hide().delay(1000).appendTo("#infoDisplay").fadeIn();
  })
});
