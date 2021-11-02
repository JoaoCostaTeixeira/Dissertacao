
const fs = require('fs');
const request = require('request');
const express = require('express')
const app = express();

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
  


//-----------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------



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

  consumer.on('message', function (message) {
    var s = message.value.split("__");
    const search = '/'  
    const replacer = new RegExp(search, 'g')

    console.log(s[1].replace(replacer, '-')) 

      var r = request('http://localhost:2000/' + s[1]).pipe(fs.createWriteStream( s[1].replace(replacer, '-') ));
      r.on('finish', function(){
       
        payloads = [
          { topic: 'AudioMyAnalyser2', messages: message.value}
        ];
        producer.send(payloads, function (err, data) {
            console.log(data);
        });
        
  });
  })



