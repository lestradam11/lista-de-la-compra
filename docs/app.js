//------------------------------------//
// -----*** Variable globales ***-----//
//------------------------------------//

const formularioUI = document.querySelector('#form_nuevoproducto'); // cargamos el formulario
const listaProductosUI = document.querySelector('#listaProductos'); // cargamos  la lista de la compra
let arrayProductos = []; // array donde se va a almacenar los productos que se introduzcan

//------------------------------------//
// ---------*** Funciones ***---------//
//------------------------------------//

// funcion que crea el item con el producto introducido
const CrearItem = (producto, cantidad) => {
    // creamos el el objero(item) con los datos recibidos
    producto = producto.toLowerCase();
    let item = {
        producto: producto,
        cantidad: cantidad,
        estado: false
    }
    arrayProductos.push(item); // agregamos el item al array
    return item;
}

// funcion para guardar los resultados
const GuardarDB = () => {
    localStorage.setItem('compra', JSON.stringify(arrayProductos)); // almacenamos el array en localStorage en 'compra' como string en formato JSON
    PintarDB(); // Pintamos el resultado en los alert
}

// funcion que pinta el arrayProductos en los alerts
const PintarDB = () => {
    listaProductosUI.innerHTML = ''; // primero borramos el contenido del espacio de codigo donde luego pintaremos la lista

    arrayProductos = JSON.parse(localStorage.getItem('compra')); // leemos 'compra' para extraer la informacion

    // para que no de error filtramos si el array es null creamos un array vacia
    if(arrayProductos === null){
        arrayProductos = [];
    }else{ // y si no es asi agregamos
        arrayProductos.forEach(element => {
            // PROBAR HACIENDO ETA CONDICION CON SWITCH
            // SI el estado es false -> alert danger(rojo) 
            // SINO(true) -> alert success(verde)
            if (!element.estado) {
                listaProductosUI.innerHTML += `<div class="alert alert-danger" role="alert"><span class="badge badge-light mr-2">${element.cantidad}</span><b class="text-uppercase">${element.producto}</b><span class="float-right"><span class="material-icons">check</span><span class="material-icons">delete</span></span></div>`
            } else {
                listaProductosUI.innerHTML += `<div class="alert alert-success" role="alert"><span class="badge badge-light mr-2">${element.cantidad}</span><b class="text-uppercase">${element.producto}</b><span class="float-right"><span class="material-icons">check</span><span class="material-icons">delete</span></span></div>`
            }
        });
    }
}

const BorrarDB = (producto) => {
    // funcion para borrar producto de la lista cuando se presiona en el boton de borrar
    let indexArray;
    arrayProductos.forEach( (elemento, index) => { // elemento e index son los parametros de cada vuelta
        if (elemento.producto === producto) { // si el elemento.producto de esa vuelta es igual al que recibimos
            indexArray = index; // nos guardamos el index
        }
    });
    arrayProductos.splice(indexArray,1); // splice elimina elementos del objeto (arrayProductos) el uno es el numero de elementos que queremos que elimine
    GuardarDB();
}
const CambiarEstadoDB = (producto) => {
    // funcion para cambiar el estado del producto a verde si se presiona el check
    let indexArray =  arrayProductos.findIndex((elemento) => elemento.producto === producto); // localizamos el index del producto recibido
    arrayProductos[indexArray].estado = true; // cambiamos el estado a true
    GuardarDB();
}

//------------------------------------//
// ----------*** Eventos ***----------//
//------------------------------------//

// evento que escucha el boton "agregar"
formularioUI.addEventListener('submit', (e) => {
    e.preventDefault(); // funcion para que no refresque el sitio web
    let productUI = document.querySelector('#inProduct').value; // cargamos el producto introducido
    let quantityUI = document.querySelector('#inQuantity').value; // cargamos la cantidad introducida
    CrearItem(productUI, quantityUI); // agregar el nuevo producto
    GuardarDB(); // guardamos el nuevo producto al array
    formularioUI.reset(); // limpiamos el formulario
});

document.addEventListener('DOMContentLoaded', PintarDB); // Para que lea el local storage lo primero y no se borre al agregar uno nuevo al refrescar la pagina

listaProductosUI.addEventListener('click', (e) => {
    e.preventDefault();// esta funcion es para que no refresque el sitio web
    //console.log(e);
    // condicion necesaria para que solo realice accion si pulsamos en uno de esos dos botones y no fuera de los botones
    if (e.target.innerHTML === 'delete' || e.target.innerHTML === 'check') {
        // almacenamos en 'texto' el nombre del producto correspondiente del boton que se haya clickeado
        let texto = e.target.offsetParent.children[1].innerHTML;
        if (e.target.innerHTML === 'delete') {
            // Si el boton que se ha pulsado es la papelera entonces borramos el producto de la pila
            BorrarDB(texto); // le mandamos texto para saber que tarjeta modificar
        }
        if (e.target.innerHTML === 'check') {
            // Si el boton que se ha pulsado es el del check entonces cambiamos el estado del producto
            CambiarEstadoDB(texto); // le mandamos texto para saber que tarjeta modificar
        }
    }
})

