const { io } = require('../server');
const { crearMensaje } = require('../utilidades/utilidades');

const { Usuarios } = require('../classes/usuarios');
const usuarios = new Usuarios();

io.on('connection', (client) => {
    //cuando entran al chat creamos un nuevo objeto persona
    client.on('entrarChat', (data, callback) => {
        //console.log(data);
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre y la sala es necesario'
            });
        }

        //conectar usuario a una sala
        client.join(data.sala);
        //ANTIGUO
        //let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);
        usuarios.agregarPersona(client.id, data.nombre, data.sala);
        //cuando entra un cliente buscamos todas las personas en el chat
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));

        //ANTIGUO
        //callback(personas);

        callback(usuarios.getPersonasPorSala(data.sala));
        //console.log(usuario);

    });

    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });


    //cuando salen del chat borramos el objeto persona 
    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        //client.broadcast.emit('crearMensaje', { usuario: 'Administrador', mensaje: `${personaBorrada.nombre} abandonó el chat` })
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administradro', `${personaBorrada.nombre} salió`));
        //cuando se desconecta un cliente buscamos todas las personas en el chat
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
    });


    //MENSAJES PRIVADOS
    client.on('mensajePrivado', data => {
        //tendriamos que verificar que vienen los datos
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(data.mensaje));
    });
});