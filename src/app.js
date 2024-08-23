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
    app._router.stack.forEach((middleware) =>
    {
        if (middleware.route){ console.log(middleware.route.path, middleware.route.methods); }

        else if (middleware.name === 'router')
        { // Se for um router, verifica as sub-rotas
            middleware.handle.stack.forEach((handler) =>
            {
                const route = handler.route;
                if (route){ console.log(route.path, route.methods); }
            });
        }
    });

    console.log(`\nServidor ativo na porta ${server_port}.`);


});
