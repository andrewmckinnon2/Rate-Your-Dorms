var roomObjects = []; //This is where objects representing all the dorms will be placed
var currentRooms = []; //This is where objects representing the currently displayed dorms will be placed.


$("#findADorm").click(function(){
  window.location = "Landingpage.html";
})

$("#writeAReview").click(function(){
  window.location = "writeReview.html";
})

var dormNames = ["Alderman", "Alexander", "Avery", "Aycock", "Carmichael",
"Cobb","Connor", "Craige", "Craige North", "Ehringhaus", "Everett", "Graham", "Grimes",
"McIver", "Morrison", "Old East", "Old West", "Parker", "Ruffin", "Spencer", "Stacy", "Teague",
"Winston", "Granville"];

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

  if(sortParam == "Proximity to Study" || sortParam == "Proximity to Party" || sortParam == "Proximity to Workout"){
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


function roomObj(dormName, bathroom, building, gym, kitchen, party, room, study, culture){
    this.dormName = dormName;
    this.bathroom = bathroom;
    this.building = building;
    this.gym = gym;
    this.kitchen = kitchen;
    this.party = party;
    this.room = room;
    this.study = study;
    this.culture = culture;

    this.overall = Math.round((bathroom+building+room)/3);

  this.get = function(aspect){
    if(aspect == "Overall Rating"){
      return this.overall;
    }else if(aspect == "Room Rating"){
      return this.room;
    }else if(aspect == "Bathroom Rating"){
      return this.bathroom;
    }else if(aspect == "Building Rating"){
      return this.building;
    }else if(aspect == "Proximity to Study"){
      return this.study;
    }else if(aspect == "Proximity to Party"){
      return this.party;
    }else if(aspect == "Proximity to Workout"){
      return this.gym;
    }else if(aspect == this.culture){
      return this.culture;
    }
  }

  this.getCulture = function(){
    return this.culture;
  }

  this.getOverall = function(){
    return this.overall;
  }

  this.getDormName = function(){
    return this.dormName;
  }

  this.getBathroom = function(){
    return this.bathroom;
  }

  this.getBuilding = function(){
    return this.Building
  }

  this.getGym = function(){
    return this.gym;
  }

  this.getKitchen = function(){
    return this.kitchen;
  }

  this.getParty = function(){
    return this.party;
  }

  this.getRoom = function(){
    return this.room;
  }

  this.getStudy = function(){
    return this.study;
  }
}

//will populate the roomObjects array with rommObj that reflect the values currently stored in the database
function generateDormObjects(){
  firebase.database().ref("/UNC-CH/ratings").once("value").then(function(snap){
    snap.forEach(function(snapshot){
      var snapVal = snapshot.val();
      var room = new roomObj(snapshot.key, snapVal.avgBathroom, snapVal.avgbuilding, snapVal.avgGymDist, snapVal.avgKitchen, snapVal.avgPartyDist, snapVal.avgRoom, snapVal.avgStudyDist, snapVal.avgCulture);
      roomObjects.push(room);
      currentRooms.push(room);
    })
  }).then(function(){
    listInitialDorms();
  })
}

//Calculate the average overall for all dorms in the school and display this value.
function getSchoolOverall(){
  var schoolTotal = 0; //Should hold total summed total of avg. dorm scores for all dorms in the school.
  var schoolAvg = 0; //will be updated to hold (schoolTotal / number of dorms)
  firebase.database().ref("/UNC-CH/ratings").once("value").then(function(snapshot){
    snapshot.forEach(function(childSnap){
      var snapVal = childSnap.val();
      var totalScoreVals = snapVal.avgBathroom + snapVal.avgbuilding + snapVal.avgRoom;
      //var totalScoreValsOver5 = snapVal.avgStudyDist + snapVal.avgPartyDist + snapVal.avgGymDist;
      schoolTotal = schoolTotal + totalScoreVals;
    })
  }).then(function(){
      schoolAvg = (schoolTotal/(dormNames.length)).toFixed(2);
      $("#schoolOverall").text(schoolAvg);
  })
}

$(document).on("mousedown", ".ranking", function(){
  var dormName = $(this).find("h11").html();
  window.location = "dorms/" + dormName + ".html";
})


function listInitialDorms(){
  $("#rankings").empty();
  for(var i=0; i<roomObjects.length; i++){
    $("#rankings").append("<div class=\'ranking\'><div class=\'number\'><h12>#" + parseInt(i+1) + "</h12></div>" +
  "<div class=\'name\'><h11>" + roomObjects[i].getDormName() + "</h11></div>" + "<div class=\'overallscore\'><h13>" + roomObjects[i].get("Overall Rating") + "</h13></div>" +
  "<div class=\'landtags\'><div class=\'box2\'><p6>" + roomObjects[i].getCulture() + "</p6></div></div></div>");
  }
}
