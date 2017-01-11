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
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function encrypt_string(_text , _key){
	// generate a hash from string
    var crypto = require('crypto'),
        text = _text,
        key = _key

    // create hahs
    var hash = crypto.createHmac('sha512', _key)
    hash.update(_text)
    var value = hash.digest('hex')
    return value;
}
function generateregistercode(clientuuid){
				return encrypt_string(clientuuid,generate_secret_keys());
			}
function generate_secret_keys(){
	return (new Date()).valueOf().toString();
	// generate by current date
}
function shakehands(clientuuid){
	return encrypt_string(clientuuid,generate_secret_keys());// access keys and store to the server and use this key 
	// to indentify every time access to the server .
}
function checkshakehands(clientuuid,clientaccesskeys){

	return true;
}
function generatelogintoken(clientuuid,clientaccesskeys)
{
	return encrypt_string(clientuuid,generate_secret_keys()+clientaccesskeys);
}
function recoverforgotpassword(username,newpassword)
{
	return true;
}
function sendtoreceivers(receivers,msg){

	}


var WebSocketServer = require('ws').Server
, wss = new WebSocketServer({port: 12345});
//lets require/import the mongodb native drivers.

//Lets load the mongoose module in our program
var mongoose = require('mongoose');

//Lets connect to our database using the DB server URL.
mongoose.connect('mongodb://nochat:5martH67@ds054288.mlab.com:54288/nochat');

/**
 * Lets define our Model for User entity. This model represents a collection in the database.
 * We define the possible schema of User document and data types of each field.
 * */
var registerSchema=mongoose.model('registers',{registercode:String,method:Number,email:String,phone:String,confirmcode:String,requesttime:Date});
var clientSchema=mongoose.model('clientinfo',{clientuuid:String,clientaccesskeys:String,logintoken:String,otherinfo:String,timeout:Date});
var userSchema = mongoose.model('Users', {username: String, password: String, phone1: String,phone2:String,phone3:String,
	email:String,address:String,created:Date,lastlogin:Date,isactive:Boolean,logintoken:String,profilephoto:String,lastsync:Date,syncto:String});
var groupSchema=mongoose.model('groups', {groupname:String,
    groupowner:String,
    admin1: String,
    admin2: String,
    admin3: String,
    groupparent: String,
    groupcreated: Date,
    groupmembers: String,
    lastupdate: Date,
    grouptype: String,
    lastsync: Date,
    syncto: String});
var conversationSchema=mongoose.model('conversation',{conversationtype: String,
    chatsessionid: String,
    conversationtime: Date,
    senttime: Date,
    receivedtime: Date,
    sender: String,
    receiver: String,
    groupreceiver: String,
    content: String,
    gpslat: String,
    gpslon: String,
    messagestatus: String,
    lastsync: Date,
    syncto: String});
var chatsessionSchema=mongoose.model('chatsession',{ chatsessioncreated: String,
    isactive: Boolean,
    lastactive: Date,
    timeout: Date,
    isgroup: Boolean,
    lastsync: Date,
    syncto: String});
var friendsSchema=mongoose.model('friends', {user1: String,
    user2: String,
    status: String,
    createddate: Date,
    isafollower: Boolean,
    isfollowing: Boolean,
    lastsync: String,
    syncto: String});
	/*
	{
		"client":
		{   
				"client":{
					"clientuuid":"",
					"clientaccesskeys":"",
					"logintoken":""
				},
				"register":{
					"registercode":"",
					"method":"",
					"email":"",
					"phone":"",
					"facebook":"",
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
/**
 * Lets Use our Models
 * */

//Lets create a new user
// var user1 = new User({name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']});

// //Some modifications in user object
// user1.name = user1.name.toUpperCase();

// //Lets try to print and see it. You will see _id is assigned.
// console.log(user1);

// //Lets save it
// user1.save(function (err, userObj) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('saved successfully:', userObj);
//   }
// });

function checkUserLogin(user){
			//username and password
			return false;
		}
function checkExistUser(user)
{
	//user
	return false;
}
function addUser(user){
	//ws.emit("update users",user)
	//user
	return true;
}
function sendconfirmcodeviaemail(confirm){}
function sendconfirmcodeviasms(confirm){}
function sendconfirmcodeviafacebookbot(confirm){}


