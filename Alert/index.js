/*
MSc Virtual Assistant for Mediating Meetings

Alert System

GitHub: https://github.com/JoaoCostaTeixeira/Dissertacao
Author : João Emanuel da Costa Teixeira

*/

//Packages used
const app = require('express')();
const http = require('http').Server(app);
var io = require('socket.io')(http);
const axios = require('axios');
const express = require('express')
const ParsingClient = require('sparql-http-client/ParsingClient')

//Sparql Endpoint
const endpointUrl = "http://localhost:8890/sparql"


// Add headers
app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data
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

var notificationMap = new Map();
var meetingsOngoing = [];


// When user connects sends all notification stored

io.on("connection", function(socket){
    socket.on('user', function(data) {
        if(notificationMap.has(data)){
            notificationMap.get(data).map((d)=>io.emit( ""+data, JSON.stringify(d)))
        }
    })
})


// Normal Values -------------------------------------------

var confidence = 0.4;
var confidenceAlert = true;


var speechDuration = 120;
var speechDurationAlert = true;


var speechDurationNotSpeackingByTime = 120;
var speechDurationNotSpeackingByTimeAlert = true;
var speechDurationNotSpeackingByIntervation = 3;
var speechDurationNotSpeackingByIntervationAlert = true;



// Alerts Configuration Page -------------------------------

app.get('/', function(req, res){
    res.send(`

    
    <body>
    <h1>Alerts Configuration </h1>
    <hr>
    <form method='post' action='/save'>
    <h3 id="valBox" ><input type="checkbox"  name="confidenceAlert" ` +(confidenceAlert? "checked":"")+ `>Transcription Confidance `+ confidence+ `</h3>
    <input type="range" min="1" max="100" value="`+confidence*100+`" class="slider" name="myRange"   oninput="showVal(this.value/100)" onchange="showVal(this.value/100)">
    </br>
    <hr>
    <h3 id="valBox2" ><input type="checkbox"  name="speechDurationAlert" ` +(speechDurationAlert? "checked":"")+ `>Speech Duration (in seconds)</h3>
    <h4>Limit time that each user can intervine</h4>
    <input type="number" value="`+speechDuration+`" class="slider" name="myRange2" ">
    </br>
    <hr>
    <h3 id="valBox3" >Didn't Intervine yet</h3>
    <h4 id="valBox3" ><input type="checkbox"  name="speechDurationNotSpeackingByTimeAlert" ` +(speechDurationNotSpeackingByTimeAlert? "checked":"")+ `>By Speech Duration (in seconds)</h4>
    <input type="number" value="`+speechDurationNotSpeackingByTime+`" class="slider" name="myRange3" ">
    </br>
    <h4 id="valBox3" ><input type="checkbox"  name="speechDurationNotSpeackingByIntervationAlert" ` +(speechDurationNotSpeackingByIntervationAlert? "checked":"")+ `>By Number of Intervations</h4>
    <input type="number" value="`+speechDurationNotSpeackingByIntervation+`" class="slider" name="myRange4" ">
    </br>
    </br>
    <hr>
    <button style="width:100px; background-color:#66ff99"  type='submit'>Save</butaton>
    </form> 

    <script>
    function showVal(newVal){
        document.getElementById("valBox").innerHTML="Confidence: " + newVal;
        console.log(newVal)a
    }
    </script>
    </body>`)
})
app.post('/save',function(req,res){
    confidence = req.body.myRange/100;
    (req.body.confidenceAlert? confidenceAlert = true :confidenceAlert = false)

    speechDuration = req.body.myRange2;
    (req.body.speechDurationAlert? speechDurationAlert = true :speechDurationAlert = false)


    res.send(`<!DOCTYPE html>
    <html>
    <body>
    
    <h1> SAVED </h1>
    
   
    </body>
    </html>
    
`)
});

//-------------------------------------------------------------

