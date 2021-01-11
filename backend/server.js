const app = require('./app');
const debug = require('debug')('node-angular');
const http = require('http');

// make sure that when we try to spesify port we make sure is a valid number
const normalizePort = val => {
    var port = parseInt(val, 10);

    if(isNaN(port)){
        // named pipe
        return val;
    }

    if(port >= 0){
        // port number
        return port;
    }

    return false;
};

//which type of error occured
const onError = error => {
    if(error.syscall !== "listen") {
        throw error;
    }
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe" + addr : "port" +port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires evelated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in user");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe" + addr : "port" +port;
    debug("Listening on " + bind);
}

const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening)
server.listen(port);

