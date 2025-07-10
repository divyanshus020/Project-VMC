const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); // allow all origins (adjust for production)

app.get('/proxy/goldrate', async (req, res) => {
  try {
    const response = await axios.get('https://dwarikajewellers.com/liverate.aspx');
    res.send(response.data); // send raw HTML
  } catch (err) {
    res.status(500).send('Error fetching gold rate');
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Proxy running at http://localhost:${PORT}`));
