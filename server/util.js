class Util {
    logError(server, request, message, stack) {
        server.log(['error'], 'timestamp: ' + new Date(Date.now()) +
            '\r\nid: ' + Date.now() + ':' + process.env.COMPUTERNAME +
            '\r\nmethod: ' + request.method +
            '\r\npid: ' + process.pid +
            '\r\n' + message +
            '\r\n\tat ' + stack.join('\r\n\tat '));
    }
}

module.exports = Util;
