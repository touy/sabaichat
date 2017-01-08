process.title = 'SabaiChatAPP';

// // latest 100 messages
// var history = [ ];
// list of currently connected clients (users)
var clients = [ ];
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
			// generate a register code as a alias code
			ws.emit('new register code',{clientid,"new registercode"});
		});
		ws.on('new user',function(data,callback){
			try {
		    	var registeruser=JSON.parse(str);
		    	//var user = JSON.parse(data);
		    	var user=registeruser.user;
		    	var registeruser.register;
		    	//check registercode
		    	//choose method: email, sms, facebook
		    	//generate and send confirmcode
		    	//generate time , timeout 5 minutes
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
			//check exist user
			//add a new user and login	

			ws.emit('new user result',{msg:data});
			//updateUsers();
		});
		ws.on('user login',function(data){
			ws.user=data;
			clients.push(ws.user);
			ws.emit('login result',{msg:data});
		});
		function updateUsers(){
			ws.emit("update users",user)
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
