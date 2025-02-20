const urlBase = "https://movetrack.develotion.com/";
const urlImagenes = "https://movetrack.develotion.com/imgs/";
const ruteo = document.querySelector("#ruteo");




inicio();
function inicio() {
    ocultarPaginas();
    agregarEventos();
    if(localStorage.getItem("apiKey")!=null && localStorage.getItem("apiKey")!=undefined){
        mostrarMenu("logueado");
    }else{
        mostrarMenu("noLogueado");
    }
}


function agregarEventos(){
    //document.querySelector("#ruteo").addEventListener("ionRouteWillChange",navegar);
    document.querySelector("#btnRegistro").addEventListener("click", registro);
    document.querySelector("#btnCerrarSesion").addEventListener("click" , cerrarSesion);
    document.querySelector("#btnLogin").addEventListener("click", iniciarSesion);
    document.querySelector("#registrarActividades").addEventListener("click", agregarRegistro);
    document.querySelector("#slcFiltro").addEventListener("ionChange", listadoActividades)
    ruteo.addEventListener("ionRouteWillChange",mostrarPagina);
    
}
function volver(){
    ruteo.back();
}

function cerrarMenu(){
    document.querySelector("#menu").close();
}
/*MOSTRAR MENU*/
function mostrarMenu(clase){
    let itemsMenu = document.querySelectorAll("ion-menu ion-item");
    itemsMenu.forEach(item=> {
            if(item.className.includes(clase)){
                item.style.display="inline";
            }else{
                item.style.display="none";
            }
       
    })
}


/*function navegar(event){
    ocultarPaginas();
    if(event.detail.to=="/"){
        document.querySelector("#home").style.display="block";
    }
    else if(event.detail.to=="/login"){
        document.querySelector("#login").style.display="block";
    }
    else if(event.detail.to=="/registro"){
        document.querySelector("#registro").style.display="block";
    }
    else if(event.detail.to=="/registroActividades"){
        //agregarRegistro(); --Validar apiKey en la function
        document.querySelector("#registroActividades").style.display="block";
    }
   
}*/


function ocultarPaginas(){
    let paginas = document.querySelectorAll(".ion-page");
    for(let i=1;i<paginas.length;i++){
        paginas[i].style.display="none";
    }
}


function mostrarPagina(event) {
    let paginaDestino = event.detail.to;
    ocultarPaginas();
    switch (paginaDestino) {
        case "/":
            if(localStorage.getItem("apiKey") !=null){
                document.querySelector("#home").style.display = "block";
            }else{
                ruteo.push("/login");
            }
            
            break;
        case "/registro":
            obtenerPaises();
            document.querySelector("#registro").style.display = "block";
            break;
        case "/login":
            document.querySelector("#login").style.display = "block";
            break;
        case "/registroActividades":
            obtenerActividades();
            document.querySelector("#registroActividades").style.display = "block";
        break;
        case "/paginaActividades":
                //listadoActividades();
                document.querySelector("#paginaActividades").style.display = "block";
        break;
            default:
            localStorage.clear();
            mostrarMenu("noLogueado");
            ruteo.push("/login");
    }
}


    /*REGISTRO*/
     function registro() {
    try {
        let usuario = document.querySelector("#txtUsuarioRegistro").value;
        let password = document.querySelector("#txtPasswordRegistro").value;
        let pais = document.querySelector("#slcPais").value;
        validarDatos(usuario, password);
        fetch(urlBase+"/usuarios.php",
             {
                method:"POST",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify({
                    usuario: usuario, password: password, pais: pais
                })
             }
        )
        .then(function(response){
           return response.json();
        })
        .then(function(datos){
            if(datos.codigo=="200"){
                localStorage.setItem("apiKey", datos.apiKey);
                localStorage.setItem("id", datos.id);
                limpiarCamposRegistro("txtUsuarioRegistro","txtPasswordRegistro","slcPais");
                mostrarMenu("logueado");
                mostrarMensaje("Registro Exitoso, bienvenido " + usuario,1000,"success");
                setTimeout(() => {
                    ruteo.push("/");
                },501);
            }else{
                mostrarMensaje(datos.mensaje);
            }
        })
    } catch (Error) {
        mostrarMensaje(Error.message, 1500, "warning");
    }
}
 /*VALIDA LOS DATOS DE REGISTRO-LOGIN*/
