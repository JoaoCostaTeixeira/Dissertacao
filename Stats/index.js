/*

Author : João Teixeira



*/



const express = require('express')
const app = express()
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


app.get("/getAllStatsUser", async (req, res, next) => {
  var query = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
  select ?rate ?artrate ?speak ?nsyla ?meet from <meet_analyser> where {
      ?audio a meet:Audio;
            meet:hasMeeting ?meet;
            meet:hasStatistics ?stats;
            meet:hasUser <`+ req.query.i +`>.
  
      ?stats a meet:Statistics;
             meet:rate_of_speech ?rate;
             meet:speaking_duration ?speak;
             meet:articulation_rate ?artrate;
             meet:number_of_syllables ?nsyla.
  
  }order by (?meet)`
  
  const client = new ParsingClient({ endpointUrl })
  const bindings  = await client.query.select(query)
  var bb = false;

  var rows = [];
  var artrate = [];
  bindings.forEach(row => {
    bb = true
    artrate.push(parseInt(Object.entries(row)[1][1].value));

    rows.push({rate:  Object.entries(row)[0][1].value , 
      speak: parseFloat(Object.entries(row)[2][1].value),
      nsyla : parseInt(Object.entries(row)[3][1].value),
      meet : Object.entries(row)[4][1].value,
    })
  })


  var aux = rows[0].meet;
  var speak = [];
  var nsyla = [];
  var sum2 = 0;
  var sum = 0;
  var count = 0;
  for(var i = 0; i< rows.length; i++){

    if(rows[i].meet != aux){
      aux = rows[i].meet;
      speak.push(sum/count);
      nsyla.push(sum2/count);
      count = 0;
      sum = 0;
      sum2 = 0;
    }
      count++;
      sum += rows[i].speak;
      sum2 += rows[i].nsyla;
    
  }



  var output = {
    artrate: (artrate.reduce((a, b) =>a + b, 0)/artrate.length),
    speak_duration: (speak.reduce((a, b) =>a + b, 0)/speak.length),
    number_of_sylables: (nsyla.reduce((a, b) =>a + b, 0)/nsyla.length),
  }


  var query2 = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
  select ?rate ?artrate ?speak ?nsyla ?meet from <meet_analyser> where {
      ?audio a meet:Audio;
            meet:hasMeeting ?meet;
            meet:hasStatistics ?stats. 
  
      ?stats a meet:Statistics;
             meet:rate_of_speech ?rate;
             meet:speaking_duration ?speak;
             meet:articulation_rate ?artrate;
             meet:number_of_syllables ?nsyla.
  
  }order by (?meet)`
  
  const client2 = new ParsingClient({ endpointUrl })
  const bindings2  = await client2.query.select(query2)
  var bb = false;

  var rows = [];
  var artrate = [];
  bindings2.forEach(row => {
    bb = true
    artrate.push(parseInt(Object.entries(row)[1][1].value));

    rows.push({rate:  Object.entries(row)[0][1].value , 
      speak: parseFloat(Object.entries(row)[2][1].value),
      nsyla : parseInt(Object.entries(row)[3][1].value),
      meet : Object.entries(row)[4][1].value,
    })
  })


  var aux = rows[0].meet;
  var speak = [];
  var nsyla = [];
  var sum2 = 0;
  var sum = 0;
  var count = 0;
  for(var i = 0; i< rows.length; i++){

    if(rows[i].meet != aux){
      aux = rows[i].meet;
      speak.push(sum/count);
      nsyla.push(sum2/count);
      count = 0;
      sum = 0;
      sum2 = 0;
    }
      count++;
      sum += rows[i].speak;
      sum2 += rows[i].nsyla;
    
  }



  var output2 = {
    artrate: (artrate.reduce((a, b) =>a + b, 0)/artrate.length),
    speak_duration: (speak.reduce((a, b) =>a + b, 0)/speak.length),
    number_of_sylables: (nsyla.reduce((a, b) =>a + b, 0)/nsyla.length),
  }
  

  var query3 = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
  select * from <meet_analyser>  where {

     ?meeting a meet:Meeting.
         OPTIONAL {   ?meeting  meet:hasAdmin <`+ req.query.i +`>;  meet:description ?desc.}.
         OPTIONAL {   ?meeting  meet:hasParticipant <`+ req.query.i +`>.}.

  } `
  
  const client3 = new ParsingClient({ endpointUrl })
  const bindings3  = await client3.query.select(query3)

  var sum = 0;
  bindings3.forEach(row => {
    if(Object.entries(row).length>1){
      sum = sum+1;
    }

  })

  

  res.json({valid : bb,geral:output2, user: output, totalMeetings:bindings3.length, creator:sum });
});


/*

data1:
Returns data ready to use in Line Graph in the dashboard;
Speaking time trough the meeting


data2:
Returns data ready to use in a dugnut in the dashboard
Speaking time total by participant
*/
app.get("/getSpeechTimeTroughLength", async (req, res, next) => {
  var query = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
  select ?audio ?stats ?user ?tm ?speak ?name ?tt from <meet_analyser> where {
      ?audio a meet:Audio;
            meet:hasMeeting <`+req.query.i+`>;
            meet:hasStatistics ?stats;
            meet:hasTranscription ?tt;
            meet:hasUser ?user;
            meet:time_stamp ?tm.
  
      ?stats a meet:Statistics;
             meet:speaking_duration ?speak.

        ?user a meet:User;
              meet:name ?name.
  
  }order by (?tm)
  `
  const client = new ParsingClient({ endpointUrl })
  const bindings  = await client.query.select(query)

  var users = [],
      names = [],
       data = [], 
       labels = [],
       count1 = [],
       count2 = 0;
  
  bindings.forEach(row => {
    if(!users.includes(Object.entries(row)[2][1].value)){
      users.push(Object.entries(row)[2][1].value)
      names.push(Object.entries(row)[5][1].value)
    }
  })

  for(var i = 0; i<users.length; i++){
    data.push([0])
  }


  bindings.forEach(row => {
    if( parseFloat(Object.entries(row)[4][1].value) !=0){
      var newLabel = false;
      if(!labels.includes(parseInt(Object.entries(row)[3][1].value))){
        labels.push("" + parseInt(Object.entries(row)[3][1].value));
        count1.push(""+count2);
        count2++;
        newLabel = true;
      }
  
      if(newLabel && labels.length>1){
        for(var i = 0;i < users.length; i++ ){
            if(users[i] == Object.entries(row)[2][1].value){
              data[i].push(data[i][data[i].length-1] + parseFloat(Object.entries(row)[4][1].value))
            }else{
              data[i].push(data[i][data[i].length-1])
            }
        }
      }else{
        for(var i = 0;i < users.length; i++ ){
          if(users[i] == Object.entries(row)[2][1].value){
            data[i][data[i].length-1]=(data[i][data[i].length-1] + parseFloat(Object.entries(row)[4][1].value))
          }else{
            data[i][data[i].length-1]=(data[i][data[i].length-1])
          }
      }
      }
    }
   
  })
  
  var datasets = [];
  var datasets2data = [];
  var datasets2backgroundColor = [];
  var datasets2borderColor = [];
  for(var i = 0; i<users.length; i++){
    var o = Math.round, r = Math.random, s = 255;
    var r1 = o(r()*s),
      r2 = o(r()*s),
      r3 = o(r()*s);
    datasets.push({label: names[i], data:data[i], fill:false, backgroundColor: 'rgb(' + r1 + ',' + r2 + ',' +r3+ ')', borderColor: 'rgba(' + r1 + ',' + r2 + ',' + r3 + ', 1'  + ')'})
    
    datasets2data.push(data[i][data[i].length-1])
    datasets2backgroundColor.push('rgba(' + r1 + ',' + r2 + ',' + r3 + ', 0.4'  + ')')
    datasets2borderColor.push('rgba(' + r1 + ',' + r2 + ',' + r3 + ', 1'  + ')')
  }

 
  
  
  const data3 = {
    labels: names,
    datasets: [
      {
        label: 'Speech Time',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: datasets2backgroundColor,
        borderColor: datasets2borderColor,
        borderWidth: 1,
      },
    ],
  };


  res.json(
    {
      data : {
        labels : count1, 
        datasets: datasets
      },  
    data2:
    {
      labels: names,
      datasets: [
        {
          label: 'Speech Time',
          data:datasets2data,
          backgroundColor: datasets2backgroundColor,
          borderColor: datasets2borderColor,
          borderWidth: 1,
        },
      ],
   },
  })

});