app.get('/aboutToStart', async function(req, res){
    var query =`PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
    select * from <meet_analyser> where {
        <`+req.query.i+`> a meet:Meeting;
             meet:hasParticipant ?user.
    }`

    const client = new ParsingClient({ endpointUrl })
    const bindings  = await client.query.select(query)
    
    var b1 = false;
    var notId = Math.floor(Math.random() * (6000) + 1000) ;
    bindings.forEach(row => {
      b1 = true;

      if(notificationMap.has(Object.entries(row)[0][1].value)){
          var aux = notificationMap.get(Object.entries(row)[0][1].value);
          aux.push({type: "meetAboutoStart",id:req.query.i ,message: "Meeting " + req.query.i + " is about to start!!", notid :notId})
      }else{
          notificationMap.set(Object.entries(row)[0][1].value,[{type: "meetAboutoStart",id:req.query.i ,message: "Meeting " + req.query.i + " is about to start!!", notid :notId}])
      }
      io.emit( ""+Object.entries(row)[0][1].value, JSON.stringify({type: "meetAboutoStart",id:req.query.i ,message: "Meeting " + req.query.i + " is about to start!!", notid :notId}))
      
    })

    if(notificationMap.has(2)){
        var aux = notificationMap.get(2);
        aux.push({type: "meetAboutoStart",id:req.query.i ,message: "Meeting " + req.query.i + " is about to start!!", notid :notId})
    }else{
        notificationMap.set(2,[{type: "meetAboutoStart",id:req.query.i ,message: "Meeting " + req.query.i + " is about to start!!", notid :notId}])
    }
    io.emit( ""+2, JSON.stringify({type: "meetAboutoStart",id:req.query.i ,message: "Meeting " + req.query.i + " is about to start!!", notid :notId}))
    


    res.json({valid:b1})
})


app.get('/hasEnded', async function(req, res){
    var query =`PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
    select * from <meet_analyser> where {
        <`+req.query.i+`> a meet:Meeting;
             meet:hasParticipant ?user.
    }`
      
    const client = new ParsingClient({ endpointUrl })
    const bindings  = await client.query.select(query)
    
    var b1 = false;
    var notId = Math.floor(Math.random() * (6000) + 1000) ;
    bindings.forEach(row => {
      b1 = true;

      if(notificationMap.has(Object.entries(row)[0][1].value)){
          var aux = notificationMap.get(Object.entries(row)[0][1].value);
          aux.push({type: "endedMeet",id:req.query.i ,message: "Meeting " + req.query.i + " has ended!!", notid :notId})
      }else{
          notificationMap.set(Object.entries(row)[0][1].value,[{type: "endedMeet",id:req.query.i ,message: "Meeting " + req.query.i + " has ended!!", notid :notId}])
      }
     // console.log(""+Object.entries(row)[0][1].value)
      io.emit( ""+Object.entries(row)[0][1].value, JSON.stringify({type: "endedMeet",id:req.query.i ,message: "Meeting " + req.query.i + " has ended!!", notid :notId}))
    })
    
    for(var i=0; i<meetingsOngoing.length;i++){

        if(meetingsOngoing[i]===req.query.i){
            meetingsOngoing.splice(i, 1);
        }
    }


    
    res.json({valid:b1})
})

app.get('/hasStarted', async function(req, res){
    var query =`PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
    select * from <meet_analyser> where {
        <`+req.query.i+`> a meet:Meeting;
             meet:hasParticipant ?user.
    }`
      
    const client = new ParsingClient({ endpointUrl })
    const bindings  = await client.query.select(query)
    
    var b1 = false;
    var notId = Math.floor(Math.random() * (6000) + 1000) ;
    bindings.forEach(row => {
      b1 = true;

      if(notificationMap.has(Object.entries(row)[0][1].value)){
          var aux = notificationMap.get(Object.entries(row)[0][1].value);
          aux.push({type: "meetStartes",id:req.query.i ,message: "Meeting " + req.query.i + " has started!!", notid :notId})
      }else{
          notificationMap.set(Object.entries(row)[0][1].value,[{type: "meetStartes",id:req.query.i ,message: "Meeting " + req.query.i + " has started!!", notid :notId}])
      }
   
      io.emit( ""+Object.entries(row)[0][1].value, JSON.stringify({type: "meetStartes",id:req.query.i ,message: "Meeting " + req.query.i + " has started!!", notid :notId}))
    })
    meetingsOngoing.push(req.query.i)
    res.json({valid:b1})
})


