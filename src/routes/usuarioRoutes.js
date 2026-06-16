const express = require('express');
const router = express.Router();

//Controlador
const usuarioController = require("../controllers/usuarioController");

//Middleware para verificar que el usuario inició sesión.
const { requireAuth } = require("../middlewares/auth");

router.post("/register", usuarioController.register);

//Se loguea.
router.post("/login", usuarioController.login);

//El usuario debe acceder a la siguiente ruta ya logueado.
router.get("/welcome", requireAuth, usuarioController.welcome);

//Genera un nuevo acccess token.
router.get('/refresh-token', usuarioController.refreshToken);

module.exports = router;