
const fs = require('fs');
const { IamAuthenticator } = require('ibm-watson/auth');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const request = require('request');




const ParsingClient = require('sparql-http-client/ParsingClient')

const endpointUrl = "http://localhost:8890/sparql"

var mysql = require('mysql');
let listQueue=[];

  var kafka = require('kafka-node'),
  Producer = kafka.Producer,
  client = new kafka.KafkaClient(),
  producer = new Producer(client);
  Consumer = kafka.Consumer,
  consumer = new Consumer(
      client,
      [
          { topic: 'AudioTopic', partitions: 1 }
      ],
      {
          autoCommit: false
      }
  );


//Watson Config -------------------------------------------------------

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: 'APIKEY',
  }),
  serviceUrl: 'https://api.eu-gb.speech-to-text.watson.cloud.ibm.com/instances/0131a7ab-bd0a-4cd0-acb1-24f27856e745',
  disableSslVerification: true,
});


const params = {
  objectMode: true,
  contentType: 'audio/wav',
  model: 'pt-BR_BroadbandModel',
  maxAlternatives: 3,
};

//-----------------------------------------------------------
var isdone = true;
async function Function_B() {
  if(listQueue.length>0){
      isdone = false;
      var ss = listQueue.pop();

      // Stream and save it localy
      const recognizeStream = speechToText.recognizeUsingWebSocket(params);
      var r = request('http://localhost:2000/' + ss.fileName).pipe(fs.createWriteStream('song.wav'));
      r.on('finish', function(){
        fs.createReadStream('song.wav').pipe(recognizeStream);
        // Listen for events.
        recognizeStream.on('data', function(event) { onEvent('Data:', event); });
        recognizeStream.on('error', function(event) { onEvent('Error:', event); });
        recognizeStream.on('close', function(event) { onEvent('Close:', event); });
    
        // If detected words save it in DB
         async function onEvent(name, event) {
            if(name === "Data:"){
             if(event.results.length>0){
               var transcriptionTT =  event.results[0].alternatives[0].transcript
               for(var i = 1; i<event.results.length; i++){
                transcriptionTT += ". " +  (event.results[i].alternatives[0].transcript)
               }
                 var query =`PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>  
                prefix xsd: <http://www.w3.org/2001/XMLSchema#>
                insert data { 
                  GRAPH <meet_analyser>{`+
                  " <transcription_"+ ss.fileName + ">" + "  a meet:Transcription . " +
                  " <transcription_"+ ss.fileName + ">" +  ' meet:transcription_text \"'+ transcriptionTT +'\" .'+
                  " <"+ ss.fileName + ">" +  " meet:hasTranscription <transcription_"+ ss.fileName + "> ." +
                  " <transcription_"+ ss.fileName + ">" +  " meet:service \"Watson\" ."+
                  " <transcription_"+ ss.fileName + ">" +  " meet:confidance "+event.results[0].alternatives[0].confidence + " .}}"
          
                  const client = new ParsingClient({ endpointUrl })
                  console.log(query)
                 const bindings  = await client.query.select(query)
              
                isdone = true;
                console.log("finnish")
                Function_B();

             }else{
              var query =`PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>  
              prefix xsd: <http://www.w3.org/2001/XMLSchema#>
              insert data { 
                GRAPH <meet_analyser>{`+
                " <transcription_"+ ss.fileName + ">" + "  a meet:Transcription . " +
                " <transcription_"+ ss.fileName + ">" +  ' meet:transcription_text \"'+ "No Text Detected" +'\" .'+
                " <"+ ss.fileName + ">" +  " meet:hasTranscription <transcription_"+ ss.fileName + "> ." +
                " <transcription_"+ ss.fileName + ">" +  " meet:service \"Watson\" ."+
                " <transcription_"+ ss.fileName + ">" +  " meet:confidance "+ 0.0 + " .}}"
        
                const client = new ParsingClient({ endpointUrl })
                console.log(query)
                const bindings  = await client.query.select(query)
              isdone = true;
              console.log("finnish")
              Function_B();
             }

            }else if(name === "Error:"){
              Function_B();
            }
          };
  
      });
      }else{
        return ;
      }
    }  


  consumer.on('message', async function (message) {
    var s = message.value.split("__");
    console.log(s);
    var aux = s[0].slice(0,-5).substring(2).split("_");
    listQueue.push ({meetID : aux[0], user: aux[1], timeStamp: aux[2], fileName:s[1]}) ;
    if(listQueue.length==1  && isdone){
      Function_B();
    }
  });


