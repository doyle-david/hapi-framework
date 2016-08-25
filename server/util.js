const os = require('os');

class Util {
    logError(server, request, message, stack, err) {
        if (err) {
            var errDetails = this._stringifyError(err, null, '\t');
            if (message) {
                message = message + '; ' + errDetails;
            } else {
                message = errDetails;
            }
        }

        server.log(['error'], 'timestamp: ' + new Date(Date.now()) +
            '\r\nid: ' + Date.now() + ':' + (process.env.COMPUTERNAME || os.hostname()) +
            '\r\nmethod: ' + request.method +
            '\r\npid: ' + process.pid +
            '\r\nerror: ' + message +
            '\r\n\tat ' + stack.join('\r\n\tat '));
    }

    getErrorDetails(err) {
        return err.details.map((detail) => {
            return detail.message;
        }).join('; ');
    }

    _stringifyError(err, filter, space) {
        var plainObject = {};
        Object.getOwnPropertyNames(err).forEach(function (key) {
            plainObject[key] = err[key];
        });
        return JSON.stringify(plainObject, filter, space);
    }
}

module.exports = Util;
