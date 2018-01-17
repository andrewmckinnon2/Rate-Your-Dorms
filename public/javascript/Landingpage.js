var roomObjects = []; //This is where objects representing all the dorms will be placed
var currentRooms = []; //This is where objects representing the currently displayed dorms will be placed.

var schoolName = $("#schoolName").html();

$("#findADorm").click(function(){
  window.location = "Landingpage.html";
})

$("#writeAReview").click(function(){
  window.location = "writeReview.html";
})

generateDormObjects()
getSchoolOverall();



$("#sortButton").click(function(){
  var sortParam = $("#sortOption").find(":selected").text();
  var filterParam = $("#filterOption").find(":selected").text();
  var noSortParam = false; //should be true if no sort parameter is selected
  var noFilterParam = false; // should be true if no filter parameter is selected
  if(sortParam == "Sort by"){
    noSortParam = true;
    sortParam = "Overall Rating";
  }

  if(filterParam == "Filter by"){
    noFilterParam = true;
  }

  var newDorms = [];
  for(var i = 0; i<roomObjects.length; i++){ //Filter out the dorms with mismatching culture from the one requested
    if(filterParam == roomObjects[i].getCulture()){
      newDorms.push(roomObjects[i]);
    }else if(noFilterParam){ //if no filter parameter is selected, display results for all dorms
      newDorms.push(roomObjects[i]);
    }
  }

  if(sortParam == "Proximity to Class" || sortParam == "Proximity to Party" || sortParam == "Proximity to Workout"){
    for(var n=0; n<newDorms.length; n++){
      for(var i=newDorms.length-1; i>0; i--){
        if(newDorms[i].get(sortParam) < newDorms[i-1].get(sortParam) || newDorms[i-1].get(sortParam) == undefined){
          var temp = newDorms[i];
          newDorms[i] = newDorms[i-1];
          newDorms[i-1] = temp;
        }
      }
    }
  }else{//Sort the list of dorms after filtering
    for(var n=0;n<newDorms.length; n++){
      for(var i=0;i<newDorms.length-1; i++){
        if(newDorms[i].get(sortParam) < newDorms[i+1].get(sortParam) || newDorms[i].get(sortParam) == undefined){
          var temp = newDorms[i];
          newDorms[i] = newDorms[i+1];
          newDorms[i+1] = temp;
        }
      }
    }
  }

  //Now that dorms are sorted, we write them to page
  //Remove all children of rankings to make space for new filter
  $("#rankings").empty();
  for(var i=0; i<newDorms.length; i++){
      $("#rankings").append("<div class=\'ranking\'><div class=\'number\'><h12>#" + parseInt(i+1) + "</h12></div>" +
    "<div class=\'name\'><h11>" + newDorms[i].getDormName() + "</h11></div>" + "<div class=\'overallscore\'><h13>" + newDorms[i].get(sortParam) + "</h13></div>" +
    "<div class=\'landtags\'><div class=\'box2\'><p6>" + newDorms[i].getCulture() + "</p6></div></div></div>");
  }

})

$("#filterButton").click(function(){
    $("#sortButton").click();
});

//will populate the roomObjects array with rommObj that reflect the values currently stored in the database
function generateDormObjects(){
  firebase.database().ref("/" + schoolName + "/ratings").once("value").then(function(snap){
    snap.forEach(function(snapshot){
      var snapVal = snapshot.val();
      var room = new roomObj(snapshot.key, snapVal.avgBathroom, snapVal.avgbuilding, snapVal.avgGymDist, snapVal.avgPartyDist, snapVal.avgRoom, snapVal.avgStudyDist, snapVal.avgCulture);
      roomObjects.push(room);
      currentRooms.push(room);
    })
  }).then(function(){
    listInitialDorms();
  })
}

//Calculate the average overall for all dorms in the school and display this value.
function getSchoolOverall(){
  console.log("inside of getSchoolOverall");
  var schoolTotal = 0; //Should hold total summed total of avg. dorm scores for all dorms in the school.
  var schoolAvg = 0; //will be updated to hold (schoolTotal / number of dorms)
  var numOfDorms = 0;
  firebase.database().ref("/" + schoolName + "/ratings").once("value").then(function(snapshot){
    snapshot.forEach(function(childSnap){
      numOfDorms = numOfDorms + 1;
      var snapVal = childSnap.val();
      var totalScoreVals = snapVal.avgBathroom + snapVal.avgbuilding + snapVal.avgRoom;
      schoolTotal = schoolTotal + totalScoreVals;
    })
  }).then(function(){
      console.log("numOfDorms is " + numOfDorms);
      console.log("schoolTotal is " + schoolTotal);
      schoolAvg = (schoolTotal/(numOfDorms * 3)).toFixed(2);
      $("#schoolOverall").text(schoolAvg);
  })
}

$(document).on("mousedown", ".ranking", function(){
  var dormName = $(this).find("h11").html();
  window.location = "../" + schoolName + "/" + dormName + ".html";
})


function listInitialDorms(){
  $("#rankings").empty();
  for(var i=0; i<roomObjects.length; i++){
    $("#rankings").append("<div class=\'ranking\'><div class=\'number\'><h12>#" + parseInt(i+1) + "</h12></div>" +
  "<div class=\'name\'><h11>" + roomObjects[i].getDormName() + "</h11></div>" + "<div class=\'overallscore\'><h13>" + roomObjects[i].get("Overall Rating") + "</h13></div>" +
  "<div class=\'landtags\'><div class=\'box2\'><p6>" + roomObjects[i].getCulture() + "</p6></div></div></div>");
  }
}
