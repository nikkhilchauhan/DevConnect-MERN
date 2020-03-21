const express = require('express');
const app = express();

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send("You're genius");
});

app.listen(PORT, () => {
  console.log('Server running on -> http://localhost:8000/');
});
