"use strict";
    
var max_valor_msg=300;
var max_valor_username=15;
 
//Client's username. Will be updated when they connect to the server.
var username="0";
 
//Array of users currently connected
var users = [];
 
//Connect to the server via socket.io
var socket = io('http://localhost');


var btnadd_me = document.getElementById('add_me');   
var tabs = [];
var tab_total_count = 0;

 
/*****************************************************/
socket.on('welcome', function (data) {
	console.log(data);
	username=data["name"]; //Get the default name from the server
	//Add the name to the username box
    document.getElementById("WuserID").innerHTML="Welcome "+username+"!";
    //Add user to general chat (creating the tab)
    add_me_chatroom("general");
    
	//Add the users already online to the list of online users
	//This will include the newly connected user
	users=data["others"];
	console.log("users: "+users);
});
 
/*****************************************************/
socket.on('messageFromServer', function (data) {
	console.log("Received: "+data);
    //var t_user = {
    //     name : "",
         //id_name : "",
    //     ignored: false
    //}; 
    
	//Get what type of message it is
	var typeReceived=data["type"]; //data.type or data["type"] will give the type property of the object called data
	//0 is a normal message
	if("0"==typeReceived){
    	//Get the contents and the sender
    	var received=data["message"];
    	var sender=data["sender"];
    	//Add the message to the end
        write_in_chat(typeReceived,sender,received,"");
	//1 is the response to the user trying to update their username   	 
	} else if("1"==typeReceived){
    	//variable to hold the attempt's result (true==success, false==failure)
    	var changed=data["result"];
    	//If it returned "no", report it to the user
    	if("no"==changed){
        	//Explanation of what went wrong
        	var reason=data["reason"];
        	alert("Error: "+reason);
    	} else if("yes"==changed){
            //Update the username box
            username=data["updatedName"];
            document.getElementById("WuserID").innerHTML="Welcome "+data["updatedName"]+ "!";
            document.getElementById("userid").value="";
            //refreshUsers(); //The server will send out a message telling the client to do this
    	}
	//2 is the response for a new user
    } else if("2"==typeReceived){
        console.log("New user");
        //Store the name in a variable
        var newUser=data["name"];
        //Append the new user
        users.push(newUser);
        console.log("users: "+users);
        //Note that the user has connected
        write_in_chat(typeReceived,newUser,"","");
        //Refresh the list of users online
        refreshUsers();
    //3 is the response is a user leaves
    } else if("3"==typeReceived){
        //Get the username that left
        var exUser=data["user"];
        console.log("Deleting user "+exUser);
        console.log("Users: "+users);
        //Search for the name of the user that left
        for(var i=0;i<users.length;i++){
            //If it matches, we remove it
            if(exUser==users[i]){
                users.splice(i,1);     
                refreshUsers();
                //And exit the loop
                break;
            }
        }
    //4 is the reponse if a user changes their name
    } else if("4"==typeReceived){
        //Get the old and new names
        var oldName=data["oldName"];
        var newName=data["newName"];
        //Search for the username that was updated
        for(var i=0;i<users.length;i++){
            //When it is found
            if(oldName==users[i]){	 
                //Update it
                users[i]=newName;
                //Refresh the online user list
                refreshUsers();
                write_in_chat(typeReceived,oldName,newName,"");
                break; //And exit the loop
            }    
        }
     //If none of the above, respond that it's an unrecognized command
     
     } else {
        socket.emit("ERROR: unrecognized command: "+typeReceived);
     }
});
/*****************************************************/
socket.on('newPrivateMessage', function (data) {
	//type "5" private msg
	var typeReceived="5";
    
    //alert(data["sender"]+", "+data["recipient"]+", "+data["message"]);

    write_in_chat(typeReceived,data["sender"],data["recipient"],data["message"]);   
  
    
    console.log("New private message");
    console.log(data["sender"]+" sent this user ("+data["recipient"]+") the following message: "+data["message"]);
});
/*****************************************************/
//Refreshes the list of users online
function refreshUsers(){
	console.log("Users refreshed!");
	var userBox=document.getElementById("onlineUsers");
	//Clear out the list
	userBox.innerHTML="";
	//Iterate through the list of users and add them one by one
	for(var i=0;i<users.length;i++){
        var temp_name= "option_user_container"+i;
        //creating the container
        var main_container = document.createElement("div"); 
            main_container.setAttribute("class","user_container");
        var main_user_on = document.createElement("div");  // this is the "button"
            //main_user_on.setAttribute("id","id_user_on"+i);   
            main_user_on.setAttribute("class","user_on");  
            main_user_on.setAttribute("onclick","user_on_click('"+temp_name+"')");  
            var name_user = document.createTextNode(users[i]);
            main_user_on.appendChild(name_user); 
        //appending the user_on to the main_container 
        main_container.appendChild(main_user_on);
        
        var main_option_user_container = document.createElement("div"); 
            main_option_user_container.setAttribute("class","option_user_container");   
            main_option_user_container.setAttribute("id",temp_name);         
        //appending the options to the option_user_container
        var option1 = document.createElement("div"); 
            option1.setAttribute("id","p_msg_"+i);
            //option1.setAttribute("class","my_p_msg");
            option1.setAttribute("onclick","btn_add_me_Click('"+users[i]+"')");   
            var text_option_1 = document.createTextNode('Send priv. msg'+i);
            option1.appendChild(text_option_1);
        var option2 = document.createElement("div"); 
            //option2.setAttribute("id","p_msg_"+i);
            //option2.setAttribute("class","my_p_msg");
           // option2.setAttribute("onclick","btn_add_me_Click('"+users[i]+"')");   
            var text_option_2 = document.createTextNode('Ignore');
            option2.appendChild(text_option_2);            
        main_option_user_container.appendChild(option1);
        main_option_user_container.appendChild(option2);
        //appending the option_user_container to the main_container 
        main_container.appendChild(main_option_user_container);    
        //appending the main_container with all the stuff inside
        userBox.appendChild(main_container);
        userBox.innerHTML += "<br />";        
	}
};
/*****************************************************/    
function user_on_click(element_id) {
        // this part remove all the "show" from any older click
        var t0 = document.getElementsByClassName("option_user_container");
        if(t0.length==0) alert(t0.length);
        for (var i = 0; i < t0.length; i++) {
            var t1 = t0[i];
            t1.classList.remove('show');    
        }  
    document.getElementById(element_id).classList.add("show");  // it was a toggle, but it didnt work propperly
}
/*****************************************************/
// Close the my_p_msg if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.user_on')) { //this is when i click outside any user_on to make dissapear the little menu
        var dropdowns = document.getElementsByClassName("option_user_container");
        if(dropdowns.length==0) alert(dropdowns.length);
        for (var i = 0; i < dropdowns.length; i++) {
            var open_my_p_msg = dropdowns[i];
            var temp1 = open_my_p_msg.classList.item(0);
            if (open_my_p_msg.classList.contains('show')) {
                open_my_p_msg.classList.remove('show');
            }
        }
    }
}  
/*****************************************************/
//Sends a chat message to the server
function sendMessage(){
	//Get the message from the input box
	var input=document.getElementById("userMessage");
	var textLength = input.value.length;
        //alert(input.value);     
	if (input.value!= null && input.value != "" ){
        var tab_id="";    
        for(var i=0;i<tabs.length;i++){    
            if (tabs[i].tab_status== true){
                tab_id= tabs[i].id_name;
                break;
            }
        }    
        if(tab_id!=""){          
            //getting the name of the tab
            for(var i=0;i<tabs.length;i++){    
                if (tabs[i].id_name == tab_id ){
                    var tab_name= tabs[i].user_names;
                    break;
                }
            } 
        }    
    //if is a general message (general chat)
        if(tab_name=="general"){
            //Display what we're sending to the log
            console.log("sending "+ellipse(input.value, max_valor_msg));
            //Send our emssage to the server
            socket.emit("messageToServer", {message:ellipse(input.value, max_valor_msg)});             
        }else{
            if(tab_name!=null){
                var recipient=finding_name(tab_name);
                //if is a private message
                console.log("sending pm: "+ellipse(input.value, max_valor_msg));        
                socket.emit("newPrivateMessage", {message:ellipse(input.value, max_valor_msg), user:recipient});
                //WARNING am I cheating???
                write_in_chat("6",recipient,username,ellipse(input.value, max_valor_msg));
            }
        }
	}
	//Clear out the text
	input.value="";
}
/*****************************************************/
//Sends the server an updated username
function updateName(){
	var input=document.getElementById("userid");
	var textLength = input.value.length;
	if (input.value!= null && input.value != "" ){
    	if(textLength>max_valor_username){
        	alert("Error: Name exceeds " + max_valor_username + " characters long");
        	input.value=input.value.substring(0,max_valor_username);
    	}else{
        	//Display what we're sending to the log
        	console.log("New name "+input.value);
        	//Send our emssage to the server
        	socket.emit("newName", {updatedName:input.value});   
    	}
	}
}
/*****************************************************/
function ellipse(str, max){
	return str.length > (max - 3) ? str.substring(0,max-3) + '...' : str;
}
/*****************************************************/   
function finding_name(my_str) {
    var the_user_name=""; 
    var pos = my_str.indexOf("_");
    if ( my_str.substring(0,pos)==username){
        the_user_name=my_str.substring(pos+1,my_str.length);
    }else{
        the_user_name=my_str.substring(0,pos);        
    }
    return the_user_name;
}
/*****************************************************/   
function finding_tab_byname(the_tab_name){
    var pos = -1;
    for(var i=0;i<tabs.length;i++){    
        if(the_tab_name=='general'){
            if (tabs[i].user_names == the_tab_name){
                pos=i;
                break;
            }            
        }else if (finding_name(tabs[i].user_names) == the_tab_name && the_tab_name!=username){
                pos=i;
                break;
        } 
    } 
    return pos;
}
/*****************************************************/   
function refreshing_modal(i){
    //alert(tabs[i]);
    if(tabs[i]!=null){
        var chatbox=document.getElementById("myModal"); //chatbox is the <p>   
        chatbox.innerHTML= tabs[i].tab_log;
        chatbox.scrollTop = chatbox.scrollHeight; //Scroll to the bottom    
    }
}
/*****************************************************/   
function write_in_chat(type,msg1,msg2,msg3){
    //So here we must to feed the logs and refresh the chatbox depening of the actual tab kind
    // and find where (which tab) put the message, and wich tab refresh (actual tab)
	if(type=="0"){ //message by user
        //could be on general or could be on private  msg
        var tab_i= finding_tab_byname("general");
        //alert(msg1 +" "+tab_i);            
        if(tab_i>=0){
            tabs[tab_i].tab_log += "<br /><span class='userMsg'><span class='username'>"+msg1+":</span>  "+msg2+"</span>";
            if (tabs[tab_i].tab_status== true){ 
                refreshing_modal(tab_i);
            }
        }
	}else if(type=="4"){ // system msg: user changed name
        var tab_i= finding_tab_byname("general");
        if(tab_i>=0){ // updating general log
            tabs[tab_i].tab_log += "<br /><span class='systemMsg'>"+msg1+" has changed their name to "+msg2+"</span>";
            if (tabs[tab_i].tab_status== true){ 
                refreshing_modal(tab_i);
            }
        }
        var tab_i= finding_tab_byname(msg1);
        if(tab_i>=0){ //updating private msg log
            tabs[tab_i].tab_log += "<br /><span class='systemMsg'>"+msg1+" has changed their name to "+msg2+"</span>";
            if (tabs[tab_i].tab_status== true){ 
                refreshing_modal(tab_i);
            }
            //and refresh the new name on the tab name as well
            tabs[tab_i].user_names= tabs[tab_i].user_names.replace(msg1,msg2);
            var refreshed_tab= document.getElementById(tabs[tab_i].id_name).innerHTML;
            var replacing_nametab= refreshed_tab.replace(msg1,msg2);
            document.getElementById(tabs[tab_i].id_name).innerHTML= replacing_nametab;
        }
	}else if(type=="2"){ // system msg: new user connected
        var tab_i= finding_tab_byname("general");
        if(tab_i>=0){
            tabs[tab_i].tab_log +=  "<br /><span class='systemMsg'>"+msg1+" has connected.</span>";
            if (tabs[tab_i].tab_status== true){ 
                refreshing_modal(tab_i);
            }
        }    
	}else if(type=="5"){ // system msg: private msg
        //write_in_chat(typeReceived,data["sender"],data["recipient"],data["message"]);       
        //must find the sender and the tab, if it doesnt exist must create it
        
        var tab_i= finding_tab_byname(msg1);
        //alert(msg1 +" "+tab_i);        
        if(tab_i>=0){ //updating private msg log
            tabs[tab_i].tab_log += "<br /><span class='userMsg'><span class='username'>"+msg1+":</span>  "+msg3+"</span>";
            if (tabs[tab_i].tab_status== true){ 
                refreshing_modal(tab_i);
            }
        }else{ //creating the new tab for priv. msg
            btn_add_me_Click(msg1);
            tab_i= finding_tab_byname(msg1); 
            //alert(msg1 +" "+tab_i);
            tabs[tab_i].tab_log += "<br /><span class='userMsg'><span class='username'>"+msg1+":</span>  "+msg3+"</span>";
            if (tabs[tab_i].tab_status== true){ 
                refreshing_modal(tab_i);
            }
        }        
    }else if(type=="6"){
        var tab_i= finding_tab_byname(msg1);
        //alert(msg2 +" "+tab_i); 
        tabs[tab_i].tab_log += "<br /><span class='userMsg'><span class='username'>"+msg2+":</span>  "+msg3+"</span>";
        refreshing_modal(tab_i);        
    }    
}

