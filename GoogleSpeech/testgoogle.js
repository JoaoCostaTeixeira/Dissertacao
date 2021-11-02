// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const fs = require('fs');
const request = require('request');

const ParsingClient = require('sparql-http-client/ParsingClient')

const endpointUrl = "http://localhost:8890/sparql"

  var kafka = require('kafka-node'),
  Producer = kafka.Producer,
  client2 = new kafka.KafkaClient(),
  Consumer = kafka.Consumer,
  consumer = new Consumer(
      client2,
      [
          { topic: 'AudioTopic', partitions: 1 }
      ],
      {
          autoCommit: false
      }
  );

// Creates a client
const client = new speech.SpeechClient( {keyFilename: "ivory-choir-320313-e0c0710952d7.json"});

async function quickstart(ss) {
    var r = request('http://localhost:2000/' + ss.fileName).pipe(fs.createWriteStream(ss.fileName));
    r.on('finish', async function(){

                // The path to the remote LINEAR16 file
                const filename = ss.fileName;

                // The audio file's encoding, sample rate in hertz, and BCP-47 language code
                const audio = {
                    content: fs.readFileSync(filename).toString('base64'),
                };
                
                const config = {
                    encoding: 'LINEAR16',
                    languageCode: 'pt-PT',
                    audioChannelCount: 1

                };
                const request = {
                    audio: audio,
                    config: config,
                };

                // Detects speech in the audio file
                try{
                    const [response] = await client.recognize(request);
                    var query =`PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>  
                    prefix xsd: <http://www.w3.org/2001/XMLSchema#>
                    insert data { 
                    GRAPH <meet_analyser>{`+
                    " <transcription_"+ ss.fileName + ">" + "  a meet:Transcription . " +
                    " <transcription_"+ ss.fileName + ">" +  ' meet:transcription_text \"'+ response.results[0].alternatives[0].transcript +'\" .'+
                    " <"+ ss.fileName + ">" +  " meet:hasTranscription <transcription_"+ ss.fileName + "> ." +
                    " <transcription_"+ ss.fileName + ">" +  " meet:service \"Watson\" ."+
                    " <transcription_"+ ss.fileName + ">" +  " meet:confidance "+response.results[0].alternatives[0].confidence.toFixed(2) + " .}}"
                    const client3 = new ParsingClient({ endpointUrl })
                    const bindings  = await client3.query.select(query)
                    console.log(response.results[0].alternatives[0].transcript)
                    try {
                        fs.unlinkSync(ss.fileName)
                        //file removed
                      } catch  {
                        console.log("asd")
                      }

                }catch (err){
                    console.log(err)
                    var query =`PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>  
                    prefix xsd: <http://www.w3.org/2001/XMLSchema#>
                    insert data { 
                    GRAPH <meet_analyser>{`+
                    " <transcription_"+ ss.fileName + ">" + "  a meet:Transcription . " +
                    " <transcription_"+ ss.fileName + ">" +  ' meet:transcription_text \"'+ "No Text Detected" +'\" .'+
                    " <"+ ss.fileName + ">" +  " meet:hasTranscription <transcription_"+ ss.fileName + "> ." +
                    " <transcription_"+ ss.fileName + ">" +  " meet:service \"Google\" ."+
                    " <transcription_"+ ss.fileName + ">" +  " meet:confidance "+ 0.0 + " .}}"

                    const client3 = new ParsingClient({ endpointUrl })
                    console.log(query)
                    const bindings  = await client3.query.select(query)
                    try {
                        fs.unlinkSync(ss.fileName)
                        //file removed
                      } catch {
                        console.log("asd")
                      }
                }
    })
}



consumer.on('message', async function (message) {
    var s = message.value.split("__");
    var aux = s[0].slice(0,-5).substring(2).split("_");
    quickstart({meetID : aux[0], user: aux[1], timeStamp: aux[2], fileName:s[1]}) ;
});

