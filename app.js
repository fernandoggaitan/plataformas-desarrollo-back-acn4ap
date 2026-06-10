const express = require('express');

const app = express();

const port = 3000;

//Conexión a la base de datos.
const connection = require('./db');


//Middleware de Express que se encarga de analizar los cuerpos de las peticiones con formato JSON.
app.use(express.json());

app.listen(port, () => {
    console.log(`Servidor iniciado en: http://localhost:${port}`);
});

//Creando endpoints.
app.get('/', (req, res) => {
    res.send('Hola, bienvenida/o a mi sitio');
});

app.get('/info', (req, res) => {
    res.send('Estamos aprendiendo Express');
});

app.get('/saludar/:nombre', (req, res) => {
    //const nombre = req.params.nombre;
    const {nombre} = req.params;
    res.send(`Hola, ${nombre}`);
});

app.use(require('./src/routes/eventoRoutes'));
app.use(require('./src/routes/usuarioRoutes'));

// Middleware para manejar el error 404
app.use((req, res, next) => {
    res.status(404);
    res.send(`
      <h1>404 - Página no encontrada</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <a href="/">Volver a la página de inicio</a>
    `);
});