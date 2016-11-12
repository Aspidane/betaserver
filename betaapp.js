console.log("Starting Server");
// Online version Nov/12 
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var validator = require('validator');
var sanitizeHtml = require('sanitize-html');

//Set options for sanitizing
//Whitelist <a> tags and the link, class, id, and target attributes
var sanitizeHtmlOptions = {
	allowedTags: ['a'],
	allowedAttributes: {'a':['href', 'class', 'id', 'target'] }
};
//anchorme.js turns link text into html links 
//abc.com -> <a href='abc.com' ... >abc.com</a>
var anchorme = require('./JavaScript/anchorme.min.js');
//Options to be used when creating links
var anchormeOptions = {
 //"anyAttribute":"anyValue" //Generic example
 "attributes":{
  "class":"messageLink",
  "target":"_blank",
 },
 "html":true,
 ips:true,
 emails:true,
 urls:true,
 TLDs:20,
 truncate:50,
 defaultProtocol:"https://"
};

var users=[];       //List of users
var socketIDs=[];   

//Initialize an object to record what public chat rooms we have active
var publicRooms=[];
//By default, we have these chats
publicRooms.push({name: "Graveyard", users:[]});
publicRooms.push({name: "Cemetary", users:[]});
publicRooms.push({name: "Crypt", users:[]});
publicRooms.push({name: "Mausoleum", users:[]});
publicRooms.push({name: "Pyramid", users:[]});

