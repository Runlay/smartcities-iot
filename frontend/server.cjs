const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// setup "dist" as static folder
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})