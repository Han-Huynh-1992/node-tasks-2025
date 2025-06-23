let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let dbConfig = require('./config/mysqlDBConnection');
let toDoController = require('./api/controller/todoController');
let authController = require('./api/controller/authController');
let cookieParser = require('cookie-parser');

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'Key123';

let app = express();
const port = process.env.port || 3000;

app.use('/assets', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cookieParser());

dbConfig.sync({ alter: true }).then(() => {
    console.log("MySQL DB synced");
}).catch(err => {
    console.error("Failed to connect to MySQL:", err);
});

app.get('/', (req, res) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        jwt.verify(token, SECRET_KEY); // If good condition, continue
        res.render('index');
    } catch (err) {
        return res.redirect('/login'); // If error, return login page
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/logout', (req, res) => {
    res.clearCookie('token'); // Clear token in cookie
    res.redirect('/login');
});

authController(app);
toDoController(app);

app.listen(port, () => {
    console.log("Server is listening on port: " + port);
});