/**
 * app.js — Lógica principal del catálogo de productos
 * Consume la API publica dada: https://dummyjson.com/products
 *
 * Funciones principales:
 *  - Carga inicial de productos (hasta 100)
 *  - Búsqueda local por nombre del producto
 *  - Filtro por categoría (generado dinámicamente)
 *  - Ordenamiento por precio (asc/desc)
 *  - Botón para limpiar búsqueda
 *  - Manejo de estados: loading, error, sin resultados
 */


//Guarda todos los productos cargados para el filtrado local 
let allProducts = [];  


// Carga inicial 
/**
 * En esta función se hace la carga inicial de los productos desde la API
 * Y se manejan los estados de carga y error. 
 * Si la carga es exitosa, se guardan los productos en el array allProducts
 * y se llama a la función categoryFilter para llenar el selector de categorías
 */
async function loadProducts() { 
    const loadingMsg = document.getElementById('estado-loading');
    const errorMsg = document.getElementById('estado-error');
    const container = document.getElementById('products-container');

    // Reset de interfaz
    loadingMsg.style.display = 'block';
    errorMsg.style.display = 'none';
    container.innerHTML = '';

    try { 
        // Opción B: Se cargan 100 productos para tener suficiente data para poder filtrar localmente
        const response = await fetch('https://dummyjson.com/products?limit=100');  
        if (!response.ok) throw new Error('Error al cargar los productos');

        const data = await response.json(); 
        allProducts = data.products;

        categoryFilter(allProducts); // Con los datos listos, se llena el selector de categorías

        loadingMsg.style.display = 'none'; // Oculta el mensaje de carga

        showCards(allProducts); // Muestra todos los productos cargados

    } catch (error) { // Si falla el fetch, se muestra el estado de error
        loadingMsg.style.display = 'none';
        errorMsg.style.display = 'block'; 
    }
}


// Filtros 
/**
 * En esta función se aplican los filtros de búsqueda, categoría y ordenamiento.
 * Cuando el usuario hace una busqueda o selecciona una categoria/precio,
 * la funcion agarra el valor de cada filtro y hace el filtrado local 
 * en el array de productos (allProducts), para luego mostrar los resultados ya filtrados
 */
function applyFilters() {
    const texto = document.getElementById('search-input');
    const query = texto.value.toLowerCase();

    // se busca la opcion que esté seleccionada
    const activeCategory = document.querySelector('#category-filter .active');
    const activeSort = document.querySelector('#sort-select .active');
    
    // Si no hay nada seleccionado, se le pone un valor vacío para no afectar el filtro
    let category = "";
    if (activeCategory) {
        category = activeCategory.getAttribute('data-value');
    }

    let sort = "";
    if (activeSort) {
        sort = activeSort.getAttribute('data-value');
    }

    // Aqui se hace el filtro por nombre
    let result = allProducts.filter(p => {
        return p.title.toLowerCase().includes(query);
    });

    // Aqui se filtra por categoria
    if (category !== "" && category !== null) {
        result = result.filter(p => {
            return p.category === category;
        });
    }

    // Aqui se ordena por precio
    if (sort === 'asc') {
        result.sort((a, b) => {
            return a.price - b.price;
        });
    } else if (sort === 'desc') {
        result.sort((a, b) => {
            return b.price - a.price;
        });
    }

    // Ya se actualizan los resultados con los filtros aplicados
    showCards(result);
}

/**
 * Esta funcion lo que hace es que genera las opciones de filtro
 * de categoria con los datos que devuelve la API
 */
function categoryFilter(products) {
    const list = document.getElementById('category-filter');
    const categories = [];

    // Aqui se extraen las categorias de loss productos y se guardan en el array 
    products.forEach(p => {
        if (!categories.includes(p.category)) {
            categories.push(p.category); // si la categoría no está en el array, se agrega
        }
    });

    categories.sort(); //ordeno alfabeticamnete

    // Se crean los elementos uno por uno
    categories.forEach(cat => {
        const li = document.createElement('li');
        li.classList.add('filter-option');
        li.setAttribute('data-value', cat); 
        li.textContent = cat.replace(/-/g, ' ').toUpperCase(); // quita los guiones
        list.appendChild(li);
    });
}