/*****************************************************/       
function testing(event){
    socket.emit("newChatRoom", {name:"testRoom", users:username});
}
/*****************************************************/
function destroy_me_Click(event) { 
    //with this i get the id name of the X object im clicking
    var my_id=this.getAttribute("id");
    //alert (my_id);
    var temp_tabs=[];
    //with this for i get the info from the tabs manager  
    for(var i=0;i<tabs.length;i++){
            //When it is found
        if(my_id==tabs[i].clsx_name){	
            var a_tab = document.getElementById(tabs[i].id_name);
            var the_tab_holder = document.getElementById("tab_holder");                
            //alert(my_id +", " + tabs[i].id_name);
            if(the_tab_holder.childElementCount > 0){
                    //with this we remove the event "on click" just before the tab deleting
                    a_tab.removeAttribute("onclick","dialog_on_click('"+tabs[i].id_name+"')");                  
                the_tab_holder.removeChild(a_tab);
            }
            //now i must delete the info from the tabs
            tabs.splice(i,1);    
            break; //And exit the loop
            }    
        }         
}
/*****************************************************/       
function add_me_chatroom(chat_name) {
    //alert(the_user_name);
    //first we must check that we dont have a priv. msg (or prev tab)
    //with this person, if we dont, we created a tab and everything
    var flag_tab = false;
    for(var i=0;i<tabs.length;i++){    
        if (tabs[i].user_names== chat_name){
            var old_tab_id_name = tabs[i].id_name;
            //alert("already exists");
            flag_tab = true;
            break;
        }
    }
    if (!flag_tab){
        //if we do, we just focus the required tab
        tab_total_count+=1;
        var new_tab = {
            user_names : chat_name, 
            id_name : "Tab_"+tab_total_count,
            clsx_name: "Cls_"+tab_total_count,
            tab_log : "WELCOME to -MY CHAT- American Server! :)<br />",
            tab_status : true
        };
        tabs.push(new_tab);

        var the_tab_holder = document.getElementById("tab_holder"); 

        var tab = document.createElement("aside");
        // this text should change to a user2 name (the user that actually is talking to you)       
            var text_id_tab = document.createTextNode(chat_name);
            tab.appendChild(text_id_tab); 
        tab.setAttribute("id",new_tab.id_name);
        tab.setAttribute("class","mytab");
        tab.setAttribute("onclick","dialog_on_click('"+new_tab.id_name+"')");  
        
        the_tab_holder.appendChild(tab);
        //tab.addEventListener('click', dialog_on_click());         
        
        //<!--    <span  class="close-x" onclick="destroy_me_Click()"></span> -->
        var closing_x = document.createElement("span");
        var text_symbol_close = document.createTextNode('x');
        closing_x.appendChild(text_symbol_close);
        closing_x.setAttribute("class","close-x");
        closing_x.setAttribute("id",new_tab.clsx_name);
        tab.appendChild(closing_x);
        closing_x.addEventListener('click', destroy_me_Click);  
        
        document.getElementById(new_tab.id_name).focus;

        dialog_on_click(new_tab.id_name); // adds the focus to the lastest created (or just the new one)
    }else{
        dialog_on_click(old_tab_id_name); // adds the focus to the tab that has the user we want to talk and was created before
    }
} 
/*****************************************************/       


