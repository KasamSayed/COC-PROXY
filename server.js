const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

// This will match EVERYTHING. No more 404s.
app.use(async (req, res) => {
    // If someone visits the main URL
    if (req.path === '/') {
        return res.send('PROXY IS LIVE');
    }

    // This converts /coc/clans/TAG to https://api.clashofclans.com/v1/clans/TAG
    const apiPath = req.path.replace('/coc/', '');
    const url = `https://api.clashofclans.com/v1/${apiPath}`;

    try {
        console.log("Forwarding to:", url);
        const response = await axios.get(url, {
            headers: { 'Authorization': req.headers.authorization }
        });
        res.json(response.data);
    } catch (e) {
        res.status(e.response?.status || 500).json(e.response?.data || {error: 'Proxy Error'});
    }
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
