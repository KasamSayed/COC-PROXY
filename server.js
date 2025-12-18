const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// This catch-all route handles everything after /coc/
app.get('/coc/*', async (req, res) => {
  try {
    const path = req.params[0];
    const url = `https://api.clashofclans.com/v1/${path}`;
    
    console.log(`Forwarding request to: ${url}`); // This shows in Render Logs
    
    const response = await axios.get(url, {
      headers: { 'Authorization': req.headers.authorization }
    });
    res.json(response.data);
  } catch (error) {
    console.error("Proxy Error:", error.message);
    res.status(error.response?.status || 500).json(error.response?.data || {error: 'Internal Error'});
  }
});

// Added a root route to stop the 404 on the main page
app.get('/', (req, res) => res.send('Proxy is online! Use /coc/ followed by your API path.'));

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
