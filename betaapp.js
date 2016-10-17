console.log("Starting Server");
// Online version OCt/17 
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

var users=[];       //List of users
var socketIDs=[];   

//Initialize an object to record what public chat rooms we have active
var publicRooms=[];
//By default, we have a general (0) chat and sports (1)
publicRooms.push({name: "General", users:[]});
publicRooms.push({name: "Sports", users:[]});

//Initialize array to hold data on private (password protected) rooms
var privateRooms=[];

//Listen on port 80 or 5000
const PORT=process.env.PORT || 80;
app.listen(PORT);

function handler(req, res) {
	//If they request the css
	if(req.url.indexOf(".css")>-1){
    	//process.nextTick(function(){
    	console.log("css requested");
    	//Read it to them
    	fs.readFile(__dirname + '/CSS/betaclient.css', function(cssErr, cssData){
        	//If there is an error, report it
        	if(cssErr) {
            	console.log("ERROR LOADING CSS: "+cssErr);
            	res.writeHead(500);
            	res.end('Error loading clientCSS.css');
        	} else{
            	//Otherwise, send it to the client
            	res.writeHead(200);
            	res.end(cssData);
        	}
   	});
	//If they request the javascript file
	} else if(req.url.indexOf(".js")>-1){
    	console.log("JavaScript requested");
    	//Read it to them
    	fs.readFile(__dirname + '/JavaScript/betaclientJS.js', function(jsErr, jsData){
         	//If there is an error, report it
        	if(jsErr) {
            	console.log("ERROR LOADING JAVASCRIPT: "+jsErr);
            	res.writeHead(500);
            	res.end('Error loading test.js');
        	} else{
            	res.writeHead(200);
            	res.end(jsData);
        	}
    	});
	//Default to giving them the client
	} else { //fs.readFile(__dirname + '/../chatServerRossi/chat_index.html',
    	fs.readFile(__dirname + '/betaclient.html', function(err, data){
        	if(err) {
            	res.writeHead(500);
            	return res.end('Error loading client.html');
        	}
         	//200 is ok
        	res.writeHead(200, {'Content-Type': 'text/html; charset=ascii'});
        	res.end(data);
    	});
  }
} // END function handler(req, res)
/*****************************************************/
//Returns an aray with all the names of the public chat rooms
function getPublicRoomNames(){
    var toReturn=[];    //The array that will be returned
    //Go through the list of public rooms
    for(var i=0;i<publicRooms.length;i++){
        //And add their names only to toReturn
        toReturn.push(publicRooms[i].name);
    }
    return toReturn;
}
/*****************************************************/
//Returns an aray with all the names of the users
function getUsers(){
    var toReturn=[];    //The array that will be returned
    //Go through the list of public rooms
    for(var i=0;i<users.length;i++){
        //And add their names only to toReturn
        toReturn.push(users[i].username);
    }
    return toReturn;
}
/*****************************************************/
function FormatZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
/*****************************************************/
function my_hour() {
    var d = new Date();
    var h = FormatZero(d.getHours());
    var m = FormatZero(d.getMinutes());
    var s = FormatZero(d.getSeconds());
    return  h + ":" + m + ":" + s;
}
/*****************************************************/
function my_day(){
 var d = new Date();
 return d.toString();
}
/*****************************************************/
//When a browser connects to the webpage
io.on('connection', function (socket){
	console.log("New connection");
	var username="guest0";//Initiate the username variable
    var taken=true;//Whether or not the name is taken
	//Do while to generate a random name and then check it's availability
	while(true==taken){
    	username="guest" +Math.floor(Math.random()*100000); //Generate a random name
        taken=false; //Assume it isn't taken
        for(var i=0;i<users.length;i++){    //Go through the array of users and
            //If it is in use
            if(users[i].username==username){
                taken=true; //Mark it as such and break out of the array
                break;
            }
        }
    }
    console.log("Name: "+username); // must be commented
    //Add the user to the list of the TOTAL online users
    users.push({username:username, socket:socket.id});  
    socketIDs.push(socket.id);  
    var t_day = my_day();
    var timestamp= my_hour();    
    socket.emit('welcome', {name:username,time:timestamp,day:t_day,rooms:getPublicRoomNames()});

	/*****************************************************/
	//3 is a user leaves
	socket.on('disconnect', function () {
    	console.log("Disconnected user:"+username);
    	//Search for the name of the user that left
    	for(var i=0;i<users.length;i++){
        	if(username==users[i].username){//If it matches, we remove it
                users.splice(i,1);
                socketIDs.splice(i,1);
                //Remove the user from the chat rooms
                //Start with public rooms
                for(var j=0;j<publicRooms.length;j++){
                    //Search through each room's list of users
                    var index = publicRooms[j].users.indexOf(username);
                    if(index >= 0){
                        publicRooms[j].users.splice(index,1);//Remove it
                        var t_day = my_day();
                        var timestamp= my_hour();    
                        io.to(publicRooms[j].name).emit("messageFromServer", {type:"3", room:publicRooms[j].name,time:timestamp,day:t_day,leaving_user:username,others:publicRooms[j].users});
                    }
                }
                //Next do private rooms
                for(var j=0;j<privateRooms.length;j++){
                    //Search through each room's list of users
                    for(var k=0;k<privateRooms[j].users.length;k++){
                        //If there is a match
                        if(username==privateRooms[j].users[k]){
                            privateRooms[j].users.splice(k,1);//Remove it
                            var t_day = my_day();
                            var timestamp= my_hour();    
                            io.sockets.emit("messageFromServer", {type:"3", room:privateRooms[j].name,time:timestamp,day:t_day,leaving_user:username,others:privateRooms[j].users});
                        }
                    }
                }
                break; //break the for i
        	}//if
    	}// for i
	});
	/*****************************************************/
	//Unused event handler
	socket.on('my other event', function (data) {
    	console.log(data);
	});
	/*****************************************************/
	//When there is a message to the server from our chat
	socket.on('messageToServer', function (data) {
    	//Log it
    	console.log("Received: "+JSON.stringify(data) );
    	//And send it to the clients io.sockets.emit is ALL sockets
    	//socket.emit is for the current client only
        var t_day = my_day();
        var timestamp= my_hour();    
    	io.to(data["room"]).emit('messageFromServer', { type:"0", sender:username, message:data["message"],time:timestamp,day:t_day, room:data["room"] });
	});
	/*****************************************************/
	//When a user changes their username
	socket.on('newName', function(data){
    	console.log("New name attempt: "+username+" -> "+data["updatedName"]);
    	var oldUsername=username;  
        var index=-1;//Index of the username;-1 means it is not taken
        //Search through the array looking for it
        for(var i=0;i<users.length;i++){
            if(users[i].username==data["updatedName"]){
                index=i;//Record the location
                break;    //And break out of the loop
            }
        }
    	if(-1==index){ //If it is not found
        	//Log that it was a success
        	console.log("Successful: "+username+" -> "+data["updatedName"]);
        	//Update the list of users
        	//Search for the old username
        	for(var i=0;i<users.length;i++){
            	//When it is found
            	if(username==users[i].username){
                	//Update it
                	users[i].username=data["updatedName"];
                    //must to check through all rooms as well
                    for(var k=0; k<publicRooms.length;k++){
                        var index_2=  publicRooms[k].users.indexOf(username);
                        if(index_2 >= 0 ){
                            publicRooms[k].users[index_2]=data["updatedName"];
                        }
                    }
                	break; //And exit the loop "for i"
            	}
        	}
        	username=data["updatedName"]; //Update the (local) username
        	//And send the response to the user
        	socket.emit('messageFromServer', {type:"1", result:"yes", updatedName:username} );
        	//io.sockets.emit sends a message to ALL THE USERS
            var t_day = my_day();
            var timestamp= my_hour();    
        	io.sockets.emit('messageFromServer', {type:"4", oldName:oldUsername, newName:username,time:timestamp, day:t_day} );
    	}else{ //If it was found, report an error
        	console.log("Not successful: "+username+" -> "+data["updatedName"]);
        	//And send the response to the user
        	socket.emit('messageFromServer', {type:"1", result:"no", reason:"Name is already taken."} );
    	}
  	});
	/*****************************************************/
	//When a user tries to join/create a new chat room
	socket.on('newChatRoom', function(data){
        //WE NEED TO UPGRADE THIS SECTION USING CHAT_KIND PARAMETER, SO THAT WAY WE CAN SEARCH FASTER
        // BECAUSE SOME ONE COULD TRY ENTER IN A PRIVATE CHATROOM WITH A WRONG PASSWORD AND THAT MIGHT
        //FORCE CREATE A NEW ROOM WITH SAME NAME /ETC
        // SO IF CHAT_KIND == 1 (PUBLIC)  ELSE IS PRIVATE THEN CHECK THE PASSWORD
    	console.log("New chat room message: "+JSON.stringify(data));
        //console.log("Existing rooms: "+getPublicRoomNames());
        //Get the data
    	var room=data["room"];
        //var senderIndex=socketIDs.indexOf(socket.id);
        	//Get the client's username based on the id
    	var newChatUser= data["user"];
    	var index=-1;//Initialize the index variable
        //If there is no password, we search the public rooms
        if(""==data["password"] || null==data["password"]){
            for(var i=0;i<publicRooms.length;i++){
                if(publicRooms[i].name==room){
                    index=i; //If the public room is found records the index it is at
                    break; //And break out of the loop
                }
            }
            console.log("Publicos: "+index);
        } else { //Otherwise, search the private rooms
            for(var i=0;i<privateRooms.length;i++){
                if(privateRooms[i].name==room){
                    index=i;//If the private room is found records the index it is at
   				 break; //And break out of the loop
                }
            }
        }
    	//If the room was not found (i.e. if it does not exist)
    	if(-1==index){
        	console.log("Creating chatroom "+data["name"]);
        	var newRoom={
                name : room,
                users : newChatUser
        	};
        	privateRooms.push(newRoom);
        	//If it was found, we add users to it
        } else { //WARNING we need to work with more details here to difference between indexes that could belong to a private or public room
            console.log("Joining "+data["room"]);
            console.log("publicRooms[i]: "+JSON.stringify(publicRooms[index]));
            //Add the user to the list of users
            publicRooms[index].users.push(newChatUser);
            var t_day = my_day();
            var timestamp= my_hour();    
            socket.emit('JoningnewChatRoom', {room:publicRooms[index].name , name:newChatUser,time:timestamp,day:t_day, others: publicRooms[index].users, kind: "1"  });         
            io.to(publicRooms[index].name).emit('messageFromServer', {type:"2", name:newChatUser,time:timestamp,day:t_day, room:publicRooms[index].name,others: publicRooms[index].users} ); 
        }
    	//Join the chat
    	socket.join(room);
	});
	/*****************************************************/
	//When a user leaves to public/private(future) chat room
	socket.on('LeaveChatRoom', function(data){
        var senderIndex=socketIDs.indexOf(socket.id);
        //Get the client's username based on the id
        var originator=users[senderIndex].username;        
        var room_name = data["name"];
    	console.log("Leaving chat room message: "+JSON.stringify(data));
    	//socket.leave(room_name); /// WARNING this is not working!!
        for(var i=0; i< publicRooms.length; i++){
            if(room_name == publicRooms[i].name){
                var index = publicRooms[i].users.indexOf(originator);
                publicRooms[i].users.splice(index,1);//Remove it
                console.log("user "+originator+" is leaving the room "+room_name+ " with "+publicRooms[i].users );
                var t_day = my_day();
                var timestamp= my_hour();    
                io.to(room_name).emit('messageFromServer', {type:"7", name:originator, room:room_name, time:timestamp, day:t_day, others:publicRooms[i].users } );
                break;
            }
        }         
   	 //console.log("Existing rooms: "+getPublicRoomNames());
	});
	/*****************************************************/
	//When we get a new private message
	socket.on('newPrivateMessage', function(data){
        //if(users[I].socket==socket.id) //We found the user!
    	console.log("New private message");
    	var receiver=data["user"];  //Who the private message is sent to
        var senderIndex=socketIDs.indexOf(socket.id);
        var originator=users[senderIndex].username;  //Get the client's username based on the id
        var senderIndex=socketIDs.indexOf(socket.id);
        //Get the client's username based on the id
        console.log(senderIndex);
        var originator=users[senderIndex].username;
        //The object to be sent to the client
        var responseObject={//Contains the private message and who the  sender/receiver are
        	recipient:receiver,
        	sender:originator,
        	message:data["message"],
            day: my_day(),
            time:my_hour()
        };        
    	var index=-1;
    	//And we get the index in the username list;
        for(var i=0;i<users.length;i++){
            if(receiver==users[i].username){//If we find the user
                index=i;//Record the index
                break; //And break out of the loop
            }
        }   	 
    	if(-1==index){//If not found, we send an error back
        	console.log("ERROR: user "+receiver+" not found.");
            responseObject.message= "ERROR: user "+receiver+" not Found or Offline.";
        	socket.emit("errorMessage", responseObject);
    	}else{
            if(socket.id==socketIDs[index]){//USers may not send messages to themselves
                socket.emit("errorMessage", {msg:"ERROR: cannot send messages to yourself."});
            }else{
                console.log("Sending to "+socketIDs[index]+" "+receiver);
                socket.to(socketIDs[index]).emit("newPrivateMessage", responseObject);//Sends the responseObject to the client
                //responseObject.sender=receiver;
                //responseObject.recipient=originator;
                socket.emit("newPrivateMessage", responseObject);
            }
    	}
	});
    
	/*********************************/
	/*** ADMIN/DEBUGGING FUNCTIONS ***/
	/*********************************/
	 
	//Prints all the users
	socket.on('adminPrintUsers', function(data){
    	console.log("Printing Users:\n"+publicRooms[0].users);
	});
 
}); // END  io.on('connection', function (socket){
/*---------------------------------------------------------------------------------*/




