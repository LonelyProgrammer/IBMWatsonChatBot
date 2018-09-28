const Botkit = require('botkit');
const request = require('request');
const watsonDiscoveryObject  = require('./AlienBotDiscoverServices.js');
const mailSenderObject = require('./AlienBotMailSender.js');
const watsonJsonParserObject = require('./WatsonJsonParser.js');


var controller = Botkit.slackbot({ debug: false });
//Defining the variables that connects Watson - Conversation to slack
let watsonurl = 'https://gateway.watsonplatform.net/conversation/api/v1/workspaces/01eefcef-6d3d-40c9-bac1-58ce62e53ec7/message?version=2017-05-19'
let watsonHistoricalAnswerUrl = 'https://gateway.watsonplatform.net/conversation/api/v1/workspaces/01eefcef-6d3d-40c9-bac1-58ce62e53ec7/logs?version=2017-05-19'
let slackToken = 'xoxb-178496737680-99aDzqPp76UehYBMXkgWRNhv'

let workspaceuserName = '74a55457-4d03-4e86-95d0-3d774e11320c'
let workspacepassword ='ULxj0n5RwfgK'
var auth = "Basic " + new Buffer(workspaceuserName + ":" + workspacepassword).toString("base64");
var basicConfidenceRequired = 0.60;
//-------------------

var bot = controller.spawn({ token:slackToken }).startRTM();
 // Gets the first text from an array of potential responses.
function getResponseText(params) {
  for (i = 0; i < params.length; i++) {
    if (params[i]) return params[i];
  }
  return "";
}
// Calls the Watson Conversation service with provided request JSON.
// On response, calls the action function with response from Watson.
function callConversationService(json, action) {
  request({
    auth: {
      username: workspaceuserName,
      password: workspacepassword
    },
    method: 'post',
    json: true,
    url: watsonurl,
      headers: {
        'Content-Type': 'application/json'
      }
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        action(body);
      }
  }).end(json);
}

function getConversationHistory(){
  request(
    {
        url : watsonHistoricalAnswerUrl,
        headers : {
            "Authorization" : auth
        }
    },
  function (error, response, body) {
        // Do more stuff with 'body' here
        //console.log('The error is=',error);
        //console.log('STATUS: ' + response.statusCode);
                             response.setEncoding('utf8');
                             //This is the parse module
                             var historyData = watsonJsonParserObject.parseHistoricalData(response); 
                             //console.log("The entire conversation History is =",historyData);
                             mailSenderObject.sendMailFromAlienBot(historyData);
        });
}


// Register to listen for any user communication with bot.
controller.hears(
  '(.*)',
  ['direct_message'],
  function(bot, message) {      
    callConversationService('{}', function (resp) { 
      var conv_id = resp.context.conversation_id;
      var req_json = 
        '{\"input\":{\"text\":\"' + 
        message.match[1] + 
        '\"},\"context\":{\"conversation_id\":\"' + 
        conv_id + 
        '\",\"system\":{\"dialog_stack\":[\"root\"],\"dialog_turn_counter\": 1,\"dialog_request_counter\": 1}}}';
            
      callConversationService(req_json, function (resp2) {
        var txt = getResponseText(resp2.output.text);
        var result;
        if(txt.indexOf("not satisfied") >=0){
          //The user is not satisfied with the BOT performance,redirect him to a person
          bot.reply(message, "I am sorry. Let me redirect you to someone");
          var conversationHistory = getConversationHistory();
          //----------------

        }
        else if(txt == ""){
         result = watsonDiscoveryObject.setDiscoveryQueryParameters(message['text'],function(result){
          if(typeof result !== 'undefined')
              bot.reply(message, result);
            else{
                bot.reply(message, "I am sorry, I do not know anything about it. Let me redirect you to someone");
                //Call the conversation history service
                var conversationHistory = getConversationHistory();
            }
         });
         
          }
        else if(txt == "I'm sorry I haven't been able to help you."){
              //Call the conversation history service
              bot.reply(message, "I am sorry, I do not know anything about it. Let me redirect you to someone");
               var conversationHistory = getConversationHistory();
        }
        else{
          bot.reply(message, txt);
        }
        
      });
  });
});


