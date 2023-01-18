const express = require('express')
const app = express();
const port = process.env.PORT || 8000;
const path = require('path');

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'public', 'index.html')
    );
})

app.listen(port, () => {
    console.log('Server started at http://localhost:' + port);
})