app.get("/getRatingGraph", async (req, res, next) => {
  var query = ` PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
  select * from <meet_analyser> where {
      ?audio a meet:Audio;
            meet:hasMeeting <`+req.query.i+`>;
            meet:hasStatistics ?stats;
            meet:hasTranscription ?transc;
            meet:hasUser ?user.
  
      ?stats a meet:Statistics;
             meet:speaking_duration ?speak;
             meet:balance ?balance;
             meet:articulation_rate  ?artrate;
             meet:number_of_pauses  ?pauses;
             meet:rate_of_speech    ?ratespee;
             meet:number_of_syllables ?ns;
             meet:original_duration  ?ori.
  

        ?user a meet:User;
              meet:name ?name.
  

        ?transc a meet:Transcription;
              meet:confidance ?conf.


  }order by (?user)

  `
  const client = new ParsingClient({ endpointUrl })
  const bindings  = await client.query.select(query)

  var users = [],
      names = [],
      speech = [],
      balance = [],
      artrate = [], 
      pauses = [],
      conf = [],
      rateSpeech = [],
      nsyl = [],
      oridurantion = [];

  bindings.forEach(row => {
    if(!users.includes(parseInt(Object.entries(row)[3][1].value)) && parseInt(Object.entries(row)[4][1].value)!=0 ){
      users.push(parseInt(Object.entries(row)[3][1].value))
      names.push(Object.entries(row)[11][1].value)
      speech.push(parseFloat(Object.entries(row)[4][1].value))
      pauses.push(parseFloat(Object.entries(row)[7][1].value))
      balance.push([parseFloat(Object.entries(row)[5][1].value)])
      artrate.push([parseFloat(Object.entries(row)[6][1].value)])
      rateSpeech.push([parseFloat(Object.entries(row)[8][1].value)])
      nsyl.push([parseFloat(Object.entries(row)[9][1].value)])
      oridurantion.push([parseFloat(Object.entries(row)[10][1].value)])
      conf.push([parseFloat(Object.entries(row)[12][1].value)])
      
    }else if(parseInt(Object.entries(row)[4][1].value)!=0){
      speech[users.indexOf(parseInt(Object.entries(row)[3][1].value))] = speech[users.indexOf(parseInt(Object.entries(row)[3][1].value))] + parseFloat(Object.entries(row)[4][1].value);
      pauses[users.indexOf(parseInt(Object.entries(row)[3][1].value))] = pauses[users.indexOf(parseInt(Object.entries(row)[3][1].value))] + parseFloat(Object.entries(row)[7][1].value);
     
      rateSpeech[users.indexOf(parseInt(Object.entries(row)[3][1].value))].push(parseFloat(Object.entries(row)[8][1].value))
      nsyl[users.indexOf(parseInt(Object.entries(row)[3][1].value))].push(parseFloat(Object.entries(row)[9][1].value))
      oridurantion[users.indexOf(parseInt(Object.entries(row)[3][1].value))].push(parseFloat(Object.entries(row)[10][1].value))
      balance[users.indexOf(parseInt(Object.entries(row)[3][1].value))].push(parseFloat(Object.entries(row)[5][1].value))
      artrate[users.indexOf(parseInt(Object.entries(row)[3][1].value))].push(parseFloat(Object.entries(row)[6][1].value))
      if(parseFloat(Object.entries(row)[12][1].value)!=0){
        conf[users.indexOf(parseInt(Object.entries(row)[3][1].value))].push(parseFloat(Object.entries(row)[12][1].value))
      }
    }
  })


  var balancemedusers = [];
  var artratemedusers = [];
  var confmedusers = [];
  var sapeechratemedusers = [];
  var nsylmedusers = [];
  var oritimemedusers = [];

  for(var i = 0; i<balance.length; i++){
    balancemedusers.push(balance[i].reduce((a, b) => a + b, 0)/balance[i].length)
    artratemedusers.push(artrate[i].reduce((a, b) => a + b, 0)/artrate[i].length)
    confmedusers.push(conf[i].reduce((a, b) => a + b, 0)/conf[i].length)
    sapeechratemedusers.push(rateSpeech[i].reduce((a, b) => a + b, 0)/rateSpeech[i].length)

    nsylmedusers.push(nsyl[i].reduce((a, b) => a + b, 0)/nsyl[i].length)
    oritimemedusers.push(oridurantion[i].reduce((a, b) => a + b, 0)/oridurantion[i].length)
  }

  var normalspeech = (speech.reduce((a, b) => a + b, 0)/speech.length),
     normalbalance = (balancemedusers.reduce((a, b) => a + b, 0)/balancemedusers.length),
     normalartrate = (artratemedusers.reduce((a, b) => a + b, 0)/artratemedusers.length),
     normalpauses = (pauses.reduce((a, b) => a + b, 0)/pauses.length),
     normalconf = (confmedusers.reduce((a, b) => a + b, 0)/confmedusers.length),
     normalrateSpeech = (sapeechratemedusers.reduce((a, b) => a + b, 0)/sapeechratemedusers.length)
     normalsyl = (nsylmedusers.reduce((a, b) => a + b, 0)/nsylmedusers.length),
     normaloridur = (oritimemedusers.reduce((a, b) => a + b, 0)/oritimemedusers.length);
  var dataset = [];

  var o = Math.round, r = Math.random, s = 255;
  var r1 = o(r()*s),
    r2 = o(r()*s),
    r3 = o(r()*s);

  dataset.push({
    label: "Meeting",
    data:[100, 100, 100, 100, 100, 100,100,100],
    backgroundColor: 'rgba(' + r1 + ',' + r2 + ',' + r3 + ', 0.4'  + ')',
    borderColor: 'rgba(' + r1 + ',' + r2 + ',' + r3 + ', 1'  + ')',
    borderWidth: 1,
  })

  for(var i = 0; i<names.length; i++){
     r1 = o(r()*s),
      r2 = o(r()*s),
      r3 = o(r()*s);
      dataset.push({
        label: names[i],
        data:[(speech[i] * 100 / normalspeech), (balancemedusers[i]*100/normalbalance ), (artratemedusers[i]*100/normalartrate), (pauses[i] * 100 / normalpauses), (confmedusers[i]*100/normalconf), (sapeechratemedusers[i]*100/normalrateSpeech),(nsylmedusers[i]*100/normalsyl), (oritimemedusers[i]*100/normaloridur)],
        backgroundColor: 'rgba(' + r1 + ',' + r2 + ',' + r3 + ', 0.4'  + ')',
        borderColor: 'rgba(' + r1 + ',' + r2 + ',' + r3 + ', 1'  + ')',
        borderWidth: 1,
      })
  }   




  res.json(
    {
      data:
    {
      labels:  ['Speaking Time', 'Balance', "Articulation Rate", "Number of Pauses", "Transcription Conf.", "Rate of Speech", "Number of Syllables", "Intervation Time"],
      datasets: dataset
   },
  })

});



