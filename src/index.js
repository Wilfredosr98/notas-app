const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');


// incializaciones 
const app = express();
require('./database')
require('./config/passport');

// configuraciones 
app.set('port', process.env.PORT || 4000 );
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', exphbs({
	defaultlayout:'main',
	layoutsDir:path.join(app.get('views'), 'layouts'),
	partialsDir:path.join(app.get('views'), 'partials'),
	extname:'.html'
}));
app.set("view engine", ".html");

// peticiones 
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
	session({
		secret: "secret",
		resave: true,
		saveUninitialized: true,

	})
	);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//variables globales 
app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	res.locals.user = req.user || null;
	next();
});
//routes 
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));


//static files
app.use(express.static(path.join(__dirname, 'public')))

// servidor escuchando 

app.listen(app.get('port'), () => {
	console.log('servidor conectado in port', app.get('port'))
});