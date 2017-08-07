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
			'username': '**********', //power bi pro master account
			'password': '**************'
		}

	}, function(error, response, body) {
		json = JSON.parse(response.body);
		//res.send(JSON.stringify(json.access_token));
		console.log("Access Token:", json.access_token);
		res.setHeader('Access-Control-Allow-Origin', 'http://suntest.azurewebsites.net');
		res.send(json.access_token);
	});
});