function btn_add_me_Click(the_user_name) {
    //alert(the_user_name);
    //first we must check that we dont have a priv. msg (or prev tab)
    //with this person, if we dont, we created a tab and everything
    var flag_tab = false;
    for(var i=0;i<tabs.length;i++){    
        if (tabs[i].user_names== username+"_"+the_user_name){
            var old_tab_id_name = tabs[i].id_name;
            //alert("already exists");
            flag_tab = true;
            break;
        }
    }
    if (!flag_tab){
        //if we do, we just focus the required tab
        tab_total_count+=1;
        var new_tab = {
            user_names : username+"_"+the_user_name, 
            id_name : "Tab_"+tab_total_count,
            clsx_name: "Cls_"+tab_total_count,
            tab_log : "",
            tab_status : false
        };
        tabs.push(new_tab);

        var the_tab_holder = document.getElementById("tab_holder"); 

        var tab = document.createElement("aside");
        // this text should change to a user2 name (the user that actually is talking to you)       
            var text_id_tab = document.createTextNode(the_user_name);
            tab.appendChild(text_id_tab); 
        tab.setAttribute("id",new_tab.id_name);
        tab.setAttribute("class","mytab");
        tab.setAttribute("onclick","dialog_on_click('"+new_tab.id_name+"')");  
        
        the_tab_holder.appendChild(tab);
        //<!--    <span  class="close-x" onclick="destroy_me_Click()"></span> -->
        var closing_x = document.createElement("span");
        var text_symbol_close = document.createTextNode('x');
        closing_x.appendChild(text_symbol_close);
        closing_x.setAttribute("class","close-x");
        closing_x.setAttribute("id",new_tab.clsx_name);
        tab.appendChild(closing_x);
        closing_x.addEventListener('click', destroy_me_Click);  
        
        document.getElementById(new_tab.id_name).focus;

        dialog_on_click(new_tab.id_name); // adds the focus to the lastest created (or just the new one)
    }else{
        dialog_on_click(old_tab_id_name); // adds the focus to the tab that has the user we want to talk and was created before
    }
}    

/*****************************************************/    
function dialog_on_click(tab_id) {

    //alert(tab_id);
        var temp_list = document.getElementsByClassName("mytab"); // New List with all tabs
        if (temp_list.length==0) alert(temp_list.length);
        for(var k=0; k< temp_list.length; k++){  //starting to check all the tabs
            var temp = temp_list[k];
            var t3= temp.getAttribute("id"); // a tab
            if (temp.classList.contains('mytab2') && tab_id!=t3) {
                temp.classList.remove('mytab2');
            }        
        }    
    if (document.getElementById(tab_id)!=null){
        //alert("aqui-> "+tab_id);
        document.getElementById(tab_id).classList.add("mytab2");
        for(var i=0;i<tabs.length;i++){    
            if (tabs[i].id_name== tab_id){
                tabs[i].tab_status = true;
                refreshing_modal(i);                
            }else{
                tabs[i].tab_status = false;
            }    
        }         
    }
}
/*****************************************************/    

	

