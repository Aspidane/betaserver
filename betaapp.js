console.log("Starting Server");

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

//List of users
var users=[];
var socketIDs=[];

//Initialize an object to record what chat rooms we have active
var chatRooms=[];
//By default, we have a general chat
chatRooms.push({name: "general", users:[], password:"" });

//Listen on port 80
app.listen(3000);

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
    //});
    //If they request the javascript file
    } else if(req.url.indexOf(".js")>-1){
        //console.log("JavaScript requested");
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
/*---------------------------------------------------------------------------------*/
//When a browser connects to the webpage
io.on('connection', function (socket){
    console.log("New connection");
    //Initiate the username variable
    var username="guest0";
    //Do while to generate a random name and then check it's availability
    do{
        username="guest" +Math.floor(Math.random()*100000);
        //Keep trying until the generated name is not in the array
    } while( -1!=users.indexOf(username) );
    console.log("Name: "+username);
    //Send the user their username and who else is online
    socket.emit('welcome', {name:username, others:users});
    //Add the user to the list of the online users
    users.push(username);
    //Add the user's socket's id
    socketIDs.push(socket.id);
    console.log("users: "+users);
    console.log("ids: "+socketIDs);
    //2 is a new user, username is the selected username
    io.sockets.emit('messageFromServer', {type:"2", name:username} );
    /*****************************************************/
    //3 is a user leaves
    socket.on('disconnect', function () {
        console.log("Disconnected user:"+username);
        //Search for the name of the user that left
        for(var i=0;i<users.length;i++){
         //If it matches, we remove it
            if(username==users[i]){
                 //Replace it with the user at the end of the list
                 users[i]=users[users.length-1];
                 users.pop()
                 
                 //Repeat for the socket IDs
                 socketIDs[i]=socketIDs[socketIDs.length-1];
                 socketIDs.pop();
            }
        }
        //Emit the username aong with the signal
        io.sockets.emit("messageFromServer", {type:"3", user:username});
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
        console.log("Received: "+data);
        //And send it to the clients io.sockets.emit is ALL sockets
        //socket.emit is for the current client only
        io.sockets.emit('messageFromServer', { type:"0", sender:username, message:data["message"] });
    });
    /*****************************************************/
    //When a user changes their username
    socket.on('newName', function(data){
        //Log the name
        console.log("New name attempt: "+username+" -> "+data["updatedName"]);
        var oldUsername=username;  
        //If the desired name is not already taken
        //(That is to say, not found in the array of usernames of current users)
        if(-1==users.indexOf( data["updatedName"] )){
            //Log that it was a success
            console.log("Successful: "+username+" -> "+data["updatedName"]);
            //Update the list of users
            //Search for the old username
            for(var i=0;i<users.length;i++){
                //When it is found
                if(username==users[i]){
                    //Update it
                    users[i]=data["updatedName"];
                    break; //And exit the loop
                }
            }
            //Update the (local) username
            username=data["updatedName"];
            //And send the response to the user
            socket.emit('messageFromServer', {type:"1", result:"yes", updatedName:username} );
            //io.sockets.emit sends a message to ALL THE USERS
            io.sockets.emit('messageFromServer', {type:"4", oldName:oldUsername, newName:username} );
        }else{
            console.log("Not successful: "+username+" -> "+data["updatedName"]);
            //And send the response to the user
            socket.emit('messageFromServer', {type:"1", result:"no", reason:"Name is already taken."} );
        }
      });
    /*****************************************************/ 
    //When a user tries to join/create a new chat room
    socket.on('newChatRoom', function(data){
        console.log("New chat room message");
        var room=data["name"];
        var newChatUsers=data["users"];
        var index=-1;
        for(var i=0;i<chatRooms.length;i++){
            //If the room is found
            if(chatRooms[i].name==room){
                //Record the index it is at
                index=i;
                break;
            }
        }
        //If the room was not found (i.e. if it does not exist)
        if(-1==index){
            console.log("Creating chatroom "+data["name"]);
            var newRoom={
            name:room,
            users:newChatUsers
            };
            chatRooms.push(newRoom);
            //If it was found, we add users to it
            } else {
                console.log("Joining "+data["name"]);
                chatRooms[index].users=chatRooms[index].users.concat(newChatUsers);
            }
        //Join the chat
        socket.join(data["name"]);
    });
    /*****************************************************/ 
    //When we get a new private message
    socket.on('newPrivateMessage', function(data){
        console.log("New private message");
        //Who the private message is sent to
        var receiver=data["user"];
        //And we get the index in the username list;
        //This will be used to get the socket id
        var index=users.indexOf(receiver);

        
        //If not found, we send an error back
        if(-1==index){
            console.log("ERROR: user "+receiver+" not found.");
            socket.emit("errorMessage", {msg:"ERROR: user "+receiver+" not found."});
        }else{
            //Get the client's id
            var senderIndex=socketIDs.indexOf(socket.id);
            //Get the client's username based on the id
            var originator=users[senderIndex];
         
            //The object to be sent to the client
            //Contains the private message and who the  sender/receiver are
            var responseObject={
                recipient:receiver,
                sender:originator,
                message:data["message"]
            };
            //Sends the responseObject to the client
            console.log("Sending to "+socketIDs[index]+" "+receiver);
            socket.to(socketIDs[index]).emit("newPrivateMessage", responseObject);
            //console.log("Sending to "+socketIDs[senderIndex]+" "+originator);            
            //socket.to(socketIDs[senderIndex]).emit("newPrivateMessage", responseObject);            

            
           
        }
    });
    /*********************************/
    /*** ADMIN/DEBUGGING FUNCTIONS ***/
    /*********************************/
     
    //Prints all the users
    socket.on('adminPrintUsers', function(data){
        console.log("Printing Users:\n"+chatrooms[0].users);
    });
 
}); // END  io.on('connection', function (socket){
/*---------------------------------------------------------------------------------*/

