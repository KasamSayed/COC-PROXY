const express = require('express');
const axios = require('axios');
const app = express();

// Render provides the port in process.env.PORT
const PORT = process.env.PORT || 10000;

// 1. Home Page Test
app.get('/', (req, res) => {
  res.send('Proxy is online! If you see this, the 404 is fixed.');
});

// 2. The Proxy Route
app.get('/coc/*', async (req, res) => {
  try {
    const apiPath = req.params[0];
    const url = `https://api.clashofclans.com/v1/${apiPath}`;
    
    console.log(`Fetching: ${url}`);
    
    const response = await axios.get(url, {
      headers: { 
        'Authorization': req.headers.authorization,
        'Accept': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error("CoC API Error:", error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Proxy Error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