app.get("/getAllStats", async (req, res, next) => {
  var query = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
  select ?rate ?artrate ?speak ?nsyla ?meet from <meet_analyser> where {
      ?audio a meet:Audio;
            meet:hasMeeting ?meet;
            meet:hasStatistics ?stats. 
  
      ?stats a meet:Statistics;
             meet:rate_of_speech ?rate;
             meet:speaking_duration ?speak;
             meet:articulation_rate ?artrate;
             meet:number_of_syllables ?nsyla.
  
  }order by (?meet)`
  
  const client = new ParsingClient({ endpointUrl })
  const bindings  = await client.query.select(query)
  var bb = false;

  var rows = [];
  var artrate = [];
  var speak = [];
  var nsyla = [];
  bindings.forEach(row => {
    bb = true
    speak.push(parseFloat(Object.entries(row)[2][1].value))
    artrate.push(parseInt(Object.entries(row)[1][1].value))
    nsyla.push(parseInt(Object.entries(row)[3][1].value))
  })

  var query2 = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
              select ?active ?meet from <meet_analyser> where {
                  ?meet a meet:Meeting;
                          meet:active ?active.
                        
              }`
  
  const client2 = new ParsingClient({ endpointUrl })
  const bindings2  = await client2.query.select(query2)

  var num_of_meetings_active = 0;
  var num_of_meetings_inactive = 0;
  bindings2.forEach(row => {
    if( Object.entries(row)[0][1].value == 0){
      num_of_meetings_inactive++;
    }else{
      num_of_meetings_active++;
    }
  })


  var output = {
    artrate: (artrate.reduce((a, b) =>a + b, 0)/artrate.length),
    speak_duration_mean: (speak.reduce((a, b) =>a + b, 0)/speak.length),
    speak_duration_total: (speak.reduce((a, b) =>a + b, 0)),
    number_of_sylables_mean: (nsyla.reduce((a, b) =>a + b, 0)/nsyla.length),
    number_of_sylables_total: (nsyla.reduce((a, b) =>a + b, 0)),
    total_number_of_audios_analysed : artrate.length,
    total_number_of_meetings_created : num_of_meetings_active + num_of_meetings_inactive,
    number_of_meetings_active : num_of_meetings_active,
    number_of_meeting_inactive : num_of_meetings_inactive,
  }

  res.json({valid : bb, data: output});
});


