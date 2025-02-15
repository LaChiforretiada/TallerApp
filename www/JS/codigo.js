const urlBase = "https://movetrack.develotion.com/";
const urlImagenes = "https://movetrack.develotion.com/imgs/";
const ruteo = document.querySelector("#ruteo");

inicio();
function inicio() {
    ocultarPaginas();
    agregarEventos();
    obtenerPaises();
    if(localStorage.getItem("apiKey")!=null && localStorage.getItem("apiKey")!=undefined){
        mostrarMenu("logueado");
    }else{
        mostrarMenu("noLogueado");
    }
}


function agregarEventos(){
    document.querySelector("#ruteo").addEventListener("ionRouteWillChange",navegar);
    document.querySelector("#btnRegistro").addEventListener("click", registro);
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
    console.log(event);
    if(event.detail.to=="/"){
        document.querySelector("#home").style.display="block";
    }
    else if(event.detail.to=="/login"){
        document.querySelector("#login").style.display="block";
    }
    else if(event.detail.to=="/registro"){
        document.querySelector("#registro").style.display="block";
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
        validarDatosRegistro(usuario, password);
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
                mostrarMensaje("Registro exitoso");
                limpiarCamposRegistro("txtUsuarioRegistro","txtPasswordRegistro","slcPais");
                mostrarMenu("logueado");
                mostrarMensaje("Registro Exitoso",500);
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
function validarDatosRegistro(usuario, password) {
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



