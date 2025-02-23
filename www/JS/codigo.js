const urlBase = "https://movetrack.develotion.com/";
const urlImagenes = "https://movetrack.develotion.com/imgs/";
const ruteo = document.querySelector("#ruteo");

let latitudOrigen="";
let longitudOrigen="";
navigator.geolocation.getCurrentPosition(guardarUbicacion,obtenerError);


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

function guardarUbicacion(position){
    latitudOrigen = position.coords.latitude;
    longitudOrigen = position.coords.longitude;
}

function obtenerError(error){
    switch(error.code){
        case 0:
            mostrarMensaje("Tiempo excedido");
            break;
        case 1: 
        mostrarMensaje("Es necesario habilitar geolocalizacion");
        break;
        case 2: 
        mostrarMensaje("Ubicacion no detectada");
        break;
    }
}

function agregarEventos(){
    //document.querySelector("#ruteo").addEventListener("ionRouteWillChange",navegar);
    document.querySelector("#btnRegistro").addEventListener("click", registro);
    document.querySelector("#btnCerrarSesion").addEventListener("click" , cerrarSesion);
    document.querySelector("#btnLogin").addEventListener("click", iniciarSesion);
    document.querySelector("#registrarActividades").addEventListener("click", agregarRegistro);
    document.querySelector("#slcFiltro").addEventListener("ionChange", listadoActividades);
    document.querySelector("#btnTiempos").addEventListener("click", miTiempo);
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
                listadoActividades();
                document.querySelector("#paginaActividades").style.display = "block";
        break;
        case "/mapa":
            mostrarMapa();
            document.querySelector("#mapa").style.display = "block";
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
window.location.reload();
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
        let fecha = document.querySelector("#date").value;
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
                        listadoActividades();
                        miTiempo();
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


async function filtroPorFecha(registros) {
    let filtro = document.querySelector("#slcFiltro").value;
    let fechaActual = new Date();
    let registrosFiltrado = [];

    if (filtro == "2") { 
        let fechaLimite = new Date();
        fechaLimite.setDate(fechaActual.getDate() - 8); 

        registros.forEach(element => {
            let fechaElemento = new Date(element.fecha);
            if (fechaElemento >= fechaLimite && fechaElemento <= fechaActual) {
                registrosFiltrado.push(element);
            }
        });
    } 
    else if (filtro == "3") { 
        let fechaLimite = new Date();
        fechaLimite.setMonth(fechaActual.getMonth() - 1); 

        registros.forEach(element => {
            let fechaElemento = new Date(element.fecha);
            if (fechaElemento >= fechaLimite && fechaElemento <= fechaActual) {
                registrosFiltrado.push(element);
            }
        });
    } 
    else {
        registrosFiltrado = registros; 
    }

    return registrosFiltrado;
}


async function miTiempo() {
    let registros = await ObtenerRegistros();
    let tiempoTotal = 0;
    let tiempoDiario = 0;

    let fechaActual = new Date();
    let fechaLimite = new Date();
    fechaLimite.setDate(fechaActual.getDate() - 1);
    fechaLimite.setHours(0, 0, 0, 0);
    fechaActual.setHours(23, 59, 59, 999);
   //Usamos ChatGPT para convertir las fechas a ISO, porque ionic la ponia en UTC
    registros.forEach(unRegistro => {
        tiempoTotal += unRegistro.tiempo;

        let fechaISO = new Date(unRegistro.fecha).toISOString().split("T")[0];

        let fechaLimiteISO = fechaLimite.toISOString().split("T")[0];
        let fechaActualISO = fechaActual.toISOString().split("T")[0];
        if (fechaISO >= fechaLimiteISO && fechaISO <= fechaActualISO) {
            tiempoDiario += unRegistro.tiempo;
        } 
    });
    document.querySelector("#resultadoTiempo").innerHTML = `
        <ion-label class="labelTiempo">Tiempo Diario: ${tiempoDiario}</ion-label>
        <br>
        <ion-label class="labelTiempo">Tiempo Total: ${tiempoTotal}</ion-label>
    `;
}


//MODAL PARA MI TIEMPO
/*async function miTiempo() {
    let registros = await ObtenerRegistros();

    let tiempoTotal = 0;
    let tiempoDiario = 0;
    let fechaActual = new Date();
    let fechaLimite = new Date();
    fechaLimite.setDate(fechaActual.getHours() - 24);

    registros.forEach(unRegistro => {
        tiempoTotal += unRegistro.tiempo;
        let fechaElemento = new Date(unRegistro.fecha);
        if (fechaElemento >= fechaLimite && fechaElemento <= fechaActual) {
            tiempoDiario += unRegistro.tiempo;
        }
    });

    // Actualiza los datos en el modal
    document.querySelector("#modalTiempoDiario").innerText = `Tiempo Diario: ${tiempoDiario}`;
    document.querySelector("#modalTiempoTotal").innerText = `Tiempo Total: ${tiempoTotal}`;

    // Abre el modal
    let modal = document.querySelector("#modalTiempo");
    modal.present();
}

// Función para cerrar el modal
function cerrarModal() {
    let modal = document.querySelector("#modalTiempo");
    modal.dismiss();
}*/

async function mostrarMapa() {
  
    let paises = await obtenerPaisesParaMapa();
    let cantidadUsuarios = await cantidadUsuarioPorPais();

     
    setTimeout(() => {
        
        var map = L.map('map', {
            minZoom: 2, // Evita que el usuario aleje demasiado el zoom
            maxBounds: [
                [-90, -180], // Esquina suroeste
                [90, 180]    // Esquina noreste
            ],
            maxBoundsViscosity: 1.0, // Mantiene al usuario dentro de los límites
            worldCopyJump: true // Corrige el desplazamiento del mapa al llegar al borde
        }).fitWorld();

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            minZoom: 2, // Aplica el mismo mínimo aquí
            attribution: '© OpenStreetMap'
        }).addTo(map);
        L.marker([latitudOrigen,longitudOrigen]).addTo(map);

        for (let i = 0; i < paises.length; i++) {
            let pais = paises[i];
            
            let marker = L.marker([pais.latitude, pais.longitude]).addTo(map);
            for (let j = 0; j < cantidadUsuarios.length; j++) {
                if (cantidadUsuarios[j].id == pais.id) {
                     marker.bindPopup("Cantidad de Usuarios:"+ cantidadUsuarios[j].cantidadDeUsuarios).addTo(map);
                }
            }
        }
        map.invalidateSize();
    }, 500);
}

async function cantidadUsuarioPorPais() {
    try {
        let response = await fetch(urlBase+"usuariosPorPais.php",
          {
              headers:{"Content-type":"application/json",
                "apiKey": localStorage.getItem("apiKey"),
                 "iduser": localStorage.getItem("id")
              },
          })
          if(response.codigo == 401){
              mostrarMensaje("Debes iniciar sesión",500);
              setTimeout(() => {
                  return ruteo.push("/login");
              }, 501);
           }else{
              let datos = await response.json();
              return datos.paises;
           }
    } catch (Error) {
        mostrarMensaje(Error.message);
    }
}

async function obtenerPaisesParaMapa()
{
    try {
        let response = await fetch(urlBase+"paises.php",
          {
              headers:{"Content-type":"application/json"},
          })
          if(response.codigo == 401){
              mostrarMensaje("Debes iniciar sesión",500);
              setTimeout(() => {
                  return ruteo.push("/login");
              }, 501);
           }else{
              let datos = await response.json();
              return datos.paises;
           }
    } catch (Error) {
        mostrarMensaje(Error.message);
    }
}
