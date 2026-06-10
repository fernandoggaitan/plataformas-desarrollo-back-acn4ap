//Conexión a la base de datos.
const connection = require('../../db');
//Helper para fechas
const {formatToday} = require('../helpers/dateHelper');
//Encriptador.
const bcrypt = require('bcrypt');

exports.create = async( {nombre, email, contrasena, is_admin} ) => {
    //Encriptar la contraseña
    const contrasena_crypt = await bcrypt.hash(contrasena, 10);
    const query = `
        INSERT INTO usuarios(nombre, email, contrasena, is_admin, fecha_creacion, fecha_modificacion)
        VALUES(?, ?, ?, ?, ?, ?)
    `;
    try{
        await connection.query(query, [nombre, email, contrasena_crypt, (is_admin ? 1 : 0), formatToday(), formatToday()]);
    }catch(error){
        throw error;
    }
}

exports.login = async( {email, contrasena} ) => {
    //Buscamos el usuario por su correo.
    const query = `
        SELECT id, nombre, email, contrasena, is_admin
        FROM usuarios
        WHERE email = ?
    `;
    try{
        [results] = await connection.query(query, [email]);
        //Verificamos si encontró el usuario.
        if(results.length == 1){
            const usuario = results[0];
            //Verificamos que la contraseña ingresada es correcta.
            const is_contrasena = await bcrypt.compare(contrasena, usuario.contrasena);
            return (is_contrasena) ? usuario : null;
        }else{
            return null;
        }
    }catch(error){
        throw error;
    }
}