function validarDatos(usuario, password) {
    if (usuario.trim().length == 0) {
        throw new Error("El usuario es obligatorio");
    }
    if (password.trim().length == 0) {
        throw new Error("La password es obligatoria");
    }
}

function mostrarMensaje(mensaje, tiempo = 2500, estado) {
    let toast = document.createElement("ion-toast");
    toast.message = mensaje;
    toast.duration = tiempo;
    toast.position = "bottom";
    toast.color=estado;
    document.body.appendChild(toast);
    toast.present();
}

function limpiarCamposRegistro() {
    document.querySelector("#txtUsuarioRegistro").value = "";
    document.querySelector("#txtPasswordRegistro").value = "";
    document.querySelector("#slcPais").value = "";
}

function obtenerPaises()
{
  fetch(urlBase+"paises.php",
    {
        headers:{"Content-type":"application/json"},
    })
    .then (function(response){
        return response.json();
    })
    .then(function(datos){
        let options= "";
        datos.paises.forEach(element => {
            options+=`<ion-select-option value=${element.id}>${element.name}</ion-select-option>`
        });
        document.querySelector("#slcPais").innerHTML=options;
    })
    .catch(e=> console.log(e));
}


/*CERRAR SESION*/
function cerrarSesion(){
localStorage.clear();
mostrarMensaje("Sesión Cerrada",2000);
setTimeout(() => {
    ruteo.push("/login");
},501);
//window.location.reload();
}


/*LOGIN*/
function iniciarSesion(){
    try{
        let usuario = document.querySelector("#txtUsuarioLogin").value;
        let password = document.querySelector("#txtPasswordLogin").value;
        validarDatos(usuario,password);
        fetch(urlBase+"login.php",
            {
                method:"POST",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify({
                     usuario: usuario, password: password
                })
            }
        )
        .then(function(response){
            return response.json();
        })
        .then(function(datos){
            if(datos.codigo=="200"){
                localStorage.setItem("id", datos.id);
                localStorage.setItem("apiKey", datos.apiKey);
                limpiarCampos("txtUsuarioLogin","txtPasswordLogin");
                mostrarMenu("logueado");
                mostrarMensaje("Login Exitoso, bienvenido " + usuario,2500, "success");
                setTimeout(() => {
                    ruteo.push("/");
                },501);
               
            }else{
                mostrarMensaje(datos.mensaje);
            }
        })
    }catch(Error){
        mostrarMensaje(Error.message,1500);
    }
}


function limpiarCampos(){
    for (let i = 0; i < arguments.length; i++) {
        document.querySelector("#"+arguments[i]).value="";
        
    }
}

/*OBTENGO LAS ACTIVIDADES*/
function obtenerActividades(){
    try {
        if(localStorage.getItem("apiKey")!=null){
            fetch(urlBase+"actividades.php",
                {   method:"GET",
                    headers:{
                    "Content-type":"application/json",
                    "apiKey": localStorage.getItem("apiKey"),
                     "iduser": localStorage.getItem("id")
                    },
                    
                })
                .then (function(response){
                    if(response.codigo==401){
                        mostrarMensaje("Debes loguearte de nuevo",1000, "warning");
                        setTimeout(()=>{
                            return ruteo.push("/login",500);
                        })
                    }
                    else if(response.codigo==500){
                        return Promise.reject("Datos incorrectos");
                    }
                    else{
                        return response.json();
                    }
                })
                .then(function(datos){
                    let options= "";
                    datos.actividades.forEach(element => {
                        options+=`<ion-select-option value=${element.id}>${element.nombre}</ion-select-option>`
                    });
                    document.querySelector("#slcActividad").innerHTML=options;
                })
                .catch(e=> console.log(e));
        }else{
            throw new Error("Debes estar logueado para registrar una actividad");
        }
    } catch (Error) {
        mostrarMensaje(Error.message,1500,"warning");
        setTimeout(()=>{
            return ruteo.push("/login"),500;
        })
    }
}



