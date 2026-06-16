const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {
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
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        req.user = decodedToken; // Agregar información del usuario a la solicitud
        next();
    }catch(error){
        return res.status(401).json({ success: false, message: 'Token de autenticación inválido' });
    }
};