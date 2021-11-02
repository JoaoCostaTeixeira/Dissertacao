const fs = require('fs')
const express = require('express')
const app = express()

var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    client = new kafka.KafkaClient(),
    producer = new Producer(client);


    
const ParsingClient = require('sparql-http-client/ParsingClient')

const endpointUrl = "http://localhost:8890/sparql"

app.get("/",async (req, res, next) => {

   
        var users = req.query.users.split("-");
        
        var meeting = req.query.meeting;
        var result = [];
        for (var i = 0; i<users.length; i++){
            var d = false;
            var f = 0;
            while(!d){
                const path = '../Jitsi-Audio-Recorder/uploads/meetings/'+ meeting + '/' + f + "-" + users[i] + ".wav";
                try {
                   
                    if (fs.existsSync(path)) {
                        var query =`PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>  
                        prefix xsd: <http://www.w3.org/2001/XMLSchema#>
                        insert data { 
                            GRAPH <meet_analyser>{`+
                        " <"+ 'meetings/'+ meeting + '/' + f + "-" + users[i] + ".wav" + ">" + "  a meet:Audio . " +
                        "  <"+ 'meetings/'+ meeting + '/' + f + "-" + users[i] + ".wav" + ">" +  ' meet:time_stamp \"'+  new Date().getTime() +'\" .'+
                        "  <"+ 'meetings/'+ meeting + '/' + f + "-" + users[i] + ".wav" + ">" +  " meet:hasUser <"+  users[i] +"> ."+
                        "  <"+ 'meetings/'+ meeting + '/' + f + "-" + users[i] + ".wav" + ">" +  " meet:hasMeeting <"+ meeting +"> .}}"
            
                        const client = new ParsingClient({ endpointUrl })
                        console.log(query)           
                        const bindings  = await client.query.select(query)


                        payloads = [
                            { topic: 'AudioTopic', messages: meeting + '_' + users[i] + "_" +  new Date().getTime()  +"__"+'meetings/'+ meeting + '/' + f + "-" + users[i] + ".wav", partitions: 1 }
                        ];
                        producer.send(payloads, function (err, data) {
                            console.log(data);
                        });
                        result.push(meeting + '_' + users[i] + "_" + new Date().getTime()  +"__"+'meetings/'+ meeting + '/' + f + "-" + users[i] + ".wav")
                        f++;
                    }else{
                        d=true;
                    
                    }
                } catch(err) {
                    d=true;
                }
                
            }
        }
        res.json({res : result});

  });
  
  
app.get("/hasData", (req, res, next) => {

    var meeting = req.query.meeting;
    var hasmeet = false;
    console.log('../Jitsi-Audio-Recorder/uploads/meetings/'+ meeting)
    fs.access('../Jitsi-Audio-Recorder/uploads/meetings/'+ meeting, function(error) {
       
        if (error==null) {
            console.log("error1123")
            res.json({hasMeet : true});

        } else {
            console.log("error")
            res.json({hasMeet : false});

        }
      })

   
});
  
  app.listen(2055)