const express = require('express');
const ejs = require('ejs');
const routes = require('./routes.js');

const app = express();
const server_port = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use('/api', routes);
app.set("view engine", "ejs");

app.listen(server_port, () =>
{ 
    console.log(`Servidor ativo na porta ${server_port}.`);
});
