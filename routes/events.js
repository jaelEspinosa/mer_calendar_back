
/* 
        Rutas de Eventos / Events
        host + /api/events
*/


const express = require('express')
const { check } = require('express-validator')
const router = express.Router()



const { getEventos, crearEvento, actualizarEvento, eliminarEvento, getEventoById } = require('../controllers/events')
const { isDate } = require('../helpers/isDate')
const { fieldsValidator } = require('../middlewares/fieldsValidator')
const { jwtValidator } = require('../middlewares/jwtValidator')





// obtener eventos
router.get('/',  getEventos )

//obtener un evento por id
router.get('/:id', getEventoById )

// todas tienen que pasar por la validacion del token
router.use( jwtValidator)

// Crear un nuevo evento
router.post(
        '/', 
        [
          check('title', 'El titulo es obligatorio').not().isEmpty(),
          check('start', 'Fecha de inicio no es correcta').custom( isDate ),
          check('end', 'Fecha de fin no es correcta').custom( isDate ),      
       
          fieldsValidator
        ]
        , crearEvento)


//Actualizar evento
router.put('/:id', actualizarEvento)


//Borrar evento
router.delete('/:id', eliminarEvento)

module.exports = router
    
