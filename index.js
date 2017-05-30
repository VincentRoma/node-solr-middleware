// Dependances
var express = require('express');
var requestify = require('requestify'); 

//Declarations
//var HOST = "http://solr-ip";
var HOST = "http://10.127.171.46";
//var PORT = 8989;
var PORT = 32792;
var solr = "solr"
var app = express();

var parse_params = function(params){
    var url = HOST + ":" + PORT + "/" + solr;
    if(params.collection && params.field && params.term){
         url = url + "/" + params.collection + "/select/"
        return url;
    }else{
        return null;
		//url = url +  "/" + params.collection + 
    }
};

var parse_options = function(params, options, url){
	var first = true;
	
	if(params.field && first){ url = url + "?q=" + params.field + ":"; first = false}
	if(!params.field && first){ url = url + "?q=*:"; first = false}
	
	if(params.term){ url = url + "*" + params.term + "*"; first = false} 
	if(params.prefix){ url = url + params.prefix + "*"; first = false}
    
	if(options.format && first){ url = url + "?wt=" + options.format; first = false}
	if(options.format && !first) url = url + "&wt=" + options.format;
    
	if(options.rows && first) { url = url + "?rows=" + options.rows; first = false}
	if(options.rows && !first) url = url + "&rows=" + options.rows;
    return url;
};

// API DEFINITION
app.get('/select/:collection/:field/:term', function (req, res) {
		completeselect(req)
    
});
app.get('/suggest/:collection/:field/:prefeix', function (req, res) {
	completeselect(req)
	
});
var completeselect = fonction(req) {
	var url = parse_params(req.params);
    url = parse_options(req.params, req.query, url);
    // Implement generic function to make Solr Rest calls
    if(url) {
		console.log(url);
		requestify.get(url).then(function(response) {
			// Get the response body
			res.send(response.getBody());
		});
		
	}
	//res.send(request("HOST:Port/select"+url));
	else res.sendStatus(500);
}




// RUN SERVEUR
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

