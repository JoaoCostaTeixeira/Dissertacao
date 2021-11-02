start /min "Authentication" cd .\Authentication\ ^& nodemon index.js
start /min "Meet Creator" cd .\Meet_creator\ ^& nodemon index.js
start /min "Statistics"  cd .\Statistics\  ^& nodemon index.js
start /min "Front-end"   cd .\Front-end\dissertation\ ^& npm start
start /min "Alert"   cd .\Alert ^& nodemon index.js
start /min "Chat"   cd .\Alert ^& nodemon chat.js
start /min "dbend"   cd .\DataBaseEndpoint ^& nodemon index.js