function agregarRegistro(){
    try {
        let idActividad = document.querySelector("#slcActividad").value;
        let tiempo = parseInt(document.querySelector("#idMinutos").value);
        let fecha = document.querySelector("#idFecha").value;
        console.log(fecha);
        validarActividad(idActividad);
        validarFecha(fecha);
        validarMinutos(tiempo);
        if(localStorage.getItem("apiKey")!=null){
            fetch(urlBase+"registros.php",
            {
              method: "POST",
              headers:{
                "Content-type":"application/json",
                "apiKey": localStorage.getItem("apiKey"),
                "iduser": localStorage.getItem("id")},
                body:JSON.stringify({
                    idActividad: idActividad, 
                    idUsuario: localStorage.getItem("id"), 
                    tiempo : tiempo, 
                    fecha : fecha
               })
            })
            .then (function(response){
                if(response.codigo==401){
                    mostrarMensaje("Debes loguearte de nuevo",1000, "warning");
                    setTimeout(()=>{
                        return ruteo.push("/login",500);
                    })
                }
                else if(response.codigo==500){
                    return Promise.reject("Datos incorrectos");
                }
                else{
                    return response.json();
                }
            })
            .then(function(datos){
                if(datos.codigo=="200"){
                    mostrarMensaje("Actividad Registrada con éxito",2000,"success");
                }else{
                    mostrarMensaje(datos.mensaje);
                }
            })
            .catch(e=> console.log(e));
        }else{
            throw new Error("Debes estar logueado para registrar una actividad");
        }
        
    } catch (Error) {
        mostrarMensaje(Error.message,1500,"danger");
    }
} 



function validarFecha(fechaElegida) {
    let fechaHoy = Date.now();
    let fechaSeleccionada = new Date(fechaElegida).getTime(); 
    
    if (fechaSeleccionada > fechaHoy || isNaN(fechaSeleccionada)) {
        throw new Error("La fecha debe ser anterior a la fecha actual o debe seleccionar una fecha");
    }
}


function validarActividad(actividad){
if(actividad === undefined){
    throw new Error("Debe ingresar una actividad");
}
}


function validarMinutos(minutos){
if (isNaN(minutos) || minutos <= 0 ) {
    throw new Error("Ingrese solo numeros");
}}

/* LISTADO DE ACTIVIDADES*/
/* Async - Await */
async function listadoActividades() {
    let registros = await ObtenerRegistros();
    let actividades = await obtenerActividadesParaListado(); 
    let registrosFiltrado = await filtroPorFecha(registros);
    
     
    let cards = "";

    for (let i = 0; i < registrosFiltrado.length; i++) {
        let registro = registrosFiltrado[i];
        console.log(registro.fecha);
        let actividad = null;

        for (let j = 0; j < actividades.length; j++) {
            if (actividades[j].id == registro.idActividad) {
                actividad = actividades[j];
                break; 
            }
        }
        
        if (actividad !== null) {
            cards += `</ion-card> 
            <ion-card style='padding-bottom:10%'>
                <ion-card-header>
                    <ion-card-title>${actividad.nombre}</ion-card-title>    
                </ion-card-header>
                <ion-card-content>
                     <img alt="${actividad.nombre}" src="${urlImagenes}${actividad.imagen}.png" />
                    <p>Usuario: ${registro.idUsuario}</p>
                    <p>Tiempo: ${registro.tiempo} minutos</p>
                    <p>Fecha: ${registro.fecha}</p>
                    <ion-button onclick="eliminarRegistro('${registro.id}')" color="danger" style='margin-top:0.5%'> Eliminar registro</ion-button>
                    </ion-card-content>`;
        }
    }
    document.querySelector("#listaActividades").innerHTML = cards;
}


