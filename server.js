require('dotenv').config();
const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");
const file = fs.readFileSync("./swagger.yaml", "utf8");
const modifiedFile = file.replace("{{API_URL}}", `${process.env.HOST}/api`);
const swaggerDocument = YAML.parse(modifiedFile);
require('./config/database')
const port = process.env.PORT || 3000
const routes = require('./routes/index');

app.use(cors())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))


app.get('/', (req, res) => {
  return res.status(200).send(`Welcome to lms.`)
})

app.use('/api', routes)

app.listen(port, () => console.log(`Server listening on port ${port}!`))