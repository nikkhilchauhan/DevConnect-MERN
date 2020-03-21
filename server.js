require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();

// Connecting to MongoDB Database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('MongoDB is Connected');
  })
  .catch(error => {
    console.log(error);
    // Exit process with failure
    process.exit(1);
  });

// Connection configuration
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('Server running on -> http://localhost:8000/');
});

// Init Middlewares
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));
app.get('/', (req, res) => {
  res.send("You're genius...");
});
