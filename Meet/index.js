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




app.get("/create",async (req, res, next) => {
    const client = new ParsingClient({ endpointUrl })
    var resultado           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 20; i++ ) {
      resultado += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    var query = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
                  select * from <meet_analyser> 
                  WHERE {
                        <`+resultado+`> a meet:Meeting;
                                  meet:description ?desc
                  
                  }`
    const bindings  = await client.query.select(query)
    
    var b1 = false;
  
    bindings.forEach(row => {
      b1 = true
    })

    if(!b1){
      var query =`PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>  
                    prefix xsd: <http://www.w3.org/2001/XMLSchema#>
                    insert data { 
                      GRAPH <meet_analyser>{`+
                  " <"+ resultado + ">" + "  a meet:Meeting . " +
                "  <"+ resultado + ">" +  ' meet:description \"'+ req.query.d +'\" .'+
                "  <"+ resultado + ">" +  " meet:time_stamp \""+req.query.t+"\" ."+
                "  <"+ resultado + ">" +  " meet:active  1 ."+
                "  <"+ resultado + ">" +  " meet:hasAdmin <"+req.query.i+"> .}}"
      
  
                console.log(query)           
      const bindings  = await client.query.select(query)
      res.json({valid : 1, name: resultado});
    }else{
      res.json({valid : 0});
    }

});


app.get("/getAllMeetingsActive", async(req, res, next) => {
  
     
  var query =`PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
                select * from <meet_analyser> 
                WHERE {
                      ?meeting a meet:Meeting;
                                meet:hasAdmin <`+  req.query.i+ `>;
                                meet:description ?description;
                                meet:time_stamp ?time_stamp;
                                meet:active 1
                      
                }  ORDER BY ASC(?time_stamp)`

  const client = new ParsingClient({ endpointUrl })
  const bindings  = await client.query.select(query)
  var bb = false;

  var rows = [];

  bindings.forEach(row => {
  bb = true
  rows.push({id: Object.entries(row)[0][1].value , desc: Object.entries(row)[1][1].value,  time_stamp: Object.entries(row)[2][1].value })

  })


  var query2 =`PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
                select * from <meet_analyser> 
                WHERE {
                      ?meeting a meet:Meeting;
                                meet:hasParticipant <`+  req.query.i+ `>;
                                meet:description ?description;
                                meet:time_stamp ?time_stamp;
                                meet:active 1
                      
                }  ORDER BY ASC(?time_stamp)`

  const bindings2  = await client.query.select(query2)
  var bb2 = false;

  var rows2 = [];

  bindings2.forEach(row => {
  bb2 = true
  rows2.push({id: Object.entries(row)[0][1].value , desc: Object.entries(row)[1][1].value,  time_stamp: Object.entries(row)[2][1].value })

  })
  res.json({valid : 1, id: rows, id2: rows2})
  });


  app.get("/getAllMeetingsEnded", async(req, res, next) => {
  
     
    var query =`PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
                  select * from <meet_analyser> 
                  WHERE {
                        ?meeting a meet:Meeting;
                                  meet:hasAdmin <`+  req.query.i+ `>;
                                  meet:description ?description;
                                  meet:time_stamp ?time_stamp;
                                  meet:active 0
                        
                  }  ORDER BY ASC(?time_stamp)`
  
    const client = new ParsingClient({ endpointUrl })
    const bindings  = await client.query.select(query)
    var bb = false;
  
    var rows = [];
  
    bindings.forEach(row => {
    bb = true
    rows.push({id: Object.entries(row)[0][1].value , desc: Object.entries(row)[1][1].value,  time_stamp: Object.entries(row)[2][1].value })
  
    })
  
  
    var query2 =`PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
                  select * from <meet_analyser> 
                  WHERE {
                        ?meeting a meet:Meeting;
                                  meet:hasParticipant <`+  req.query.i+ `>;
                                  meet:description ?description;
                                  meet:time_stamp ?time_stamp;
                                  meet:active 0
                        
                  }  ORDER BY ASC(?time_stamp)`
  
    const bindings2  = await client.query.select(query2)
    var bb2 = false;
  
    var rows2 = [];
  
    bindings2.forEach(row => {
    bb2 = true
    rows2.push({id: Object.entries(row)[0][1].value , desc: Object.entries(row)[1][1].value,  time_stamp: Object.entries(row)[2][1].value })
  
    })
    res.json({valid : 1, id: rows, id2: rows2})
    });
  
  
app.get("/getMeet", async(req, res, next) => {
  
  var query = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
  select * from <meet_analyser> 
  WHERE {
    <`+  req.query.i+ `> a meet:Meeting;
                  meet:description ?description;
                  meet:time_stamp ?time_stamp;
                  meet:active ?active
        
  }  ORDER BY ASC(?time_stamp)`
   
  const client = new ParsingClient({ endpointUrl })
  const bindings  = await client.query.select(query)
  var bb = false;
 
  var rows = [];

  bindings.forEach(row => {
  bb = true
  rows.push({id:  req.query.i , desc: Object.entries(row)[0][1].value,  time_stamp: Object.entries(row)[1][1].value, active: Object.entries(row)[2][1].value })

  })

  var query = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
  select * from <meet_analyser> 
  WHERE {
    <`+  req.query.i+ `>a meet:Meeting;
    meet:hasAdmin ?admin .

      ?admin a meet:User;
          meet:foto ?foto;
          meet:name ?name.
        
  } `

  var cc = false;
 
  var rows2 = [];
  const bindings2  = await client.query.select(query)
  bindings2.forEach(row => {
   cc = true
   rows2.push({id: Object.entries(row)[0][1].value , foto: Object.entries(row)[1][1].value,  name: Object.entries(row)[2][1].value})

  })

  
  var query = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
  select * from <meet_analyser> 
  WHERE {
    <`+  req.query.i+ `>a meet:Meeting;
    meet:hasParticipant ?admin .

      ?admin a meet:User;
          meet:foto ?foto;
          meet:name ?name.
        
  } `

  var cc1 = false;
 
  var rows3 = [];
  const bindings3  = await client.query.select(query)
  bindings3.forEach(row => {
   cc1 = true
   rows3.push({id: Object.entries(row)[0][1].value , foto: Object.entries(row)[1][1].value,  name: Object.entries(row)[2][1].value})

  })


  res.json({valid : 1, data: rows,participant: {valid:cc1, data:rows3}, admin: {valid:cc, data:rows2 }})
});


app.get("/addParticipant", async(req, res, next) => {
  
  var query = "PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#> " +
                "insert in graph <meet_analyser>"+
              " {<"+ req.query.id + ">" + "  meet:hasParticipant  <"+ req.query.i +">.}"
  console.log(query)
  const client = new ParsingClient({ endpointUrl })
  const bindings  = await client.query.select(query)
  res.json({valid : 1})
});

app.get("/searchParticipant", async(req, res, next) => {
  
  var query = " PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#> " +
                "select * from <meet_analyser> "+
                "WHERE {" +
                " <"+req.query.i +"> a meet:User;"+
                "  meet:name ?name;"+
                "  meet:email ?email;"+
                "  meet:foto ?foto."+
                " }";
   
  const client = new ParsingClient({ endpointUrl })
  const bindings  = await client.query.select(query)
  var bb = false;
 
  var rows = [];

  bindings.forEach(row => {
  bb = true
  rows.push({id:  req.query.i , name: Object.entries(row)[0][1].value,  email: Object.entries(row)[1][1].value, foto: Object.entries(row)[2][1].value })

  })

  res.json({valid : bb, data: rows})
});


var ongoing=false;
setInterval(async function(){ 
  if(!ongoing){
    console.log("hi")
    ongoing=true;
    var query = `
       PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
        select * from <meet_analyser> where {
           ?meet a meet:Meeting;
                 meet:active 1;
                 meet:time_stamp ?time.
        }`;

  const client = new ParsingClient({ endpointUrl })
  const bindings  = await client.query.select(query)

  var date = new Date().getTime();      
  bindings.forEach(async (row) => {
    console.log(Object.entries(row)[0][1].value)
      if(date-parseInt(Object.entries(row)[1][1].value)>86400){
        var query3 =`PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>  
                      DELETE FROM <meet_analyser> { <`+Object.entries(row)[0][1].value+`> meet:active   1 .}
                      INSERT { GRAPH <meet_analyser>{ <`+Object.entries(row)[0][1].value+`> meet:active 0 . }}`
        await client.query.select(query3)
      }
    })
    ongoing=false;
  }
  

},6000)



app.listen(3004)
console.log("Meet creator running on port 3004!");
