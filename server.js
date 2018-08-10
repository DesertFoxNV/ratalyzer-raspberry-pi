var express = require('express'), path = require('path'), http = require('http'), app = express(), port = process.env.PORT || '4200', moment = require('moment'), fs = require('fs'), os = require('os'), Gpio = require('pigpio').Gpio;
app.use(express.static(path.join(__dirname, 'dist/ratalyzer-ui/')));
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist/ratalyzer-ui/index.html'));
});
app.set('port', port);
var server = http.createServer(app), serverSocket = require('socket.io')(server);
server.listen(port, function () { return console.log("API running on localhost:" + port); });
var testing = false, count = 0, fileName = '', startMoment, ratName = 'NoName', currentSocket, button = new Gpio(5, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.FALLING_EDGE
});
serverSocket.on('connection', function (socket) {
    currentSocket = socket;
    console.log('GUI Connected');
    socket.emit('connected');
    socket.on('start', function (ratNameFromClient) {
        ratName = ratNameFromClient;
        testing = true;
        count = 0;
        fileName = os.hostname + '-' + ratName + '-' + moment().format('MM-DD-YYYY-hh-mm-ssa').toString() + '.csv';
        startMoment = moment();
        var data = {
            count: count,
            fileName: fileName
        };
        socket.emit('started', data);
    });
    socket.on('stop', function () {
        testing = false;
        socket.emit('stopped');
    });
});
function writeData() {
    var stream = fs.createWriteStream('/home/pi/Desktop/Data/' + fileName, { flags: 'a' }), now = moment();
    stream.write(now.format('MM-DD-YYYY-hh-mm-ssa').toString() + ','
        + now.diff(startMoment) + ',\n');
    stream.end();
}
button.on('interrupt', function () {
    if (testing) {
        writeData();
        count++;
        currentSocket.emit('update', count);
    }
});
