const eventoModel = require('../models/eventoModel');

exports.index = async(req, res) => {
    try{
        const results = await eventoModel.all();
        res.json({ success: true, results });
    }catch(error){
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar recuperar los eventos' });
    }
}
exports.store = async(req, res) => {
    //Verifica que haya un body.
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: 'Petición incorrecta'
        });
    }
    const {nombre = null} = req.body;
    const {descripcion = null} = req.body;
    const {cupo = null} = req.body;
    // Validación de datos.
    const errores = validarEvento( {nombre, descripcion, cupo} );
    if (errores.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errores
        });
    }
    try{
        await eventoModel.create( {nombre, descripcion, cupo} );
        res.json({ success: true, message: 'El evento se ha creado correctamente'});
    }catch(error){
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar agregar el evento' });
    }
}
exports.show = async(req, res) => {
    //Recupera el ID de la URL.
    const {ID} = req.params;
    try{
        const result = await eventoModel.find(ID);
        if(result == null){
            //El evento con ese ID no existe.
            res.status(404).json({ success: false, message: 'El evento no existe o ha dejado de existir' });
        }else{            
            res.json({ success: true, result });
        }
    }catch(error){
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar recuperar el evento' });
    }
}
exports.update = async(req, res) => {
    //Recupera el ID de la URL.
    const { ID } = req.params;
    //Verifica que haya un body.
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: 'Petición incorrecta'
        });
    }
    const {nombre = null} = req.body;
    const {descripcion = null} = req.body;
    const {cupo = null} = req.body;
    // Validación de datos.
    const errores = validarEvento( {nombre, descripcion, cupo} );
    if (errores.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errores
        });
    }
    try{
        eventoModel.update( {nombre, descripcion, cupo, ID} );
        res.json({ success: true, message: 'El evento se ha modificado correctamente'});
    }catch(error){
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar modificar el evento' });
    }
}


exports.destroy = async(req, res) => {
    //Recupera el ID de la URL.
    const { ID } = req.params;
    try{
        eventoModel.delete( ID );
        res.json({ success: true, message: 'El evento se ha eliminado correctamente'});
    }catch(error){
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al intentar eliminar el evento' });
    }
}


// Función de validación reutilizable
const validarEvento = ( {nombre, descripcion, cupo} ) => {
    const errores = [];    
    // Validar nombre
    if (!nombre || nombre.trim() === '') {
        errores.push('El nombre es incorrecto');
    }
    // Validar descripción
    if (!descripcion || descripcion.trim() === '') {
        errores.push('La descripción es incorrecta');
    }
    // Validar cupo
    if ( !cupo || isNaN(cupo) ) {
        errores.push('El cupo es incorrecto');
    }  
    return errores;
};
