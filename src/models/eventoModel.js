//Conexión a la base de datos.
const connection = require('../../db');

//Helper para fechas
const {formatToday} = require('../helpers/dateHelper');

exports.all = async() => {
    const query = `
        SELECT id, nombre, cupo
        FROM eventos
    `;
    try{
        [results] = await connection.query(query);
        return results;
    }catch(error){
        throw error;
    }
}
exports.create = async( {nombre, descripcion, cupo} ) => {
    const query = `
        INSERT INTO eventos(nombre, descripcion, cupo, fecha_creacion, fecha_modificacion)
        VALUES(?, ?, ?, ?, ?)
    `;
    try{
        await connection.query(query, [nombre, descripcion, cupo, formatToday(), formatToday()]);
    }catch(error){
        throw error;
    }
}
exports.find = async(ID) => {
    const query = `
        SELECT id, nombre, cupo
        FROM eventos
        WHERE id = ?
    `;
    try{
        [results] = await connection.query(query, [ID]);
        return (results.length == 1) ? results[0] : null;
    }catch(error){
        throw error;
    }
}
exports.update = async( {ID, nombre, descripcion, cupo} ) => {
    const query = `
        UPDATE eventos
        SET
            nombre = ?,
            descripcion = ?,
            cupo = ?,
            fecha_modificacion = ?
        WHERE id = ?
    `;
    try{
        await connection.query(query, [nombre, descripcion, cupo, formatToday(), ID]);        
    }catch(error){
        throw error;
    }
}


exports.delete = async(ID) => {
    const query = `
        DELETE
        FROM eventos
        WHERE id = ?
    `;
    try{
        [results] = await connection.query(query, [ID]);
        return (results.length == 1) ? results[0] : null;
    }catch(error){
        throw error;
    }
}
