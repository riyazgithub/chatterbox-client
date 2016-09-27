var app = {};

// app.escapeHtml = function(str) {
//   var divvy = document.createElement('p');
//   divvy.appendChild(document.createTextNode(str));
//   return divvy.innerHTML;
// };



app.send = function(message) {

  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent', data);
    },
    error: function (err) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', err);
    }
  });
};

app.fetch = function () {

  $.ajax({
    //url: 'https://api.parse.com/1/classes/messages',
    contentType: 'application/JSON',
    success: function (data) {
      console.log('appending via for Of loop');
      for (let object of data.results) {
        app.renderMessage(object.username, object.text, object.roomname);
        // if (app.friends.indexOf(object.username) < 0) {
        //   app.friends.push(object.username);
        // }
      }
    }, 
    error: function (err) {
      console.error('chatterbox: Failed to receive your message', err);
    }
  });
};

app.init = function() {
  $('body').on('submit', app.handleSubmit());
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function(username, message, roomname) {
  console.log('renderMessage called');


  var userNameEl = '<p class="username" id=' + username + ' onclick = app.handleUsernameClick(this.id)>' + $('<span></span">').text(username).html() + '</p>';
  var messageEl = $('<span></span>').text(message);
  var roomNameEl = $('<span onclick="renderRoom()"></span>').text(roomname);

  
  $('#chats').append('<div><div> Message: ' + messageEl.html() + '<br>User Name: ' + userNameEl + '<br>Room Name: ' + roomNameEl.html() + '</div><br></div>');
};

app.renderRoom = function(roomName) {
  $('#roomSelect').append('<p>' + roomName + '</p>').text();
};

app.handleUsernameClick = function(m) {
  console.log("Value: " + m);
  // try .text
};

app.handleSubmit = function() {
  var once = $('#message').val();
  console.log('once', once);
};
app.fetch();
