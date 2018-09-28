//var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var request = require('request');
var http = require('https');
const watsonJsonParserObject = require('./WatsonJsonParser.js');

//Difing variables that connect to the Discover Watson services
let discoverUserName = '##########' // Put your discovery username here
let discoverPassword = '#######' //Put your discovery password here
let discoverenvoironmentID = '#######' // Put your discovery envoironment id here
let discovercollectionID = '#########' // Put your discovery collection id here


var auth = '########' //Put your authorization token form discovery here;
var watsonReturnedText;
//-----------------

//---Code for Watson - Discover services-- This does not work - Shame on IBM

// var discovery = new DiscoveryV1({
//   username: discoverUserName,
//   password: discoverPassword,
//   version_date:'2017-04-27'
// });
// //Query the Discover envoironment
// // discovery.query({"environment_id":discoverenvoironmentID, "collection_id":discovercollectionID,queryString},function(error, data) {
// //   console.log(error);
// //   console.log('The query returned from discovery=',JSON.stringify(data, null, 2));
// // });
// discovery.getCollections({"environment_id":discoverenvoironmentID}, function(error, data) {
//   console.log(JSON.stringify(data, null, 2));
// });

// // discovery.getEnvironments({}, function(error, data) {
// //   console.log(JSON.stringify(data, null, 2));
// // });
//---------------------------------------
function setDiscoveryQueryParameters(query,callreturn) {
    var queryParameter = encodeURI(query);
    requestWatsonDiscovery(queryParameter,function(result){
        console.log("The final solution =",result);
        callreturn(result);
    });
}
module.exports.setDiscoveryQueryParameters = setDiscoveryQueryParameters;



function requestWatsonDiscovery (queryString,callback){
console.log('Query =',queryString);
if(typeof queryString !== 'undefined'){
	var discoveryUrl = `/discovery/api/v1/environments/${discoverenvoironmentID}/collections/${discovercollectionID}/query?version=2016-11-07&query=${queryString}&count=&offset=&aggregation=&filter=&passages=true&highlight=true&return=`
	console.log('Total url =',discoveryUrl);
	var options = {
  		host: 'gateway.watsonplatform.net',
  		path: discoveryUrl,
  		auth : auth
			};

	http.get(options, function (http_res) {
    // initialize the container for our data
    var data = "";

    // this event fires many times, each time collecting another piece of the response
    http_res.on("data", function (chunk) {
        // append this chunk to our growing `data` var
        //console.log(data);
        data += chunk;

    });

    	// this event fires *one* time, after all the `data` events/chunks have been gathered
    	http_res.on("end", function () {
        // you can use res.send instead of console.log to output via express
        //console.log(data);
        data =JSON.parse(data);
        watsonReturnedText = watsonJsonParserObject.parseDiscoveryData(data); 
        callback(watsonReturnedText);  
    });
});

	}
}
module.exports.requestWatsonDiscovery = requestWatsonDiscovery;

// function returnResult() {
// 	//console.log('This is good news from discovery=',watsonReturnedText);
//  	return watsonReturnedText;

// }
// module.exports.returnResult = returnResult;