wss.on('connection', function(ws) {
		connections.push(ws);
		ws.on('disconnect', function(connection) {
			if(!ws.users) return;			
			connections.splice(connections.indexOf(ws),1);
			clients.splice(clients.indexOf(ws.user), 1);
		});
		//shake hands
		//JSON: {clientuuid:String,clientaccesskeys:String,logintoken:String,otherinfo:String,timeout:Date}
		ws.on('shake hands',function (clientuuid){
			ws.clientuuid=clientuuid;
			ws.clientaccesskeys=shakehands(clientuuid);
			var c=new clientSchema()			
			ws.emit("client access keys",{clientaccesskeys:ws.clientaccesskeys});
		});


		//message
		ws.on('send message',function(data){
			//JSON
			//
			var client=JSON.parse(data); 
			//show when server get your message
			//check client access keys and login id;
			if(!checkshakehands(client.clientuuid,client.clientaccesskeys)) ws.emit("bad shakehands","bad shake hands");

			ws.emit('new message',{receivers:client.receivers,msg:client.msg});
			//show when reciever get it
			sendtoreceivers(client.receivers,client.msg);

		});
	
		//Users
		//1. step one , before register , user must submit UUID from client to the server to generate register code 
		//JSON: {registercode:String,method:Number,email:String,phone:String,confirmcode:String,requesttime:Date});

		ws.on('get register code',function (data){
			//get client id ( hardware id from OS)
			var client =JSON.parse(data);
			if(!checkshakehands(client.clientuuid,client.clientaccesskeys)) ws.emit("bad shakehands","bad shake hands");
			ws.clientuuid=client.clientuuid;
			// generate a register code as a alias code
			ws.registercode=generateregistercode(client.clientuuid);
			ws.emit('new register code',{registercode:ws.registercode});
		});
		//3. step three, user send confirm code from method that user choosed.
		ws.on('submit confirm code',function(data){
			var client=JSON.parse(data);
			if(!checkshakehands(client.clientuuid,client.clientaccesskeys)) ws.emit("bad shakehands","bad shake hands");
			if(client.confirm==ws.confirm)
			{
				//check exist user
				if(!checkExistUser(ws.user))
				//add a new user and login	
				{
					if(addUser(ws.user))
					{
						var token=generatelogintoken(client.clientuuid,clientaccesskeys);
						ws.emit('new user result',{msg:"OK",login:token});
						return;
					}
					else
					{
						ws.emit('new user result',{msg:"bad username",login:""});
						return;
					}
				}
				else 
				{
					ws.emit('new user result',{msg:"exist username",login:""});
					return;
				}
				
			}
			else
			{
				ws.emit('new user result',{msg:"wrong confirm code",login:""});
				return;
			}
		});
		//2. step two, submit registration data and send confirmation code to user's registration method 
		ws.on('new user',function(data,callback){
			try {
		    	var client=JSON.parse(data);
		    	if(!checkshakehands(client.clientuuid,client.clientaccesskeys)) ws.emit("bad shakehands","bad shake hands");
		    	//var user = JSON.parse(data);
		    	var user=client.user;
		    	ws.user=user;
		    	var register=client.register;
		    	ws.register=register;
		    	//check registercode
		    	if(client.registercode!=ws.registercode)
		    	{
		    		ws.emit('new user result',{msg:"bad registercode",login:""});
		    		return;
		    	}
		    	//generate and send confirmcode
		    	var confirm=generateconfirmcode(ws.clientuuid);
		    	ws.confirm=confirm;
		    	//choose method: email, sms, facebook
		    	var method=0;
		    	switch(register.method)
		    	{
		    		case "email":
		    		sendconfirmcodeviaemail(confirm);
		    		break;
		    		case "SMS":
		    		sendconfirmcodeviasms(confirm);
		    		break;
		    		case "facebook":
		    		sendconfirmcodeviafacebookbot(confirm);
		    		break;
		    		//.......
		    	}
		    } 
		    catch (ex) {
		          callback(ex)
		    }
		});
		
	
//updateUsers();
		ws.on('user login',function(data){
			ws.user=JSON.parse(data);
			if(checkExistUser(ws.user))
			{
				ws.emit('login result',{msg:"unknown username or password"});
				return;
			}
			clients.push(ws.user);
			ws.emit('login result',{msg:data});
		});
		ws.on('recover forgot password',function(data){
			var confirm=JSON.parse(data);
			var newpassword=confirm.newpassword;
			recoverforgotpassword(ws.forgotusername,newpassword);
		});
		
		ws.on('forget password',function (data){
			var client=JSON.parse(data);
			var username=client.username;
			ws.forgotusername=username;
			var confirm=generateconfirmcode(client.clientuuid);
		    	ws.confirm=confirm;
		    	//choose method: email, sms, facebook
		    	var method=client.method;
		    	switch(method)
		    	{
		    		case "email":
		    		sendconfirmcodeviaemail(confirm);
		    		break;
		    		case "SMS":
		    		sendconfirmcodeviasms(confirm);
		    		break;
		    		case "facebook":
		    		sendconfirmcodeviafacebookbot(confirm);
		    		break;
		    	}
		});
		

		//Group
		ws.on('create a group',function(data){
			if(!checkshakehands(client.clientuuid,client.clientaccesskeys)) ws.emit("bad shakehands","bad shake hands");
			ws.emit('group crated result',{msg:data});
		});
		ws.on('edit group',function(data){
			if(!checkshakehands(client.clientuuid,client.clientaccesskeys)) ws.emit("bad shakehands","bad shake hands");
			ws.emit('edit group result',{msg:data});
		});
		ws.on('delete group',function(data){
			if(!checkshakehands(client.clientuuid,client.clientaccesskeys)) ws.emit("bad shakehands","bad shake hands");
			ws.emit('delete group result',{msg:data});
		});

	});
