const express = require('express');
const axios = require('axios');

const app = express();
const port = 9876;



const windowSize = 10;
let window = [];

const TEST_SERVER_URL = 'http://20.244.56.144/test/primes'; 

const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return sum / numbers.length;
};

app.get('/numbers/:numberid', async (req, res) => {
    const numberid = req.params.numberid;
    const startTime = Date.now();

    try {
        
        const response = await axios.get(`${TEST_SERVER_URL}`);
        console.log(response);

        
        if (Date.now() - startTime > 500) {
            return res.status(504).json({ error: 'Request timed out' });
        }

        const numbers = response.data.numbers;
        const uniqueNumbers = [...new Set(numbers)];

        
        window = [...window, ...uniqueNumbers];

        
        if (window.length > windowSize) {
            window = window.slice(-windowSize);
        }

        const avg = calculateAverage(window);

        
        res.json({
            numbers: uniqueNumbers,
            windowPrevState: window.slice(0, -uniqueNumbers.length),
            windowCurrState: window,
            avg: avg.toFixed(2),
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch numbers from the server' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


