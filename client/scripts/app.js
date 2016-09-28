var app = {};
app.storage = {};
app.friends = [];
app.rooms = [];
// app.escapeHtml = function(str) {
//   var divvy = document.createElement('p');
//   divvy.appendChild(document.createTextNode(str));
//   return divvy.innerHTML;
// };

//first implementing app.send function - done
  //will come back to reconfigure data object to pull live room Name from UI, for now will be set to default - done
  // room Name needs a handleClick funciton that will change ui to represent which chat room we are in. 
  //clear the text message bar - done
  //add friends and 
app.send = function(message) {

  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent', data);
      app.fetch();
      // app.renderMessage()
    },
    error: function (err) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', err);
    }
  });
};

app.fetch = function () {

  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    contentType: 'application/JSON',
    data: 'order=-createdAt',
    success: function (data) {
      console.log('appending via for Of loop', data.results[0]);
      for (let object of data.results) {
        if (app.storage[object.objectId] === undefined) {
          app.renderMessage(object.username, object.text, object.roomname);
          app.storage[object.objectId] = object;
          if (app.rooms.indexOf(object.roomname) < 0) {
            app.rooms.push(object.roomname);
            app.renderRoom(object.roomname);
          } 
        }
      }
    }, 
    error: function (err) {
      console.error('chatterbox: Failed to receive your message', err);
    }
  });
};

app.init = function() {
  $('body').on('submit', app.handleSubmit());
  $('#roomSelect').change(function() { console.log('this'); } );
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function(username, message, roomname) {
  //$('#chats').empty();

    // var userNameEl = '<p class="username" id=' + app.storage[obj].username + ' onclick = app.handleUsernameClick(this.id)>' + $('<span></span">').text(app.storage[obj].username).html() + '</p>';
    // var messageEl = $('<span></span>').text(app.storage[obj].text);
    // var roomNameEl = $('<span onclick="renderRoom()"></span>').text(app.storage[obj].roomname);
    
    // $('#chats').append('<div> Message: ' + messageEl.html() + '<br>User Name: ' + userNameEl + '<br>Room Name: ' + roomNameEl.html() + '</div><br>');
  
  var userNameEl = '<ul class="username" id=' + username + ' onclick = app.handleUsernameClick(this.id)>' + username + '</ul>';
  var messageEl = $('<span></span>').text(message);
  var roomNameEl = $('<span onclick="renderRoom()"></span>').text(roomname);
  
  $('#chats').append('<ul class=' + username + '> User Name:' + userNameEl + 'Room Name: ' + roomNameEl.html() + '<br> Message: ' + messageEl.html() + '<br></ul>');
};

app.renderRoom = function(roomName) {

  $('#roomSelect').append('<option>' + roomName + '</option>').text();
};

app.handleUsernameClick = function(m) {
  if (app.friends.indexOf(m) < 0) {
    app.friends.push(m);
    $('.friendsList').append('<ul>' + m + '</ul>').text();
  } 
  var newClass = $( '.' + m + '');
  newClass.css({ 'font-weight': 'bold'});

  // try .text
};

app.handleSubmit = function() {
  var messageText = $('#message').val();
  var username = window.location.search;
  username = username.substr(username.indexOf('=') + 1);
  var message = {
    roomname: 'room1',
    text: messageText,
    username: username
  };
  app.send(message);
  $('#message').val('');
};

app.handleRoomSubmit = function() {
  var newRoomNameData = $('#newRoom').val();
  app.renderRoom(newRoomNameData);
  console.log('blast off', newRoomNameData);
};


app.selectRooms = function() {
  var room = $('#roomSelect').val();
  var selectedRooms = _.filter(app.storage, function (msg) {
    if (msg.roomname === room) {
      return true;
    }
  });
  $( '#chats').html('');
  for (let object of selectedRooms) {      
    app.renderMessage(object.username, object.text, object.roomname);
  }
};
//create app.handleRoomSubmit
//setInterval(function() {app.fetch();}, 5000);
app.fetch()