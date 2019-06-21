var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Sequelize = require('sequelize');

http.listen(3000);

// init sqlite db
var fs = require('fs');
var dbFile = './.data/sqlites.db';
var exists = fs.existsSync(dbFile);

const db = new Sequelize({
  dialect: 'sqlite',
  storage: dbFile,
  logging: false
});

db.authenticate();

const Messages = db.define('messagesList', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  nick: {
    type: Sequelize.STRING,
    allowNull: false
  },
  day: {
    type: Sequelize.STRING,
    allowNull: false
  },
  hour: {
    type: Sequelize.STRING,
    allowNull: false
  },
  mess: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

Messages.sync();

io.on('connection', function(socket){
  socket.on('new message', function(nick, day, hour, mess){
    Messages.count().then(num => {
    Messages.create({
      id: num,
      nick: nick,
      day: day,
      hour: hour,
      mess: mess
    });
    Messages.sync();
    io.emit('new message', nick, day, hour, mess);
    })
  });
});

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/getMessages', function(request, response) {
  Messages.findAll().then(mess => { response.send(mess) });
});

app.get('/delMess', (request, response) => {
  let params = request.query;
  if(params.id !== undefined){
    Messages.destroy({
      where: {
        id: params.id
      }
    }).then(() => response.send('Zrobione'));
  } else {
    response.send('Test')
  }
});

app.get('/sendMess', (request, response) => {
  let params = request.query;
  if(params.platform == 'pc'){
    response.redirect('./..');
  }
})