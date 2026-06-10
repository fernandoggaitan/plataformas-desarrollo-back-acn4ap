//Express
const express = require('express');
//Ruteador
const router = express.Router();

//Controlador
const eventoController = require('../controllers/eventoController');

//Verbos

//Recuperar eventos.
router.get('/eventos', eventoController.index);

//Agregar un evento nuevo
router.post('/eventos', eventoController.store);

//Recuperar un evento por su ID.
router.get('/eventos/:ID', eventoController.show);

//Modificar un evento por su ID.
router.put('/eventos/:ID', eventoController.update);

//Eliminar un evento por su ID.
router.delete('/eventos/:ID', eventoController.destroy);

module.exports = router;