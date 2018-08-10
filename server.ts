const express = require('express'),
  path = require('path'),
  http = require('http'),
  app = express(),
  port = process.env.PORT || '4200',
  moment = require('moment'),
  fs = require('fs'),
  os = require('os'),
  Gpio = require('pigpio').Gpio;

app.use(express.static(path.join(__dirname, 'dist/ratalyzer-ui/')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/ratalyzer-ui/index.html'));
});

app.set('port', port);

const server = http.createServer(app),
  serverSocket = require('socket.io')(server);

server.listen(port, () => console.log(`API running on localhost:${port}`));

let testing = false,
  count = 0,
  fileName = '',
  startMoment,
  ratName = 'NoName',
  currentSocket,
  button = new Gpio(5, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.FALLING_EDGE
  });

serverSocket.on('connection', (socket) => {

  currentSocket = socket;

  console.log('GUI Connected');

  socket.emit('connected');

  socket.on('start', (ratNameFromClient) => {

    ratName = ratNameFromClient;
    testing = true;
    count = 0;
    fileName = os.hostname + '-' + ratName + '-' + moment().format('MM-DD-YYYY-hh-mm-ssa').toString() + '.csv';
    startMoment = moment();

    const data = {
      count: count,
      fileName: fileName
    };

    socket.emit('started', data);
  });

  socket.on('stop', () => {
    testing = false;
    socket.emit('stopped');
  });

});

function writeData() {
  const stream = fs.createWriteStream('/home/pi/Desktop/Data/' + fileName, {flags: 'a'}),
    now = moment();

  stream.write(now.format('MM-DD-YYYY-hh-mm-ssa').toString() + ','
    + now.diff(startMoment) + ',\n' );

  stream.end();
}

button.on('interrupt', function () {
  if (testing) {
    writeData();

    count++;

    currentSocket.emit('update', count);
  }
});