app.get("/getMeetingStats1", async (req, res, next) => {

  var query2 = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>  
  select SUM(?ori) SUM(?speech) COUNT(?speech) from <meet_analyser> { 

             ?audio a meet:Audio;
                    meet:hasStatistics ?stats;
                    meet:hasTranscription ?text;
                    meet:hasMeeting  <`+req.query.i+`>.

             ?stats a meet:Statistics;
                      meet:original_duration ?ori;
                      meet:speaking_duration ?speech.
  }`
  const client2 = new ParsingClient({ endpointUrl })
    const bindings2  = await client2.query.select(query2)
    var bb = false;
    var totalTime,
        totalSpeech,
        totalFiles;
    bindings2.forEach(row => {
      bb = true;
      totalTime = Object.entries(row)[0][1].value;
      totalSpeech = Object.entries(row)[1][1].value;
      totalFiles = Object.entries(row)[2][1].value;
    })

    res.json({valid : bb, totalTime : totalTime,totalSpeech: totalSpeech,
      totalFiles: totalFiles})
});

app.get("/getMeetingTime", async (req, res, next) => {

  var query2 = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>  
  select ?tm from <meet_analyser> { 

             ?audio a meet:Audio;
                    meet:time_stamp ?tm;
                    meet:hasMeeting  <`+req.query.i+`>.

            } order by (?tm)`

  const client2 = new ParsingClient({ endpointUrl })
    const bindings2  = await client2.query.select(query2)
    var bb = false;
    var tm=[]

    bindings2.forEach(row => {
      bb = true;
      tm.push(parseInt(Object.entries(row)[0][1].value))
    })

    var finalmin = 0;
    var finalsec = 0;
    if(bb){
      finalmin = Math.floor((tm[tm.length-1]-tm[0])/1000/60);
    }


    res.json({valid : bb, finalmin:finalmin})
});