async function ObtenerRegistros() {
   try {
    if(localStorage.getItem("apiKey")!=null){
     let response = await fetch(urlBase + "registros.php?idUsuario=" + localStorage.getItem("id"),{
        headers: {
            "Content-type": "application/json",
            "apiKey": localStorage.getItem("apiKey"),
            "iduser" : localStorage.getItem("id")
        }
     }
    );

     if(response.codigo == 401){
        mostrarMensaje("Debes iniciar sesión",500);
        setTimeout(() => {
            return ruteo.push("/login");
        }, 501);
     }
     else if (response.status == 404) {
        throw new Error("Datos incorrectos");
       
    }
    else {
        let datos = await response.json();
        
        return datos.registros;
    }
    }else{
        mostrarMensaje("Debes iniciar sesión");
        setTimeout(() => {
            return ruteo.push("/login");
        }, 501);
    }
   } catch (Error) {
    mostrarMensaje(Error.message);
   }
}

async function obtenerActividadesParaListado() {
    try {
        if(localStorage.getItem("apiKey")!=null){
         let response = await fetch(urlBase + "actividades.php",{
            headers: {
                "Content-type": "application/json",
                "apiKey": localStorage.getItem("apiKey"),
                "iduser" : localStorage.getItem("id")
            }
         }
        );
    
         if(response.codigo == 401){
            mostrarMensaje("Debes iniciar sesión",500);
            setTimeout(() => {
                return ruteo.push("/login");
            }, 501);
         }
         else if (response.status == 404) {
            throw new Error("Datos incorrectos");
        }
        else {
            let datos = await response.json();
            return datos.actividades;
        }
        }else{
            mostrarMensaje("Debes iniciar sesión");
            setTimeout(() => {
                return ruteo.push("/login");
            }, 501);
        }
       } catch (Error) {
        mostrarMensaje(Error.message);
       }
}


function eliminarRegistro(id){
    try {
        if(localStorage.getItem("apiKey")!=null){
            fetch(urlBase+"registros.php?idRegistro=" + id,
                {   method:"DELETE",
                    headers:{
                    "Content-type":"application/json",
                    "apiKey": localStorage.getItem("apiKey"),
                     "iduser": localStorage.getItem("id")
                    },
                })
                .then (function(response){
                    if(response.codigo==401){
                        mostrarMensaje("Debes loguearte de nuevo",1000, "warning");
                        setTimeout(()=>{
                            return ruteo.push("/login",500);
                        })
                    }
                    else if(response.codigo==500){
                        return Promise.reject("Datos incorrectos");
                    }
                    else{
                        mostrarMensaje("Registro eliminado con exito") 
                        //window.location.reload(); 
                    } 
                })
            .catch(e=> console.log(e));
        }else{
            throw new Error("Debes estar logueado para registrar una actividad");
        }
    } catch (Error) {
        mostrarMensaje(Error.message,1500,"warning");
        setTimeout(()=>{
            return ruteo.push("/login"),500;
        })  
    }   



}

async function filtroPorFecha(registros){
    let fecha = document.querySelector("#slcFiltro").value;
    let fechaActual = new Date();
    let registrosFiltrado= [];
    if (fecha == 2) {
        let fechaLimite = new Date();
        fechaLimite.setDate(fechaActual.getDate() - 7);         
        
        registros.forEach(element => {
            let fechaElemento = new Date(element.fecha).getTime();    
            console.log(fechaElemento);
            if (fechaElemento <= fechaActual && fechaElemento >= fechaLimite) {
                    registrosFiltrado.push(element);
                }
            }
        )
        }
        else if (fecha == 3) {  
            let fechaLimite = new Date();
            fechaLimite.setDate(fechaActual.getDate() - 30);
        
            registros.forEach(element => {
                let fechaElemento = new Date(element.fecha).getTime();
                if (fechaElemento <= fechaActual && fechaElemento >= fechaLimite) {
                registrosFiltrado.push(element);
            }
        }
    )      
    }else{
         registrosFiltrado = registros;
    }   
    return registrosFiltrado;
}

