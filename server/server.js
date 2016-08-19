const Hapi = require('hapi');
const Good = require('good');
const Basic = require('hapi-auth-basic');
const Bcrypt = require('bcrypt');
const path = require('path');
const Boom = require('boom');
const Hoek = require('hoek');
const Util = require('./util');
const Vision = require('vision');

const server = new Hapi.Server();
const util = new Util();

server.connection({ port: 3000 });

const users = {
    hapi: {
        username: 'hapi',
        password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm', // 'secret'
        name: 'Hapi Guy',
        id: '2133d32a'
    }
};

const validate = function (request, username, password, callback) {
    server.log(['info'], 'Validating ' + username);
    const user = users[username];
    if (!user) {
        return callback(null, false);
    }

    Bcrypt.compare(password, user.password, (err, isValid) => {
        callback(err, isValid, { id: user.id, name: user.name });
    });
};

server.register(Basic, (err) => {
    if (err) {
        throw err;
    }

    server.auth.strategy('simple', 'basic', 'required', {
        validateFunc: validate
    });

    server.route({
        method: 'GET',
        path: '/{name}',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                server.log(['info'], 'Saying hello to ' + request.params.name);
                reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
            }
        }
    });
});

server.route({
    method: 'GET',
    path: '/',
    config: {
        auth: false,
        handler: function (request, reply) {
            //throw new Error('Big Error');
            //var message = 'Error: Not Implemented error.';
            //util.logError(server, request, message, Hoek.displayStack());
            //reply(Boom.notImplemented('Not Implemented.'));
            reply('Hello, World!');
        }
    }
});

server.register(require('inert'), (err) => {
    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/hello',
        handler: function (request, reply) {
            reply.file('./public/hello.html');
        }
    });
});

server.register({
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ response: '*', log: '*' }]
            }, {
                module: 'good-console'
            }, 'stdout'],
            file: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ error: '*', log: 'error' }]
            }, {
                module: 'good-squeeze',
                name: 'SafeJson',
            }, {
                module: path.join(__dirname, './good-human.js'),
                args: ['./error.log']
            }]
        }
    }
}, (err) => {
    if (err) {
        throw err;
    }

    server.start((err) => {
        if (err) {
            throw err;
        }

        server.log(['info'], 'Server running at: ' + server.info.uri);
    });
});