app.get("/getMeetingUserSimpleStats", async (req, res, next) => {

  //GET ALL USERS AND ADMIN
  var query = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>  
  select * from <meet_analyser> { 
          <`+req.query.i+`> a meet:Meeting;
                  meet:hasAdmin ?admin;
                  meet:hasParticipant ?participant.

          
                  ?admin a meet:User;
                  meet:name ?name;
                  meet:foto ?foto.
  
                ?participant a meet:User;
                  meet:name ?namep;
                  meet:foto ?fotop.
             
  }order by (?user)`

  const client = new ParsingClient({ endpointUrl })
  const bindings  = await client.query.select(query)
  var bb = false;

    var Admin = {
      id:0,
      name:"",
      foto:"",
      mood:[],
      rate:[],
      timeTotal:0,
      timeSpeech:0
    }

    var user = [];
    bindings.forEach(row => {
      bb = true;
      if(Admin.id == 0 ){
        Admin.id = parseInt(Object.entries(row)[0][1].value);
        Admin.name = Object.entries(row)[2][1].value;
        Admin.foto = Object.entries(row)[3][1].value;
      }
      if(Admin.id!=parseInt(Object.entries(row)[1][1].value)){
        user.push(
          {
            id:parseInt(Object.entries(row)[1][1].value),
            name:Object.entries(row)[4][1].value,
            foto:Object.entries(row)[5][1].value,
            mood:[],
            rate:[],
            timeTotal:0,
            timeSpeech:0
          }
        )
      }
      
      
    })
//--------------------------------------------------------------------------------------------------------

  var query2 = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>  
  select ?user ?ori ?speech ?mood ?rate from <meet_analyser> { 

             ?audio a meet:Audio;
                    meet:hasStatistics ?stats;
                    meet:hasUser ?user;
                    meet:hasTranscription ?text;
                    meet:hasMeeting   <`+req.query.i+`>.

             ?stats a meet:Statistics;
                      meet:rate_of_speech ?rate;
                      meet:mood_of_speech ?mood;
                      meet:original_duration ?ori;
                      meet:speaking_duration ?speech
             
  }order by (?user)`

  const client2 = new ParsingClient({ endpointUrl })
  const bindings2  = await client2.query.select(query2)


    bindings2.forEach(row => {
      var usrid= parseInt(Object.entries(row)[0][1].value);
      if(Admin.id==usrid && Object.entries(row)[3][1].value!= "Not Detected"){
        Admin.timeTotal = Admin.timeTotal + parseFloat(Object.entries(row)[1][1].value);
        Admin.timeSpeech = Admin.timeSpeech + parseFloat(Object.entries(row)[2][1].value);
        Admin.mood.push(Object.entries(row)[3][1].value);
        Admin.rate.push(parseFloat(Object.entries(row)[4][1].value));
      }else{
        for(var i=0; i<user.length; i++){
          if(user[i].id==usrid  && Object.entries(row)[3][1].value!= "Not Detected" ){
            user[i].timeTotal = user[i].timeTotal + parseFloat(Object.entries(row)[1][1].value);
            user[i].timeSpeech = user[i].timeSpeech + parseFloat(Object.entries(row)[2][1].value);
            user[i].mood.push(Object.entries(row)[3][1].value);
            user[i].rate.push(parseFloat(Object.entries(row)[4][1].value));
          }
        }
      }
    })

    Admin.mood = mode(Admin.mood);
    Admin.rate = Admin.rate.reduce((a, b) => a + b, 0)/Admin.rate.length
    //Info ready to use in graphs
    var partici = ["Meeting Average",Admin.name];

    var speech2 = [Admin.timeSpeech]
    var total2  = [Admin.timeTotal]
    var speech3 = [0, Admin.timeSpeech];
    var total3 = [0, Admin.timeTotal];

    var rate2 = [Admin.rate];
    var rate3 = [0, Admin.rate];


    for(var i=0; i<user.length; i++){
        user[i].mood = mode(user[i].mood);
        user[i].rate = user[i].rate.reduce((a, b) => a + b, 0)/user[i].rate.length

        partici.push(user[i].name);
        speech2.push(user[i].timeSpeech)
        total2.push(user[i].timeTotal)
        speech3.push(user[i].timeSpeech)
        total3.push(user[i].timeTotal)

        rate2.push(user[i].rate)
        rate3.push(user[i].rate)
    }

    speech3[0] = speech2.reduce((a, b) => a + b, 0)/speech2.length;
    total3[0] = total2.reduce((a, b) => a + b, 0)/total2.length;
    rate3[0] = rate2.reduce((a, b) => a + b, 0)/rate2.length;




    res.json({valid : bb,partArray:partici, totalSpeech:total3, speech:speech3, rate:rate3,admin : Admin,participants: user})
});



