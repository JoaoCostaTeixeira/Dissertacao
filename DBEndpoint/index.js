
const express = require('express')
const app = express();
const ParsingClient = require('sparql-http-client/ParsingClient')
const endpointUrl = "http://localhost:8890/sparql"

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.get("/getNextMeetings", async (req, res, next) => {
    var query = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
    select * from <meet_analyser> where {
       ?meeting a meet:Meeting;
           meet:hasAdmin <`+req.query.i+`>;
           meet:description ?desc;
           meet:time_stamp ?time.
    
    }order by ASC(?time )`
    
    const client = new ParsingClient({ endpointUrl })
    const bindings  = await client.query.select(query)
    var bb = false;
  
    var rows = [];
    var s =  new Date().getTime();
    bindings.forEach(row => {
      bb = true
      if(parseInt(Object.entries(row)[2][1].value )-s>-100  ){
        rows.push({meeting:  Object.entries(row)[0][1].value , 
          desc: Object.entries(row)[1][1].value,
          active:1,
          timeStamp: parseInt(Object.entries(row)[2][1].value),
        })
      } 
    })

    var query2 = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
    select * from <meet_analyser> where {
       ?meeting a meet:Meeting;
           meet:hasParticipant <`+req.query.i+`>;
           meet:description ?desc;
           meet:time_stamp ?time.
    
    }order by ASC(?time )`
    
    const client2 = new ParsingClient({ endpointUrl })
    const bindings2  = await client2.query.select(query2)


    bindings2.forEach(row => {
      if(parseInt(Object.entries(row)[2][1].value )-s>-100  ){
        bb=true;
        rows.push({meeting:  Object.entries(row)[0][1].value , 
          desc: Object.entries(row)[1][1].value,
          active:1,
          timeStamp: parseInt(Object.entries(row)[2][1].value),
        })
      } 
    })

    rows.sort(compare);

    if(rows.length>3){
      rows.splice(3,rows.length-1)
    }
   //s rows.splice(0,2)
    res.json({valid : bb,data: rows})
  
});

  app.get("/getTranscriptions", async(req, res, next) => {
  
    var query = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>  
    select * from <meet_analyser> { ?a a meet:Audio;
                                         meet:hasMeeting <`+req.query.i+`>;
                                         meet:hasUser ?user;
                                         meet:time_stamp ?time;
                                         meet:hasStatistics ?statistic_id;
                                         meet:hasTranscription ?transcription_id.
    
                                ?transcription_id a meet:Transcription;
                                        meet:transcription_text ?text ;
                                        meet:service ?service;
                                        meet:confidance ?conf.
    
                                 ?user a meet:User;
                                        meet:name ?name ;
                                        meet:foto ?foto.

                                 ?statistic_id a meet:Statistics;
                                        meet:mood_of_speech ?mood;
                                        meet:genre ?genre.

    } order by desc(?time)`
     
    const client = new ParsingClient({ endpointUrl })
    const bindings  = await client.query.select(query)
    var bb = false;
   
    var rows = [];
  
    bindings.forEach(row => {
    bb = true
    rows.push({id:  Object.entries(row)[0][1].value , 
      user: Object.entries(row)[1][1].value,
      timeStamp: Object.entries(row)[2][1].value,
      stats_id : Object.entries(row)[3][1].value,
      transcription_id: Object.entries(row)[4][1].value,
      transcription_text: Object.entries(row)[5][1].value,
      service: Object.entries(row)[6][1].value,
      confidence: Object.entries(row)[7][1].value,
      name: Object.entries(row)[8][1].value,
      foto: Object.entries(row)[9][1].value,
      mood: Object.entries(row)[10][1].value,
      genre : Object.entries(row)[11][1].value,
    })
     
    })
  
    res.json({valid : bb, data: rows})
  });


  function compare( a, b ) {
    if ( a.timeStamp < b.timeStamp ){
      return -1;
    }
    if ( a.timeStamp > b.timeStamp ){
      return 1;
    }
    return 0;
  }
  


console.log("Running 3011");
app.listen(3011)

