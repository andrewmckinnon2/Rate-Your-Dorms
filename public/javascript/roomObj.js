function roomObj(dormName, bathroom, building, gym, party, room, study, culture){
    this.dormName = dormName;
    this.bathroom = bathroom;
    this.building = building;
    this.gym = gym;
    this.party = party;
    this.room = room;
    this.study = study;
    this.culture = culture;

    this.overall = Number((building+bathroom+room)/3).toFixed(1);

  this.get = function(aspect){
    if(aspect == "Overall Rating"){
      return this.overall;
    }else if(aspect == "Room Rating"){
      return this.room;
    }else if(aspect == "Bathroom Rating"){
      return this.bathroom;
    }else if(aspect == "Building Rating"){
      return this.building;
    }else if(aspect == "Proximity to Class"){
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
    return this.building
  }

  this.getGym = function(){
    return this.gym;
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
