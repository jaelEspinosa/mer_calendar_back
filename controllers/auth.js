
const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/UsuarioModel');
const { generarJWT } = require ('../helpers/jwt')


//! *** NUEVO USUARIO ***

const crearUsuario = async (req, res = response)=>{
    const{ email, password } = req.body
    
    
    try {
        let usuario = await Usuario.findOne({email})   

        if (!usuario){
            
            usuario = new Usuario( req.body);
            
            // encriptar contraseña
            const salt = bcrypt.genSaltSync();
            usuario.password = bcrypt.hashSync(password, salt);

            await usuario.save()

            // Generar TOKEN
            const token = await generarJWT(usuario._id, usuario.name);

            console.log('El token es...', token)
            return res.status(201).json({
                ok: true,
                uid: usuario._id,
                name: usuario.name,
                token
            });
        }else{
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya está registrado'
            })
        }   
    } catch (error) {
        console.log(error)
       return res.status(500).json({
        ok:false,
        msg: 'Por favor hable con el administrador'
      })  
    }

};

//! *** LOGIN ***

const loginUsuario = async (req, res = response )=>{
    
    const{ email, password } = req.body
  
   try {
     const usuario = await Usuario.findOne({email})
     if( !usuario ){
        return res.status(400).json({
            ok:false,
            msg:'No existe ningún usuario con este email'
        });
     }

     // true o false, al comparar el password enviado con el de Db.
     
    const validPassword = bcrypt.compareSync( password, usuario.password );  
   
    if( !validPassword ){
        return res.status(400).json({
            ok:false,
            msg: 'Password incorrecto'
        });
     }

     // Generar TOKEN
    const token = await generarJWT(usuario._id, usuario.name);

    res.status(200).json({
        ok:true, 
        msg:'Login usuario',
        uid: usuario._id,
        name: usuario.name,
        token
    })

   } catch (error) {
    console.log(error)
    return res.status(500).json({
     ok:false,
     msg: 'Por favor hable con el administrador'
   }) 
   }


   
};

//!    ***   REVALIDAR TOKEN ***


const revalidarToken = async (req, res = response)=>{

    const { uid, name} = req;
   

    // generar un nuevo JWT 
    const token = await generarJWT(uid, name);
    
    res.json({
        ok:true,
        token
    })
}

module.exports = {

    crearUsuario,
    loginUsuario,
    revalidarToken,

}