app.get("/getMeetingConfidence", async (req, res, next) => {

  var query2 = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>  
  select ?conf ?tt ?mood from <meet_analyser> { 

             ?audio a meet:Audio;
                    meet:hasStatistics ?stats;
                    meet:hasTranscription ?text;
                    meet:hasMeeting  <`+req.query.i+`>.

              ?stats a meet:Statistics;
                    meet:mood_of_speech ?mood.

              ?text a meet:Transcription;
                    meet:transcription_text ?tt;
                    meet:confidance ?conf.
  }`

   const client2 = new ParsingClient({ endpointUrl })
    const bindings2  = await client2.query.select(query2)
    var bb = false;
    var conf=[],
      mood = [];

    bindings2.forEach(row => {
      bb = true;
      if(Object.entries(row)[1][1].value != "No Text Detected"){
        conf.push(parseFloat(Object.entries(row)[0][1].value))
      }

      if(Object.entries(row)[2][1].value != "Not Detected"){
        mood.push(Object.entries(row)[2][1].value)
      }
    })

    res.json({valid : bb, conf : conf.reduce((a, b) => a + b, 0)/conf.length,  mood: mode(mood)})
});


app.get("/getStatistics", async (req, res, next) => {

      var query2 = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>  
      select * from <meet_analyser> { 

                 <`+req.query.i+`> a meet:Meeting;
                              meet:hasAdmin ?admin;
                              meet:hasParticipant ?part.

                              ?admin a meet:User;
                              meet:name ?adname.
     
                     ?part a meet:User;
                              meet:name ?pname.
      } `

      var d = new Map();
      const client2 = new ParsingClient({ endpointUrl })
      const bindings2  = await client2.query.select(query2)
      var ids = [];

      bindings2.forEach(row => {
        if(!d.has( Object.entries(row)[0][1].value)){
            d.set( Object.entries(row)[0][1].value, {
              confidence : [],
              mood :  [],
              rateofspeech : [],
              speak_duration : [],
              articulation : [],
              name :Object.entries(row)[2][1].value,
              number_of_sylables : [],
            })
            ids.push(Object.entries(row)[0][1].value)
        }
      
        if(!d.has( Object.entries(row)[1][1].value)){
          d.set( Object.entries(row)[1][1].value, {
            confidence : [],
            mood :  [],
            rateofspeech : [],
            speak_duration : [],
            articulation : [],
            name :Object.entries(row)[3][1].value,
            number_of_sylables : [],
          })
          ids.push(Object.entries(row)[1][1].value)
      }
           
      
      })



        var query = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>  
        select * from <meet_analyser> { ?a a meet:Audio;
                                            meet:hasMeeting <`+req.query.i+`>;
                                            meet:hasUser ?user;
                                            meet:time_stamp ?time;
                                            meet:hasStatistics ?statistic_id;
                                            meet:hasTranscription ?transcription_id.
        
                                    ?transcription_id a meet:Transcription;
                                            meet:confidance ?conf.

                                    ?statistic_id a meet:Statistics;
                                            meet:mood_of_speech ?mood;
                                            meet:genre ?genre;
                                            meet:rate_of_speech ?rate;
                                            meet:speaking_duration ?speak;
                                            meet:articulation_rate ?artrate;
                                            meet:number_of_syllables ?nsyla.
                                    
                                      ?user a meet:User;
                                          meet:name ?name.

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
            confidence: Object.entries(row)[5][1].value,
            mood: Object.entries(row)[6][1].value,
            genre : Object.entries(row)[7][1].value,
            rate : Object.entries(row)[8][1].value,
            speak_duration : Object.entries(row)[9][1].value,
            articulation : Object.entries(row)[10][1].value,
            number_of_sylables : Object.entries(row)[11][1].value,
            name : Object.entries(row)[12][1].value,
          })
        
        })


      

        rows.map((data) => {
          if(d.has(data.user)){
            var q = d.get(data.user);
            q.confidence.push(parseFloat(data.confidence))
            q.mood.push(data.mood)
            q.rateofspeech.push(parseInt(data.rate))
            q.speak_duration.push(parseFloat(data.speak_duration))
            q.articulation.push(parseInt(data.articulation))
            q.number_of_sylables.push(parseInt(data.number_of_sylables))
          }else{
            d.set(data.user, {
              confidence : [parseFloat(data.confidence)],
              mood :  [data.mood],
              rateofspeech : [parseInt(data.rate)],
              speak_duration : [parseFloat(data.speak_duration)],
              articulation : [parseInt(data.articulation)],
              name : data.name,
              number_of_sylables : [parseInt(data.number_of_sylables)],
            })
            ids.push(data.user)
          }
        })

        var output = [];
        ids.map((id)=>{
          var value = d.get(id);

          output.push({
            id : id,
            name: value.name,
            confidence : (value.confidence.reduce((a, b) => a + b, 0)/value.confidence.length),
            speak_duration: value.speak_duration.reduce((a, b) => a + b, 0),
            number_of_sylables: value.number_of_sylables.reduce((a, b) => a + b, 0),
            articulation: (value.articulation.reduce((a, b) => a + b, 0)/value.articulation.length),
            rateofspeech: (value.rateofspeech.reduce((a, b) => a + b, 0)/value.rateofspeech.length),
            mood : mode(value.mood)
          })
        })

        var geralconfidence = [];
        var geralspeak_duration = [];
        var geralnumber_of_sylables = [];
        var geralarticulation = [];
        var geralrateofspeech = [];
        var geralmood = [];
        output.map((id)=>{
          geralconfidence.push(id.confidence)
          geralspeak_duration.push(id.speak_duration)
          geralnumber_of_sylables.push(id.number_of_sylables)
          geralarticulation.push(id.articulation)  
          geralrateofspeech.push(id.rateofspeech)  
          geralmood.push( id.mood)
        })   
        res.json({valid : bb,
          geral: { 
              confidence: (geralconfidence.reduce((a, b) => a + b, 0)/geralconfidence.length),
              speek_durationTotal : geralspeak_duration.reduce((a, b) => a + b, 0),
              speek_durationMean : ( geralspeak_duration.reduce((a, b) => a + b, 0)/ geralspeak_duration.length),
              number_of_sylablesTotal: geralnumber_of_sylables.reduce((a, b) => a + b, 0),
              number_of_sylablesMean : ( geralnumber_of_sylables.reduce((a, b) => a + b, 0)/ geralnumber_of_sylables.length),
              articulation: (geralarticulation.reduce((a, b) => a + b, 0)/geralarticulation.length),
              rateofspeech: (geralrateofspeech.reduce((a, b) => a + b, 0)/geralrateofspeech.length),
              mood : mode(geralmood)
          },
         individual: output})
  });

  function mode(array)
  {
      if(array.length == 0)
          return null;
      var modeMap = {};
      var maxEl = array[0], maxCount = 1;
      for(var i = 0; i < array.length; i++)
      {
          var el = array[i];
          if(modeMap[el] == null)
              modeMap[el] = 1;
          else
              modeMap[el]++;  
          if(modeMap[el] > maxCount)
          {
              maxEl = el;
              maxCount = modeMap[el];
          }
      }
      return maxEl;
  }

  app.get("/getMeetingTranscriptions", async (req, res, next) => {
    var query = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
    select * from <meet_analyser> where {
        ?audio a meet:Audio;
               meet:hasMeeting <`+req.query.i+ `>;
               meet:hasUser ?user;
               meet:time_stamp ?time;
               meet:hasTranscription ?transc.
  
     ?transc a meet:Transcription;
                meet:transcription_text ?text.
  
     ?user a meet:User;
             meet:name ?username;
             meet:foto ?userFoto.
    
    }order by ASC(?time )`
    
    const client = new ParsingClient({ endpointUrl })
    const bindings  = await client.query.select(query)
    var bb = false;
  
    var rows = [];
    var s =  new Date().getTime();
    bindings.forEach(row => {
      bb = true
      
        rows.push({
          audio:  Object.entries(row)[0][1].value , 
          user: Object.entries(row)[1][1].value,
          time: parseInt(Object.entries(row)[2][1].value),
          transc:Object.entries(row)[3][1].value,
          text: Object.entries(row)[4][1].value,
          username: Object.entries(row)[5][1].value,
          userFoto: Object.entries(row)[6][1].value,
        })
      
    })



    var query2 = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
    select * from <meet_analyser> where {
  
       <`+req.query.i+ `> a meet:Meeting;
           meet:hasAdmin ?admin;
           meet:description ?desc.
           OPTIONAL {   <`+req.query.i+ `>  meet:hasParticipant ?part.

            ?part a meet:User;
                           meet:name ?username;
                            meet:foto ?userFoto. }.
            
  
      ?admin a meet:User;
               meet:name ?adminName;
               meet:foto ?adminFoto.
    
    }`
    
    const client2 = new ParsingClient({ endpointUrl })
    const bindings2  = await client2.query.select(query2)

    var output = {
      admin : {
        name: "",
        id: 0,
        foto: "",
      },
      participants : [],
      meeting: "",
    }

    bindings2.forEach(row => {
      if(Object.entries(row)[3][0] == 'adminFoto'){
        output.admin.id = Object.entries(row)[0][1].value;
        output.meeting = Object.entries(row)[1][1].value;
        output.admin.name = Object.entries(row)[2][1].value;
        output.admin.foto = Object.entries(row)[3][1].value;
      }else{
        output.admin.id = Object.entries(row)[0][1].value;
        output.meeting = Object.entries(row)[1][1].value;
        output.admin.name = Object.entries(row)[5][1].value;
        output.admin.foto = Object.entries(row)[6][1].value;
          output.participants.push({
            name:  Object.entries(row)[3][1].value,
            id: Object.entries(row)[2][1].value,
            foto: Object.entries(row)[4][1].value,
          })
      }
    })

   //s rows.splice(0,2)
    res.json({valid : bb, data: rows, data2: output})
  
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

app.listen(3020)
console.log("statistics running on port 3020!");
