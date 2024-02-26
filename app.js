var express = require('express');
var path = require('path');
require('dotenv').config()
const cors = require('cors');

var indexRouter = require('./routes/index');
var pokemonRouter = require('./routes/pokemon');
const { swaggerSpec, swaggerUi } = require('./swagger');

var app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET',
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());

app.use('/', indexRouter);
app.use('/api/pokemon', pokemonRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
