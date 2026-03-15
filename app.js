const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const hbs = require('hbs');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

// Set up hbs as the view engine
app.engine(
  'hbs',
  exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Register partials
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// json parsing middleware
app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
    },
  })
);

// data
const users = {
  admin: {
    username: 'admin',
    password: 'password123',
    fullName: 'System Administrator',
    email: 'admin@university.edu',
    bio: 'Managing the campus network infrastructure.',
  },
  student_dev: {
    username: 'student_dev',
    password: 'dev_password',
    fullName: 'Jane Developer',
    email: 'jane.d@student.edu',
    bio: 'Full-stack enthusiast and coffee drinker.',
  },
};

// ENUMS for light and dark themes
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Define routes
app.get('/', (req, res) => {
  res.redirect(303, '/login');
});

// Login get route
app.get('/login', (req, res) => {
  res.render('login', { showThemeButton: false });
});

app.post('/login', express.urlencoded({ extended: true }), (req, res) => {
  const { email, password } = req.body;
  const user = Object.values(users).find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    req.session.user = user.username;
    res.redirect(303, '/profile');
  } else {
    res.render('login', {
      error: 'Invalid email or password',
      showThemeButton: false,
    });
  }
});

// profile route
app.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.redirect(303, '/login');
  }

  const userData = users[req.session.user];

  if (!userData) {
    return res.status(404).send('User not found');
  }

  res.render('profile', { user: userData, showThemeButton: true });
});

// toggle theme route
app.get('/toggle-theme', (req, res) => {
  const currentTheme = req.signedCookies.userTheme || THEMES.LIGHT;
  const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;

  res.cookie('userTheme', newTheme, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    signed: true,
  });

  res.json({ success: true, isDarkMode: newTheme === THEMES.DARK });
});

// logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.clearCookie('connect.sid');
    res.redirect(303, '/login');
  });
});

// 404
app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
