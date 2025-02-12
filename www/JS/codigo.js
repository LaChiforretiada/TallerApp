agregarEvento();
function agregarEvento(){
    document.querySelector("#ruteo").addEventListener("ionRouteWillChange",navegar);

}
function cerrarMenu(){
    document.querySelector("#menu").close();
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

