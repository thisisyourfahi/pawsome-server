const express = require('express');
const app = express();
const port = 5555

app.get('/', (req, res) => {
    res.send('pawsome-server is running!');
})

app.listen(port, () => {
    console.log(`click: http://localhost:${port}`);
})