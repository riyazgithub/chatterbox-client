var app = {};

app.escapeHtml = function(str){
  var divvy = document.createElement('p')
  divvy.appendChild(document.createTextNode(str))
  return divvy.innerHTML;
}

app.addMessage = function(message){
  console.log('message', message)
  let text = message.text;
  $('#chats').append('<div>'+app.escapeHtml(message.text));
}

app.send = function(message){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'post',
    data: JSON.stringify(message),
    dataType: 'json',
    contentType: 'applicaiton/json',
    success: function(){
      console.log('dataObj being sent', this.data)
    },
    error: function(err){
      console.log('error: ',err);
    }
  })
};


app.fetch = function(data){

    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      contentType: 'application/json',
      success: function(data){
        console.log('data', data)
      for (var i = data.results.length - 1; i >= 0; i--) {
        app.addMessage(data.results[i]) }
      }
    })
};


app.fetch();

