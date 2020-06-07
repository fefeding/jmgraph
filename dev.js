const express = require('express')
const app = express()

app.use(express.static("."));

const port = 8800;

app.listen(port)

console.log(`dev server listend at ${port}`);