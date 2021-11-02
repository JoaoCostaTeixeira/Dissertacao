/* 

  AUTH IS DONE VIA FACEBOOK AUTH
  IF VALID THE USER WILL BE REGISTERED IN THE PLATFORM
  A UNIQUE ID IS CREATED


  DEVELOPED BY:JOÃO TEIXEIRA
  INSTITUTION: UNIVERSIDADE DE AVEIRO
  REPOSITORY:https://github.com/JoaoCostaTeixeira/Dissertacao

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



app.get("/verify", async (req, res, next) => {
  console.log(req.query.e)
  // VERIFIES IF USER IS ALREADY REGISTERED IN THE PLATFORM
  var query = " PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#> " +
              "select * from <meet_analyser> "+
              "WHERE {" +
              " ?a a meet:User;"+
              "  meet:name ?name;"+
              " meet:email \""+ req.query.e +"\";"+
              "  meet:foto ?foto."+
              " }";
  console.log(query)  
  const client = new ParsingClient({ endpointUrl })
  const bindings  = await client.query.select(query)
  var isRegistered = false;
  
  var id, foto;

  bindings.forEach(row => {
    isRegistered = true
    console.log("query3")
    id = parseInt(Object.entries(row)[0][1].value);
    foto = Object.entries(row)[2][1].value
    res.json({valid : 1, id: parseInt(Object.entries(row)[0][1].value)})
  })


  //ID generation 
  if(!isRegistered){
    var aux = false;
    console.log("ASDASD")
    while(!aux){
      var value = Math.floor(Math.random() * 999999);
      var query = ` PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>
                      select * from <meet_analyser> 
                      WHERE {
                            <`+ value+`> a meet:User;
                              meet:name ?name.
                      }` 
      const bindings  = await client.query.select(query)
      
      var isTaken = false;
    
      bindings.forEach(row => {
        isTaken = true
      })

      //Register user
      if(!isTaken){
        aux = true;
        var combining = /[\u0300-\u036F]/g; 
            var query = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>  
            prefix xsd: <http://www.w3.org/2001/XMLSchema#>
            insert data { 
                      GRAPH <meet_analyser>{`+
              "  <"+ value + ">" + "  a meet:User . " +
              "  <"+ value + ">" +  "  meet:name   \""+ req.query.n +"\" ." +
              "  <"+ value + ">" +  "  meet:email  \""+ req.query.e +"\" ." +
              "  <"+ value + ">" +  "  meet:foto   \""+ req.query.f.split("_f").join("&") + "\" . }}"
      console.log(query)
        const bindings  = await client.query.select(query)
        res.json({valid : 1, id: value})
      }
      
    }
}else{
    var query3 = `PREFIX meet: <http://www.semanticweb.org/joãoteixeira/ontologies/2021/4/meeting#>  
    DELETE FROM <meet_analyser> { <`+id+`> meet:foto   \"`+foto+`\" .}
    INSERT { GRAPH <meet_analyser>{ <`+id+`> meet:foto    \"`+req.query.f.split("_f").join("&")+`\" . }}`
   // console.log(query3)
    const bindings5  = await client.query.select(query3)
}

});

app.listen(3003)
console.log("Authentication running on port 3003.")
