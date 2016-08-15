const Hapi = require('hapi');
const Good = require('good');
const Basic = require('hapi-auth-basic');
const Bcrypt = require('bcrypt');
const Vision = require('vision');

const server = new Hapi.Server();
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

    server.auth.strategy('simple', 'basic', {
        validateFunc: validate
    });

    server.route({
        method: 'GET',
        path: '/{name}',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
            }
        }
    });
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, World!');
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
                args: [{
                    response: '*',
                    log: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
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
