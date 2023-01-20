const { front } = require("androidjs");

front.send("hello from front");

front.on("hello from back", function(msg){
	console.log(msg);
	$('#msg').html(msg);
});

function sendudp(){
    front.send("testudp");
}
