
var socket=io();

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}



socket.on("connect",()=>{
var params=jQuery.deparam(window.location.search);
socket.emit('join',params,function(err){
  if(err){
alert(err);
window.location.href="/";
  }
  else{

  }
})

});
socket.on("disconnect",()=>{
  console.log("disconnced to server")
})

socket.on('updateUserList', function (users) {
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});
socket.on("newMessage",function(message){

scrollToBottom ();
  var ft= moment(message.createdAt).format('h:mm a')


  var template = jQuery("#message-template").html();
  var html= Mustache.render(template,{
    text:message.text,
    from:message.from,
    createdAt:ft
  });
  jQuery("#messages").append(html);
})

socket.on("newLocationMessage",function(message){
scrollToBottom ();
var ft= moment(message.createdAt).format('h:mm a')
var template = jQuery("#location-message-template").html();
var html= Mustache.render(template,{
  from:message.from,
  url:message.url,

  createdAt:ft
});
jQuery("#messages").append(html);
})
jQuery("#message-form").on("submit",function(e){
  e.preventDefault();
var x =jQuery('[name=message]');
  socket.emit("createMessage",{
    from:"User",
    text:x.val()
  },function(){
x.val('');
  })
})

var bu=jQuery("#b");
bu.on("click",function(){
if(!navigator.geolocation){
return alert("Your Browser do not support Geolocation")
}
bu.attr('disabled','disabled').text("Sending Location...")
navigator.geolocation.getCurrentPosition(function(position){
bu.removeAttr('disabled').text("Send location")
socket.emit('createLocationMessage',{
  latitude:position.coords.latitude,
  longitude:position.coords.longitude
});
},function(){
bu.removeAttr('disabled').text("Send location")
alert("Unable to fetch location")
});
});
