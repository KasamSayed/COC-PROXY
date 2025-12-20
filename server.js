const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(async (req, res) => {
    // 1. Home page check
    if (req.path === '/') return res.send('PROXY IS LIVE');

    // 2. Forward EVERYTHING after the domain to Supercell
    // Example: /clans/%23TAG/currentwar -> https://api.clashofclans.com/v1/clans/%23TAG/currentwar
    const url = `https://api.clashofclans.com/v1${req.path}`;

    try {
        console.log(`Forwarding to: ${url}`);
        const response = await axios.get(url, {
            headers: { 'Authorization': req.headers.authorization }
        });
        res.json(response.data);
    } catch (e) {
        res.status(e.response?.status || 500).json(e.response?.data || {error: 'Proxy Error'});
    }
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