function showCards(productos) {
    const container = document.getElementById('products-container');
    const emptyMsg = document.getElementById('estado-empty');
    const count = document.getElementById('results-count');

    // Limpio el contenedor antes de agregar los resultados nuevos
    container.innerHTML = '';
    
    // Si el arreglo viene vacio se muestra el mensaje de que no hay nada
    if (productos.length === 0) {
        emptyMsg.style.display = 'block';
        count.style.display  = 'none';
        return;
    }

    // Si hay productos, se muestra el contador
    emptyMsg.style.display = 'none';
    count.style.display  = 'block';
    count.textContent = productos.length + " resultados encontrados";

    // Aqui se recorre el arreglo de productos para crear las tarjetas una por una
    productos.forEach(p => {
        const card = document.createElement('div'); // Se crea el elemento de la tarjeta
        card.classList.add('product-card');

        // Aqui se generan las estrellas de rating
        const fullStars = Math.round(p.rating); // Se redondea el valor para mostrar estrellas completas
        const emptyStars = 5 - fullStars;
        const starsHTML = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);

        // Inserto el contenido HTML de la tarjeta con los datos del producto
        card.innerHTML = `
        <img src="${p.thumbnail}" alt="${p.title}" />
        <div class="product-info">
            <span class="category-tag" data-category="${p.category}">
                ${p.category.toUpperCase()}
            </span>
            
            <h2>${p.title}</h2>
            
            <div class="meta-data">
                <span class="price">$${p.price}</span>
                <div class="rating">
                    <span>${starsHTML}</span>
                    <span class="rating-num">${p.rating}</span>
                </div>
            </div>
        </div>
`;
        container.appendChild(card);
    });
}


// Función para mostrar/ocultar el botón de limpiar búsqueda
function clearSearch() {
    const input = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-button');
    
    input.value = ''; // Se limpia el texto
    clearBtn.style.display = 'none'; // Aqu se esconde el boton x
    
    applyFilters(); // Se muestran de nuevo todos los productos al limpiar la búsqueda
    input.focus();
}

/**
 * Esta funcion sirve para que cuando se haga click en un filtro
 * se quite la clase active de los otros filtros del mismo tipo
 * y se le ponga la clase active al filtro clickeado, para luego aplicar los filtros
 */
function filterClick(list, item) {
    // Primero se le quita la clase 'active' a todos para que no haya varios seleccionados
    const allOptions = list.querySelectorAll('.filter-option');
    allOptions.forEach(li => li.classList.remove('active'));
    
    // Luego se la pongo solo al que el usuario le dio click
    item.classList.add('active');
    
    // Se llama a la función para aplicar los filtros con la nueva selección
    applyFilters();
}


// EVENTOS 

// Detecta cuando el usuario escribe en el buscador
document.getElementById('search-input').addEventListener('input', (e) => {
    const clearBtn = document.getElementById('clear-button');
    
    // Si escribió algo aparece la X para limpiar, si no, se oculta
    if (e.target.value.length > 0) {
        clearBtn.style.display = 'flex';
    } else {
        clearBtn.style.display = 'none';
    }

    // filtra automáticamente en cada letra que el usuario escribe
    applyFilters(); 
});

// Detecta la tecla Enter 
document.getElementById('search-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        applyFilters(); 
        e.target.blur(); // Esto quita el foco del input
    }
});

// Click en la X para limpiar la búsqueda
document.getElementById('clear-button').addEventListener('click', clearSearch);

// Click en las categorías, se usa delegación de eventos para manejar los clicks en las opciones 
document.getElementById('category-filter').addEventListener('click', (e) => {
    const li = e.target.closest('.filter-option');
    if (li) {
        filterClick(document.getElementById('category-filter'), li);
    }
});

// Click en el orden de precios
document.getElementById('sort-select').addEventListener('click', (e) => {
    const li = e.target.closest('.filter-option');
    if (li) {
        filterClick(document.getElementById('sort-select'), li);
    }
});

// Botón para intentar cargar de nuevo si hubo error en la carga inicial
document.getElementById('retry-button').addEventListener('click', loadProducts);

// Ejecución inicial al cargar la página
loadProducts();