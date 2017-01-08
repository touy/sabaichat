process.title = 'SabaiChatAPP';

// // latest 100 messages
// var history = [ ];
// list of currently connected clients (users)
var clients = [];
// connections
var connections=[];

/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      \.replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 12345});


wss.on('connection', function(ws) {
		
		connections.push(ws);
		
		ws.on('disconnect', function(connection) {
		
			if(!ws.users) return;
			
			connections.splice(connections.indexOf(ws),1);
			clients.splice(clients.indexOf(ws.user), 1);	
		
		}
		
		//message
		ws.on('send message',function(data){
			ws.emit('new message',{msg:data});
		});

		//Users
		ws.on('get register code',function (clientid){
			//get client id ( hardware id from OS)
			ws.clientcode=clientid;
			// generate a register code as a alias code
			ws.registercode=generateregistercode(clientid);
			ws.emit('new register code',{clientid:"new registercode"});
		});
		ws.on('submit confirm code',function(data){
			var confirmcode=data;
			if(confirmcode==ws.confirm)
			{
				//check exist user
				if(!checkExistUser(ws.user))
				//add a new user and login	
				{
					if(addUser(ws.user))
					{
						var token="";
						ws.emit('new user result',{msg:"OK",login:token});
					}
					else
					{
						ws.emit('new user result',{msg:"bad username",login:""});
					}
				}
				else 
				{
					ws.emit('new user result',{msg:"exist username",login:""});
				}
				
			}
		});
		ws.on('new user',function(data,callback){
			try {
		    	var registeruser=JSON.parse(data);
		    	//var user = JSON.parse(data);
		    	var user=registeruser.user;
		    	var register=registeruser.register;
		    	//check registercode
		    	if(!checkclientcode(register.registercode))
		    	{
		    		ws.emit('new user result',{msg:"bad registercode",login:""});
		    		return;
		    	}
		    	//generate and send confirmcode
		    	var confirm=generateconfirmcode(ws.clientcode);
		    	ws.confirm=confirm;
		    	//choose method: email, sms, facebook
		    	var method=0;
		    	switch(register.method)
		    	{
		    		case "email":
		    		sendconfirmcodeviaemail();
		    		break;
		    		case "SMS":
		    		sendconfirmcodeviasms();
		    		break;
		    		case "facebook":
		    		sendconfirmcodeviafacebookbot();
		    		break;
		    	}
		    } 
		    catch (ex) {
		          callback(ex)
		    }
			/*{   
				"register":{
					"registercode":"",
					"method":"",
					"email":"",
					"phone":"",
					"confirmcode":"",
					"requesttime":""
				},

				"user":{				    
				    "username": "",
				    "password": "",
				    "phone1": "",
				    "phone2": "",
				    "phone3": "",
				    "email": "",
				    "address": "",
				    "created": "",
				    "lastlogin": "",
				    "isactive": "",
				    "logintoken": "",
				    "profilephoto": "",
				    "lastsync": "",
				    "syncto": ""
				}
			}
			*/
			//validate user info 
			/*
				{				    
				    "username": "", min/max: 3/20
				    "password": "", min/max: 6/30
				    "phone1": "",  2055516321
				    "phone2": "", 2055516321
				    "phone3": "", 2055516321
				    "email": "", touya.ra@gmail.com
				    "address": "", max : 300
				    "created": "", datetime
				    "lastlogin": "", datetime
				    "isactive": "", datetime
				    "logintoken": "", xxxxxxxxxxxxxxxxxxxxxxxxxxx
				    "profilephoto": "", photo binary
				    "lastsync": "", datetime
				    "syncto": ""
				}
			*/
			
			//updateUsers();
		});
		ws.on('user login',function(data){
			ws.user=data;
			clients.push(ws.user);
			ws.emit('login result',{msg:data});
		});
		function checkExistUser()
		{
			//user
			return false;
		}
		function addUser(){
			//ws.emit("update users",user)
			//user
			return true;
		}

		//Group
		ws.on('create a group',function(data){
			ws.emit('group crated result',{msg:data});
		});
		ws.on('edit group',function(data){
			ws.emit('edit group result',{msg:data});
		});
		ws.on('delete group',function(data){
			ws.emit('delete group result',{msg:data});
		});

	});
});
