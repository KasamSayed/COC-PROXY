const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Health Check (To see if the proxy is alive at all)
app.get('/', (req, res) => {
  res.send('Proxy is online! Use /coc/ followed by your path.');
});

// 2. The Main Proxy Logic
app.get('/coc/*', async (req, res) => {
  try {
    // Extract everything after /coc/
    const apiPath = req.params[0]; 
    const url = `https://api.clashofclans.com/v1/${apiPath}`;
    
    console.log(`Forwarding request to: ${url}`);
    
    const response = await axios.get(url, {
      headers: { 
        'Authorization': req.headers.authorization,
        'Accept': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching from CoC API:", error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Proxy Error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