// Removes any notification --------------
app.get('/removeNotification', function(req, res){
    var noti = notificationMap.get(req.query.i);
    for(var i=0; i<noti.length;i++){
        if(noti[i].notid==parseInt(req.query.data)){
            noti.splice(i, 1);
        }
    }
    notificationMap.set(req.query.id, noti);

    res.json({valid:1})
})
//-------------------------------------


//Confidence Alert ------------------------
setInterval(function(){ 
    if(confidenceAlert){
        for(var i = 0; i<meetingsOngoing.length; i++){


            axios.get('http://localhost:3020/getStatistics?i=' + meetingsOngoing[i])
            .then(response =>{
                var data = response.data;
                if(data.valid){
                    if(data.geral.confidence<0.6){     
                        var notId = Math.floor(Math.random() * (6000) + 1000) ;
                        for(var i = 0; i<data.individual.length;i++){
                            var d=data.individual[i];
                            if(notificationMap.has(d.id)){
                                var aux = notificationMap.get(d.id);
                                aux.push({type: "confidence",id: meetingsOngoing[i] ,message: "Meeting " +  meetingsOngoing[i] + " has low transcription confidence!!", notid :notId})
                            }else{
                                notificationMap.set(d.id,[{type: "confidence",id: meetingsOngoing[i] ,message: "Meeting " +  meetingsOngoing[i] + " has low transcription confidence!!", notid :notId}])
                            }
                            io.emit( ""+d.id, JSON.stringify({type: "confidence",id: meetingsOngoing[i] ,message: "Meeting " +  meetingsOngoing[i] + "  has low transcription confidence!!", notid :notId}))
                        }
                    }
                  }
            })
          }        
    }
 
},10000)
//-------------------------------------


//Speech time Alert ------------------------
setInterval(async function(){ 
    if(speechDurationAlert){
        for(var i = 0; i<meetingsOngoing.length; i++){

            var query =`PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
            SELECT  ?user FROM <meet_analyser> where {
                ?audio a meet:Audio;
                    meet:hasMeeting  <${meetingsOngoing[i]}>;
                    meet:hasStatistics ?stats;
                    meet:hasUser ?user.
            
                ?stats a meet:Statistics;
                    meet:speaking_duration ?speech.
             
            }  GROUP BY ?user HAVING (SUM(?speech) > 2)`
              
        const client = new ParsingClient({ endpointUrl })
        const bindings  = await client.query.select(query)

        bindings.forEach(row => {
            b1 = true;
            var notId = Math.floor(Math.random() * (6000) + 1000) ;

            if(notificationMap.has(Object.entries(row)[0][1].value)){
                var aux = notificationMap.get(Object.entries(row)[0][1].value);
                aux.push({type: "confidence",id: meetingsOngoing[i] ,message: "User " +  Object.entries(row)[0][1].value + "  has exceed is speech time!!", notid :notId})
            }else{
                notificationMap.set(Object.entries(row)[0][1].value,[{type: "confidence",id: meetingsOngoing[i] ,message:"User " +  Object.entries(row)[0][1].value + "  has exceed is speech time!!", notid :notId}])
            }

            io.emit( ""+Object.entries(row)[0][1].value, JSON.stringify({type: "confidence",id: meetingsOngoing[i] ,message: "User " +  Object.entries(row)[0][1].value + "  has exceed is speech time!!", notid :notId}))
    
        });
    } 
   
}

},10000)

                    
                
          
//-------------------------------------



http.listen(4000, function(){
    console.log('listening on port 4000')
})