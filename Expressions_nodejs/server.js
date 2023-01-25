var express=require('express');
var app=express();
var http=require('http').Server(app);
var io=require('socket.io')(http);
var listening_port=3008;

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});
app.get('/scripts/script.js',function(req,res){
	res.sendFile(__dirname + '/scripts/script.js');
});
app.get('/RinaInit.csv',function(req,res){
    res.sendFile(__dirname+'/RinaInit.csv');
});

http.listen(listening_port,function(){
    console.log("Listening on port "+listening_port);
});