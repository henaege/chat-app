var http = require("http");
var fs = require("fs");

// Include SocketIO.io (installed by npm - it is NOT part of core)
var socketio = require("socket.io");
var userList = [];
var server = http.createServer((req, res)=> {
    console.log("Someone connected via http.")
        if(req.url == '/'){
		fs.readFile('index.html', 'utf-8',(error,data)=>{
			// console.log(error);
			// console.log(data);
			if(error){
				res.writeHead(500,{'content-type':'text/html'});
				res.end('Internal Server Error');
			}else{
				res.writeHead(200,{'content-type':'text/html'});
				res.end(data);
			}
		});
	}else if(req.url == '/style.css'){
		fs.readFile('style.css', 'utf-8',(error,data)=>{
			if(error){
				res.writeHead(500,{'content-type':'text/html'});
				res.end('Internal Server Error');
			}else{
				res.writeHead(200,{'content-type':'text/css'});
				res.end(data);
			}			
		});
	}else if(req.url == '/config.js'){
		fs.readFile('config.js', 'utf-8',(error,data)=>{
			if(error){
				res.writeHead(500,{'content-type':'text/html'});
				res.end('Internal Server Error');
			}else{
				res.writeHead(200,{'content-type':'application/javascript'});
				res.end(data);
			}			
		});
	}else{
		res.writeHead(404,{'content-type':'text/html'});
		res.end('<h1>This page does not exist</h1>');	
	}
});
var getTime = ()=> {
	var currentTime = (new Date()).toLocaleTimeString();
	return currentTime;
}
var io = socketio.listen(server);
// handle socket connections.
io.sockets.on('connect',(socket)=> {
    console.log("someone connected via socket");

    socket.on('nameToServer', (name)=> {
		console.log(name + " just joined")
        userList.unshift(name)
        io.sockets.emit('newUser', userList,{reason:"left"});
        console.log(userList);

		socket.on('disconnect', ()=> {
			console.log(name + ' disconnected');
			console.log('*** ' + userList + ' ***')
			userList.splice(userList.indexOf(name), 1);
			io.sockets.emit('removeUser', userList, name)
			console.log(userList);
		})


    });
    socket.on('sendMessage',()=> {
        console.log("Someone clicked on the button");
    })

    socket.on('messageToServer',(messageObj)=> {
		
        io.sockets.emit('messageToClient', '(' + getTime() + ') ' + messageObj.name + ' says: ' + messageObj.newMessage);
        
    })
});


server.listen(8080);
console.log("Listening on port 8080...");