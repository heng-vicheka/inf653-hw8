const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

// Set up hbs as the view engine
app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
  res.render('home');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
