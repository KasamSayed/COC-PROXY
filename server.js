const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

// 1. Root Route - To verify the proxy is alive
app.get('/', (req, res) => {
    res.send('<h1>PROXY IS LIVE</h1><p>Use /coc/ followed by the API path.</p>');
});

// 2. Main Proxy Route
app.get('/coc/*', async (req, res) => {
    const apiPath = req.params[0];
    const url = `https://api.clashofclans.com/v1/${apiPath}`;
    
    try {
        console.log(`Forwarding request to: ${url}`);
        const response = await axios.get(url, {
            headers: { 
                'Authorization': req.headers.authorization,
                'Accept': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        // If Supercell blocks us (403), they often send back the IP they detected
        const errorMessage = error.response?.data?.message || "Access Denied";
        
        // This log helps you see the error in the Render Dashboard Logs
        console.error("--- PROXY ERROR ---");
        console.error("Status:", error.response?.status);
        console.error("Message from CoC:", errorMessage);
        
        res.status(error.response?.status || 500).json({
            error: "Proxy received an error from Supercell",
            status: error.response?.status,
            message: errorMessage,
            hint: "Check if the IP shown in Render logs is whitelisted in CoC Portal."
        });
    }
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
