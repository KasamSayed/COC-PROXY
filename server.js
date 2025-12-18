const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

// This will show if the proxy is alive
app.get('/', (req, res) => res.send('PROXY IS LIVE'));

// This handles the CoC requests
app.get('/coc/*', async (req, res) => {
  const apiPath = req.params[0];
  const url = `https://api.clashofclans.com/v1/${apiPath}`;
  try {
    const response = await axios.get(url, {
      headers: { 'Authorization': req.headers.authorization }
    });
    res.json(response.data);
  } catch (e) {
    res.status(e.response?.status || 500).json(e.response?.data || {error: 'error'});
  }
});

app.listen(PORT, () => console.log('Listening on ' + PORT));
