function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function parseHistoricalData(data){
  var historicalConversationData;
  for(var exKey in data) {
    if(exKey == 'body'){
      var returnParsedText = JSON.parse(data[exKey]);
      var innerJsonStructure = returnParsedText['logs'];
      innerJsonStructure.map((data) => {
        var requestData = data['response']['input']['text'];
        var responseData = data['response']['output']['text'];
        if(typeof requestData != 'undefined' && typeof responseData != 'undefined')
         historicalConversationData = historicalConversationData + requestData 
                       + "::" + responseData + '\n'

      });
    }
  }
  if(typeof historicalConversationData !== 'undefined'){
    historicalConversationData = historicalConversationData.replace("undefined",'');
  }
  console.log("Debug log=",historicalConversationData);
  return historicalConversationData;
}
     
function parseDiscoveryData(data){
  var returnParsedText;
  for(var exKey in data) {
    if(exKey == 'results'){
       var insideJsonString = data[exKey]; //JSON.stringify(data[exKey]);
       insideJsonString.map((data) => {
          console.log(data['highlight']['text']);
          var highlightedText =  JSON.stringify(data['highlight']['text']);
          if(typeof highlightedText !== 'undefined'){
            highlightedText = highlightedText.substring(1, highlightedText.length-1);
            returnParsedText = returnParsedText + highlightedText ;
        }
       });
     }
  }
  if(typeof returnParsedText !== 'undefined'){
  returnParsedText = returnParsedText.replace(/(<em>|<\/em>)/g, "");
  returnParsedText = returnParsedText.replace(/[&\/\\#,+()$~%.'"*?<>{}]/g, '');
  returnParsedText = returnParsedText.replace("undefined",'');
}
  return returnParsedText;
}

module.exports.parseHistoricalData = parseHistoricalData;
module.exports.parseDiscoveryData = parseDiscoveryData;
