$(function(){
	'use strict';
Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
     //   setInterval(function(){ notify(); },100);
      }
    });
	// Start timer
function test(){
	var date = new Date();
    var day = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][date.getDay()];
    var month = ["January","February","March","April","May","June","July","August","September","October","November","December"][date.getMonth()];
	$("div.dateDisplay").html(day + " " + date.getDate() + " " + month + ", " + date.getFullYear());
	$("div.timeDisplay").html(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
    $("title").html(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
};
setInterval(function(){ test(); },50);
function notify(){
    var date = new Date();
    var options = {
      renotify: false
    } 
    var notification = new Notification(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds(), options);
    setTimeout(notification.close.bind(notification), 150);
};

});
