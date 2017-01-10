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
function generate_secret_keys(){
	return (new Date()).valueOf().toString();
	// generate by current date
}

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 12345});
//lets require/import the mongodb native drivers.

//Lets load the mongoose module in our program
var mongoose = require('mongoose');

//Lets connect to our database using the DB server URL.
mongoose.connect('mongodb://localhost/my_database_name');

/**
 * Lets define our Model for User entity. This model represents a collection in the database.
 * We define the possible schema of User document and data types of each field.
 * */
var User = mongoose.model('User', {name: String, roles: Array, age: Number});

/**
 * Lets Use our Models
 * */

//Lets create a new user
var user1 = new User({name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']});

//Some modifications in user object
user1.name = user1.name.toUpperCase();

//Lets try to print and see it. You will see _id is assigned.
console.log(user1);

//Lets save it
user1.save(function (err, userObj) {
  if (err) {
    console.log(err);
  } else {
    console.log('saved successfully:', userObj);
  }
});





//var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
//var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
//var url = 'mongodb://localhost:27017/my_database_name';


// Use connect method to connect to the Server
// MongoClient.connect(url, function (err, db) {
//   if (err) {
//     console.log('Unable to connect to the mongoDB server. Error:', err);
//   } else {
//     //HURRAY!! We are connected. :)
//     console.log('Connection established to', url);
// // Get the documents collection
//     var collection = db.collection('users');

//     //Create some users
//     var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
//     var user2 = {name: 'modulus user', age: 22, roles: ['user']};
//     var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};

//     // Insert some users
//     collection.insert([user1, user2, user3], function (err, result) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
//       }
//       //Close connection
//       db.close();
//     });

//     // Insert some users
// collection.update({name: 'modulus user'}, {$set: {enabled: false}}, function (err, numUpdated) {
//   if (err) {
//     console.log(err);
//   } else if (numUpdated) {
//     console.log('Updated Successfully %d document(s).', numUpdated);
//   } else {
//     console.log('No document found with defined "find" criteria!');
//   }
//   //Close connection
//   db.close();
// });


//   }
// });


wss.on('connection', function(ws) {
		connections.push(ws);
		ws.on('disconnect', function(connection) {
			if(!ws.users) return;			
			connections.splice(connections.indexOf(ws),1);
			clients.splice(clients.indexOf(ws.user), 1);
		}
		//message
		ws.on('send message',function(data){
			var message=JSON.parse(data); 
			//show when server get your message
			//
			ws.emit('new message',{receivers:message.receivers,msg:message.msg});
			//show when reciever get it
			sendtoreceivers(message.receivers,message.msg);

		});
		function sendtoreceivers(receivers,msg){

		}
		//Users
		//1. step one , before register , user must submit UUID from client to the server to generate register code 
		ws.on('get register code',function (data){
			//get client id ( hardware id from OS)
			ws.clientcode=JSON.parse(data);;
			// generate a register code as a alias code
			ws.registercode=generateregistercode(clientid);
			ws.emit('new register code',{registercode:ws.registercode});
		});
		//3. step three, user send confirm code from method that user choosed.
		ws.on('submit confirm code',function(data){
			var confirmcode=JSON.parse(data);
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
			else
			{
				ws.emit('new user result',{msg:"wrong confirm code",login:""});
				return;
			}
		});
		//2. step two, submit registration data and send confirmation code to user's registration method 
		ws.on('new user',function(data,callback){
			try {
		    	var registeruser=JSON.parse(data);
		    	//var user = JSON.parse(data);
		    	var user=registeruser.user;
		    	var register=registeruser.register;
		    	//check registercode
		    	if(register.registercode!=ws.registercode)
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
		    		sendconfirmcodeviaemail(confirm);
		    		break;
		    		case "SMS":
		    		sendconfirmcodeviasms(confirm);
		    		break;
		    		case "facebook":
		    		sendconfirmcodeviafacebookbot(confirm);
		    		break;
		    	}
		    } 
		    catch (ex) {
		          callback(ex)
		    }
		});
		function sendconfirmcodeviaemail(confirm){}
		function sendconfirmcodeviasms(confirm){}
		function sendconfirmcodeviafacebookbot(confirm){}
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
			function generateregistercode(clientid){
				return encrypt_string(clientid,generate_secret_keys());
			}
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
		function recoverforgotpassword(username,newpassword)
		{

		}
		ws.on('forget password',function (data)){
			var client=JSON.parse(data);
			var username=client.username;
			ws.forgotusername=username;
			var confirm=generateconfirmcode(client.clientcode);
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
		}
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
