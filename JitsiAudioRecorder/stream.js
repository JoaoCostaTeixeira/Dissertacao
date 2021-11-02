//Stream Audio From Local Uploads file

var http = require('http'),
    fs   = require('fs');
   
http.createServer(function(request, response) {
    var filePath = 'uploads/' + request.url.substring(1);
    try {
        if (fs.existsSync(filePath)) {
            var stat = fs.statSync(filePath);
            response.writeHead(200, {
                'Content-Type': 'audio/wav',
                'Content-Length': stat.size
            });
        
            fs.createReadStream(filePath).pipe(response);
        }
      } catch(err) {
        console.error(err)
      }
   
})
.listen(2000);