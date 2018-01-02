//Listen for submit button click. On click add appropriate information to firebase after ensuring
//that all fields have been filled in.
$("#submit").click(function(){
  if($("#name").val()!="" && $("#emailAddress").val()!="" && ($("#messageField").val()!="" && !($("#messageField").text().includes("Message...")))){
      //Gather info and add to new node in firebase
      var newNode = firebase.database().ref("/Contact Messages/").push();
      var emailVal = $("#emailAddress").val();
      var nameVal = $("#name").val();
      var messageVal = $("#messageField").val();
      //Set values in new node
      newNode.set({
        Email: emailVal,
        Message: messageVal,
        Name: nameVal
      });
      window.location = "contactsubmit.html";
  }else{
    alert("Please be sure that all fields are filled in");
  }
})

//When message field is clicked, remove 'Message...' text
$("#messageField").click(function(){
  $(this).text("");
})

//Redirect listener
$("#writerev").click(function(){
  window.location = "writeReview.html";
})
