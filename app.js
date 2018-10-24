// REQUIRING NPM PACKAGES AND OTHER DEPENDENCIES
var express         = require('express'),
    passport        = require('passport'),
    Strategy        = require('passport-facebook').Strategy,
    GoogleStrategy  = require('passport-google-oauth').OAuth2Strategy;

// Passport Strategy for Facebook
 passport.use(new Strategy({
  clientID: "989094141294419",
  clientSecret: "449eac589952a6bd8cb45bb2a6e28fd1",
  callbackURL: "http://localhost:3000/login/facebook/callback"
}, async(accessToken, refreshToken, profile, done) => {
      try{
              console.log('profile', profile);
              console.log('accessToken', accessToken);
              console.log('refreshToken', refreshToken);
      } catch(error){
              done(error, false, error.message);
      }
      return done(null, profile);
}));

// Passport Strategy for Google
passport.use(new GoogleStrategy({
    clientID: "220371433582-eainlgha6u6n1nf9p1ssn11eipjl2d5i.apps.googleusercontent.com",
    clientSecret: "2hlZdWxghAfU9nFZMdpRuGOu",
    callbackURL: "http://localhost:3000/login/google/callback"
  }, async(accessToken, refreshToken, profile, done) => {
      try{
              console.log('profile', profile);
              console.log('accessToken', accessToken);
              console.log('refreshToken', refreshToken);
      } catch(error){
              done(error, false, error.message);
      }
      return done(null, profile);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.get('/login/facebook',
  passport.authenticate('facebook'));

app.get('/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/login/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/login/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

app.listen(3000);