//Initialize array to hold data on private (password protected) rooms UNUSED atm
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
            	res.end('Error loading betaclient.css');
        	} else{
            	//Otherwise, send it to the client
            	res.writeHead(200);
            	res.end(cssData);
        	}
   	});
	//If they request the anchorme javascript file
	} else if(req.url.indexOf("anchorme.")>-1){
    	console.log("JavaScript requested");
    	//Read it to them
    	fs.readFile(__dirname + '/JavaScript/anchorme.min.js', function(jsErr, jsData){
         	//If there is an error, report it
        	if(jsErr) {
            	console.log("ERROR LOADING ANCHORME: "+jsErr);
            	res.writeHead(500);
            	res.end('Error loading anchorme.min.js');
        	} else{
            	res.writeHead(200);
            	res.end(jsData);
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
            	res.end('Error loading betaclientJS.js');
        	} else{
            	res.writeHead(200);
            	res.end(jsData);
        	}
    	});
	}else if(req.url.indexOf("back_moon.png")>-1){
        console.log("background requested");
        //Read it to them
        fs.readFile(__dirname + '/images/back_moon.png', function(bgErr, backgroundData){
            //If there is an error, report it
            if(bgErr) {
                console.log("ERROR LOADING IMAGE BACKGROUND: "+bgErr);
                res.writeHead(500);
                res.end('Error loading back_moon.png');
            } else{
                //Otherwise, send it to the client
                res.writeHead(200);
                res.end(backgroundData);
            }
        });        
    }else if(req.url.indexOf("spookyGif.gif")>-1){
        console.log("SpookyGif.gif requested");
        //Read it to them
        fs.readFile(__dirname + '/images/spookyGif.gif', function(bgErr, backgroundData){
            //If there is an error, report it
            if(bgErr) {
                console.log("ERROR LOADING spookyGif.gif: "+bgErr);
                res.writeHead(500);
                res.end('Error loading spookyGif.gif');
            } else{
                //Otherwise, send it to the client
                res.writeHead(200);
                res.end(backgroundData);
            }
        });     
    }else if(req.url.indexOf("spookyGif2.gif")>-1){
        console.log("SpookyGif2.gif requested");
        //Read it to them
        fs.readFile(__dirname + '/images/spookyGif2.gif', function(bgErr, backgroundData){
            //If there is an error, report it
            if(bgErr) {
                console.log("ERROR LOADING spookyGif2.gif: "+bgErr);
                res.writeHead(500);
                res.end('Error loading spookyGif2.gif');
            } else{
                //Otherwise, send it to the client
                res.writeHead(200);
                res.end(backgroundData);
            }
        });      
    }else if(req.url.indexOf("fb_icon.png")>-1){
        console.log("SpookyGif2.gif requested");
        //Read it to them
        fs.readFile(__dirname + '/images/fb_icon.png', function(bgErr, backgroundData){
            //If there is an error, report it
            if(bgErr) {
                console.log("ERROR LOADING fb_icon.png: "+bgErr);
                res.writeHead(500);
                res.end('Error loading fb_icon.png');
            } else{
                //Otherwise, send it to the client
                res.writeHead(200);
                res.end(backgroundData);
            }
        });          
	//Default to giving them the client
	} else { //fs.readFile(__dirname + '/../chatServerRossi/chat_index.html',
    	fs.readFile(__dirname + '/betaclient.html', function(err, data){
        	if(err) {
            	res.writeHead(500);
            	return res.end('Error loading betaclient.html');
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
function formatMessage(message){
	//First, create the links
	var linkedMessage=anchorme.js(message, anchormeOptions);
	
	//Then escape the bad characters
	var safeMessage=sanitizeHtml(linkedMessage, sanitizeHtmlOptions);
	
	return safeMessage;
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
		var safeMessage=formatMessage(data["message"]);
    	io.to(data["room"]).emit('messageFromServer', { type:"0", sender:username, message:safeMessage, time:timestamp, day:t_day, room:data["room"] });
	});
	/*****************************************************/
	//When a user changes their username
	socket.on('newName', function(data){
    	console.log("New name attempt: "+username+" -> "+data["updatedName"]);
		//Confirm the name meets the length requirements 15 >= length >= 3
		//If there are any problems, deny it and tell the user
		if(data["updatedName"].length>15 || data["updatedName"].length<3 ){
			//Report the result
			console.log("Not successful: "+username+" -> "+data["updatedName"]);
        	//And send the response to the user
			socket.emit('messageFromServer', {type:"1", result:"no", reason:"Incorrect length."} );
		//Check for unwanted characters
		}else if( invalidCharacterCheck(data["updatedName"]) ){
			//Report the result
			console.log("Not successful: "+username+" -> "+data["updatedName"]);
        	//And send the response to the user
			socket.emit('messageFromServer', {type:"1", result:"no", reason:"Invalid characters."} );
		//Ensure the name isn't the same as a public chat room
        }else if( getPublicRoomNames().indexOf(data["updatedName"]) > -1 ){
            //Report the result
            console.log("Not successful: "+username+" -> "+data["updatedName"]);
            //And send the response to the user
            socket.emit('messageFromServer', {type:"1", result:"no", reason:"Please do not use names of chat rooms."} );
        //If no problems were found, continue on
		}else{
			//Record the current username
			var oldUsername=username;  
			//Escape anything that might've been missed
			var safeName=validator.escape(data["updatedName"]);
			
			var index=-1;//Index of the username;-1 means it is not taken
			//Search through the array looking for it
			for(var i=0;i<users.length;i++){
				if(users[i].username==safeName){
					index=i;//Record the location
					break;    //And break out of the loop
				}
			}
			if(-1==index){ //If it is not found
				//Log that it was a success
				console.log("Successful: "+username+" -> "+safeName);
				//Update the list of users
				//Search for the old username
				for(var i=0;i<users.length;i++){
					//When it is found
					if(username==users[i].username){
						//Update it
						users[i].username=safeName;
						//must to check through all rooms as well
						for(var k=0; k<publicRooms.length;k++){
							var index_2=  publicRooms[k].users.indexOf(username);
							if(index_2 >= 0 ){
								publicRooms[k].users[index_2]=safeName;
							}
						}
						break; //And exit the loop "for i"
					}
				}
				username=safeName; //Update the (local) username
				//And send the response to the user
				socket.emit('messageFromServer', {type:"1", result:"yes", updatedName:username} );
				//io.sockets.emit sends a message to ALL THE USERS
				var t_day = my_day();
				var timestamp= my_hour();    
				io.sockets.emit('messageFromServer', {type:"4", oldName:oldUsername, newName:username,time:timestamp, day:t_day} );
			}else{ //If it was found, report an error
				console.log("Not successful: "+username+" -> "+safeName);
				//And send the response to the user
				socket.emit('messageFromServer', {type:"1", result:"no", reason:"Name is already taken."} );
			}
		}
  	});
	/*****************************************************/
	//When a user tries to join/create a new chat room
	socket.on('newChatRoom', function(data){
    	console.log("New chat room message: "+JSON.stringify(data));
        //Get the data
    	var room=data["room"];
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
		var safeMessage=formatMessage(data["message"]);
        var responseObject={//Contains the private message and who the  sender/receiver are
        	recipient:receiver,
        	sender:originator,
        	message:safeMessage,
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
//Checks for invalid characters
var invalidCharacterCheck=function(string){
	//
	var pattern = new RegExp(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\\|\/|\+|\-/g);
	//Test the string and return the result
	return pattern.test(string);
}



