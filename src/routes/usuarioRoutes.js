const express = require('express');
const router = express.Router();

//Controlador
const usuarioController = require("../controllers/usuarioController");

//Middleware para verificar que el usuario inició sesión.
const { requireAuth } = require("../middlewares/auth");

router.post("/register", usuarioController.register);
router.post("/login", usuarioController.login);
router.get("/welcome", requireAuth, usuarioController.welcome);

module.exports = router;