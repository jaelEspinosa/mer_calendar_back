const { response } = require("express");


const Event = require("../models/EventModel")




//obtener evento por id

const getEventoById = async ( req, res= response ) => {

 const { id } = req.params

 try {
   const event = await Event.findById( id )

   if ( !event ) {
     return  res.status(404).json({ok: false, msg:'No se ha encontrado el evento'})
   }
  
  return res.status(201).json({ok:true, event})
  
 } catch (error) {
   console.log(error)
   res.status(500).json({ok:false, msg:'Por favor hable con el administrador'})
 }

res.status(200).json({ok:true, msg: 'evento by id'})

}




// obtener eventos

const getEventos = async (req, res = response) => {
  const { uid } = req;
  try {
    const events = await Event.find().populate('user', 'name email')  //esparce todos los campos de user.
    res.status(201).json( events )
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok:false,
      msg:'Por favor hable con el administrador'
    })
  }

  
};

//crear nuevo evento

const crearEvento = async ( req, res = response ) => {
 
   const event = new Event( req.body )
   const { uid } = req

   try {
    event.user = uid
    const eventSaved = await event.save()
    return res.status(200).json( eventSaved )
    
   } catch (error) {
     console.log(error)
     return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
     })
   }

};


// Actualizar evento

const actualizarEvento = async ( req, res = response ) => {
   
    const eventId = req.params.id
    const { uid, name } = req
    // console.log( req.rawHeaders[1] ) //! Este seria es X-TOKEN

    try {
      const event = await Event.findById( eventId )

      if ( !event ) {
       return res.status(404).json({ok: false, msg: "No se encontró el evento"})
      }
  
      if (event.user.toString() !== uid) {      
       return res.status(401).json({ok: false, msg: 'No tiene permisos para modificar este evento'})
      }
     

     /*  const eventToActualize = new Event( req.body )
      eventToActualize._id = eventId */

      const eventToActualize = {
        ...req.body,   // por alguna razon si no pongo el user:uid da lo mismo, lo coge mongoose.
        user: uid
      }
      
      const eventUpdated = await Event.findByIdAndUpdate( eventId, eventToActualize, {new: true} )
      return res.status(201).json({
        ok: true,
        evento: eventUpdated
      })
     
    } catch (error) {

        console.log( error )
        return res.status(500).json({
          ok:false,
          msg: 'Por favor hable con el administrador.'
        })
    }

    
}

// Eliminar Evento


const eliminarEvento =  async ( req, res = response ) => {

    const { uid } = req
    const { id } = req.params
   

    try {
      const event = await Event.findById({_id : id })
      if ( !event ) {
        return res.status(404).json({
          ok:false,
          msg: 'No se ha encontrado el evento'
        })
      }

      if( event.user.toString() !== uid ){
        return res.status(401).json({
          ok:false,
          msg:'No tiene permisos para eliminar el evento'
        })
      }
      
      await Event.deleteOne({ _id : id })
      return res.status(201).json({
        ok:true,
        msg: `El evento ${event.title.toUpperCase()} ha sido eliminado`
      })

    } catch (error) {
      console.log(error)
      res.status(500).json({
        ok:false,
        msg: 'Por favor hable con el administrador.'
      })
    }

    
}




module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  getEventoById
};
