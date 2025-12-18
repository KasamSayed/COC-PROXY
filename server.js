const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

// Catch ALL requests to the root to prove the server is working
app.all('/', (req, res) => {
  res.send('<h1>PROXY IS LIVE</h1><p>If you see this, the server is finally configured correctly.</p>');
});

// Proxy route
app.get('/coc/*', async (req, res) => {
  const path = req.params[0];
  const url = `https://api.clashofclans.com/v1/${path}`;
  try {
    const response = await axios.get(url, {
      headers: { 'Authorization': req.headers.authorization }
    });
    res.json(response.data);
  } catch (e) {
    res.status(e.response?.status || 500).json(e.response?.data || {error: 'Proxy Error'});
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
