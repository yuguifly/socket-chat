class Usuarios {
    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        let persona = {
            id,
            nombre,
            sala
        }

        this.personas.push(persona);

        return this.personas;

    }

    getPersona(id) {
        //Forma abreviada
        let persona = this.personas.filter(pers => pers.id === id)[0];

        //IGUAL QUE LO DE ARRIBA
        // let persona = this.personas.filter(pers => {
        //     return persona.id === id;
        // })[0];

        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        // let personasEnSala = this.personas.filter(persona => {
        //     return persona.sala === sala;
        // });
        let personasEnSala = this.personas.filter(persona => persona.sala === sala);
        return personasEnSala;

    }

    borrarPersona(id) {

        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter(pers => pers.id != id);
        //forma larga
        // this.personas = this.personas.filter(pers => {
        //     return pers.id != id;
        // });

        //si no exite tenemos que gestionarlo
        return personaBorrada;
    }
}


module.exports = {
    Usuarios
};