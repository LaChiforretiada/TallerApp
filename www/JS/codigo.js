const urlBase = "https://movetrack.develotion.com/";
const urlImagenes = "https://movetrack.develotion.com/imgs/";
const ruteo = document.querySelector("#ruteo");




inicio();
function inicio() {
    ocultarPaginas();
    agregarEventos();
    obtenerPaises();
    obtenerActividades();
    if(localStorage.getItem("apiKey")!=null && localStorage.getItem("apiKey")!=undefined){
        mostrarMenu("logueado");
    }else{
        mostrarMenu("noLogueado");
    }
}


function agregarEventos(){
    document.querySelector("#ruteo").addEventListener("ionRouteWillChange",navegar);
    document.querySelector("#btnRegistro").addEventListener("click", registro);
    document.querySelector("#btnCerrarSesion").addEventListener("click" , cerrarSesion);
    document.querySelector("#btnLogin").addEventListener("click", iniciarSesion);
    ruteo.addEventListener("ionRouteWillChange",mostrarPagina);

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


function navegar(event){
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
        document.querySelector("#registroActividades").style.display="block";
    }
   
}


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
            document.querySelector("#registro").style.display = "block";
            break;
        case "/login":
            document.querySelector("#login").style.display = "block";
            break;
        case "/registroActividades":
            document.querySelector("#registroActividades").style.display = "block";
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
                mostrarMensaje("Registro exitoso");
                limpiarCamposRegistro("txtUsuarioRegistro","txtPasswordRegistro","slcPais");
                mostrarMenu("logueado");
                mostrarMensaje("Registro Exitoso, bienvenido " + usuario,500);
                setTimeout(() => {
                    ruteo.push("/");
                },501);
            }else{
                mostrarMensaje(datos.mensaje);
            }
        })
    } catch (Error) {
        mostrarMensaje(Error.message, 1500);
    }
}
 /*VALIDA LOS DATOS DE REGISTRO*/
function validarDatos(usuario, password) {
    if (usuario.trim().length == 0) {
        throw new Error("El usuario es obligatorio");
    }
    if (password.trim().length == 0) {
        throw new Error("La password es obligatoria");
    }
}

function verificarExistenciaEmail(email) {
    return usuarios.find(u => u.email == email);
}
function mostrarMensaje(mensaje, tiempo = 2500) {
    let toast = document.createElement("ion-toast");
    toast.message = mensaje;
    toast.duration = tiempo;
    toast.position = "bottom";
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
mostrarMensaje("Sesión Cerrada");
setTimeout(() => {
    ruteo.push("/login");
},501);

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
                mostrarMensaje("Login Exitoso, bienvenido " + usuario,2500);
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


function obtenerActividades(){
    fetch(urlBase+"actividades.php",
        {   method:"GET",
            headers:{
            "Content-type":"application/json",
            "apiKey": localStorage.getItem("apiKey"),
             "iduser": localStorage.getItem("id")
            },
            
        })
        .then (function(response){
            return response.json();
        })
        .then(function(datos){
            let options= "";
            datos.actividades.forEach(element => {
                options+=`<ion-select-option value=${element.id}>${element.nombre}</ion-select-option>`
            });
            document.querySelector("#slcActividad").innerHTML=options;
        })
        .catch(e=> console.log(e));

}