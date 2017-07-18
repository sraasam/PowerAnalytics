var express = require('express'); //including express   
var app = new express(); // Creating instance   
var port = process.env.PORT || 1337;// setting port for the application   
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
app.get('/reports', function(req, res) {  
    res.send('<h1>Welcome to PowerBI Reports</h1>');  
});  