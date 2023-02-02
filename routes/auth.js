/* 
        Rutas de Usuarios / Auth
        host + /api/auth
*/



const express = require('express')
const router = express.Router()

const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth')
const { check } = require('express-validator')
const { fieldsValidator } = require('../middlewares/fieldsValidator')
const { jwtValidator } = require('../middlewares/jwtValidator')

router.post ( 
    '/new',
    [// middlewares
       check ('name', 'El nombre es obligatorio').not().isEmpty(),
       check ('name', 'El nombre es muy corto').isLength({ min: 4 }),
       check ('email', 'El email no es correcto').isEmail(),
       check ('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }),
       fieldsValidator
    ], 
    crearUsuario );

router.post('/', 
    [ //middlewares
       check ('email', 'El mail no es correcto').isEmail(),
       check ('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }),
       fieldsValidator

    ],
    loginUsuario);

router.get('/renew', jwtValidator, revalidarToken);



module.exports = router