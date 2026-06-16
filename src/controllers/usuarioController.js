const usuarioModel = require("../models/usuarioModel");

//Jason Web Token
const jwt = require('jsonwebtoken');

exports.register = async(req, res) => {
    //Verifica que haya un body.
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: 'Petición incorrecta'
        });
    }
    const {nombre = null, email = null, contrasena = null} = req.body;
    const is_admin = false;
    // Validación de datos.
    const errores = validarUsuario( {nombre, email, contrasena} );
    if (errores.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errores
        });
    }
    try{
        await usuarioModel.create( {nombre, email, contrasena, is_admin} );
        res.json({ success: true, message: 'Usuario registrado correctamente'});
    }catch(error){
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar registrar al usuario' });
    }
}

exports.login = async(req, res) => {
    //Verifica que haya un body.
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: 'Petición incorrecta'
        });
    }
    const {email = null, contrasena = null} = req.body;
    try{
        const usuario = await usuarioModel.login( {email, contrasena} );
        if(usuario == null){
            res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }else{

            //Información que se va a hashear.
            const playload = { 
                ID: usuario.id, 
                nombre: usuario.nombre, 
                is_admin: (usuario.is_admin == '1') 
            };

            //Access token.
            const accessToken = jwt.sign(
                playload, 
                process.env.JWT_ACCESS_TOKEN_SECRET, 
                { expiresIn: '15m' }
            );

            //Refresh token
            const refreshToken = jwt.sign(
                playload, 
                process.env.JWT_REFRESH_TOKEN_SECRET, 
                { expiresIn: '7d' }
            );

            res.json({
                success: true,
                message: 'Inicio de sesión exitoso',
                nombre: usuario.nombre,
                accessToken,
                refreshToken
            });
        }
    }catch(error){
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar iniciar sesión' });
    }
}

exports.refreshToken = (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Token de autenticación no proporcionado' });
    }
    // El valor del encabezado de autorización debe tener el formato "Bearer tu_token_jwt_aqui"
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ success: false, message: 'Formato de token no válido' });
    }
    try{
        const usuario = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
        //Información que se va a hashear.
        const playload = { ID: usuario.ID, nombre: usuario.nombre, is_admin: usuario.is_admin };
        // Ahora, user contiene información del usuario. Puedes generar un nuevo accessToken.
        const newAccessToken = jwt.sign(playload, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        // Devolver el nuevo accessToken al cliente
        res.json({ success: true, accessToken: newAccessToken });
    }catch(error){
        return res.status(401).json({ success: false, message: 'Token de autenticación inválido' });
    }
}

exports.welcome = (req, res) => {
    res.json({ success: true, message: 'Bienvenida/o ' + req.user.nombre });
}

// Función de validación de usuario.
const validarUsuario = ( {nombre, email, contrasena} ) => {
    const errores = [];
    // Expresiones regulares:
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;  
    // Validar nombre    
    if (!nombre || nombre.trim() === '') {
        errores.push('El nombre es incorrecto');
    }
    // Validar email    
    if (!email || email.trim() === '' || !emailRegex.test(email.trim())) {
        errores.push('El correo electrónico es incorrecto');
    }
    // Validar contraseña
    /*
    if (!contrasena || contrasena.trim() === '' || !passwordRegex.test(contrasena.trim())) {
        errores.push('La contraseña es incorrecta');
    }
    */
    return errores;
};