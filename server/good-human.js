const GoodFile = require('good-file');

class GoodHuman extends GoodFile {
    _write(data, encoding, callback) {
        var parseData = JSON.parse(data.toString());
        super._write(new Buffer(
            'timestamp: ' + new Date(parseData.timestamp) + '\r\n' +
            'id: ' + parseData.id + '\r\n' +
            'method: ' + parseData.method + '\r\n' +
            'pid: ' + parseData.pid + '\r\n' +
            parseData.error.error + '\r\n' +
            parseData.error.stack + '\r\n'), encoding, callback);
    }
}

module.exports = GoodHuman;
