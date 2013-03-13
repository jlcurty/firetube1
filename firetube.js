var commentsRef = new Firebase('https://itwtest.firebaseio.com/comments/');
var myUserID = null;

//Create an Firebase Simple Login client so we can do Facebook auth

var authClient = new FirebaseAuthClient(commentsRef, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    console.log(error);
  } else if (user) {
    // user authenticated with Firebase
	myUserID=user.id
   console.log('User Id: ' + user.id + ', Email: ' + user.email);
  } else {
    // user is logged out
  }
});

//Create a query for only the last 10 comments
var last10Comments = commentsRef.limit(10);

//Render Comments
last10Comments.on('child_added', function (snapshot) {
  var comment = snapshot.val();
  var newDiv = $("<div/>").addClass("comment").attr("id",snapshot.name()).appendTo("#comments");
  FB.api("/" + comment.userid, function(userdata) {
    comment.name = userdata.name;
    newDiv.html(Mustache.to_html($('#template').html(), comment));
  });
});

//Add New Comments
function onCommentKeyDown(event) {
  if(event.keyCode == 13) {
    if(myUserID == null) {
      alert("You must log in to leave a comment");
    } else {
      commentsRef.push({userid: myUserID, body: $("#text").val()})
      $("#text").val("");
    }
    event.preventDefault();
  }
}

//Remove deleted comments
last10Comments.on("child_removed", function(snapshot) {
  $("#" + snapshot.name()).remove();
});

//Handle Login
function onLoginButtonClicked() {
  authClient.login("facebook");
}
function onLoginButtonClicked2() {
  authClient.login("password", {
      email: $("#user").val(),
      password: $("#pass").val()
    });
}


function onregisterButtonClick() {
	authClient.createUser($("#user").val(), $("#pass").val(), function(error, user) {
 if (error) {
    // an error occurred while attempting login
    console.log(error);
	}
});
}

function onchangeButtonClick() {
authClient.changePassword(email, oldPassword, newPassword, function(error, success) {
  if (!error) {
    console.log('Password change successfully');
  }
});
}
