var request = require('request');
var express = require('express'); //including express   
var app = new express(); // Creating instance  
var path = require('path'),
	fs = require('fs');
var port = process.env.PORT || 1337; // setting port for the application   
//Following function is starts sockets and start listen from particular port. In following code I have given call back which contains err. So when port willbe start and listen function will be fire then this function will be execute.   
app.listen(port, function(err) {
	if (typeof(err) == "undefined") {
		console.log('Your application is running on : ' + port + ' port');
	}
});
app.use(express.static('public'));
app.use(express.static('src/views'));


app.get('/', function(req, res) {
	res.send('<h1>Hello C# Corner.</h1>');
});

app.get('/login', function(req, res) {
	request('http://www.google.com', function(error, response, body) {
		console.log('error:', error); // Print the error if one occurred 
		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
		console.log('body:', body); // Print the HTML for the Google homepage.
		res.send(response);
	});
	//res.send("Make a sample REST call at Node JS Server");
	// res.send('<h1>Welcome to PowerBI Reports</h1>');  
	// res.sendFile('src/views/home.html');
	//res.sendFile('login.html', { root: './src/views/'});
});

app.get('/getAadToken', function(req, res) {

	var json = {};
	request({
		url: 'https://login.windows.net/common/oauth2/token',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		form: {
			'grant_type': 'password',
			'scope': 'openid',
			'resource': 'https://analysis.windows.net/powerbi/api',
			'client_id': '18058e13-f49f-4ff2-a29d-ecf8254e7d2a',
			'username': 'sraasam@v2soft.com',
			'password': 'Lemon2016'
		}

	}, function(error, response, body) {
		json = JSON.parse(response.body);
		//res.send(JSON.stringify(json.access_token));
		console.log("Access Token:", json.access_token);
		res.setHeader('Access-Control-Allow-Origin', 'http://suntest.azurewebsites.net');
		res.send(json.access_token);

	});
	/* res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
	 res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
	 res.setHeader('Access-Control-Allow-Credentials', true); // If needed*/

});