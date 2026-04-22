# Prueba Técnica Frontend — Lumé

Catálogo de productos desarrollado con HTML, CSS y JavaScript Vanilla.

## Cómo ejecutar el proyecto

1. Clonar el repositorio o descarga el archivo .zip
2. Abrir el archivo index.html directamente en el navegador
3. No requiere instalación ni dependencias

## Explicación de la solución

Desarrollé Lumé, un catálogo de productos que consume la API pública de DummyJSON.

**Diseño:** Diseñé una identidad visual propia con una paleta de colores cálida. 
Usé CSS Grid y Flexbox para que el catálogo se adapte correctamente a distintos tamaños de pantalla.

**Tecnologías:** HTML, CSS y JavaScript Vanilla, tal como lo indica el documento.

**Filtrado local (Opción B):** Elegí realizar el filtrado de forma local. Al cargar inicialmente 100 productos, el usuario puede 
buscar y filtrar categorías al instante sin esperar peticiones de red adicionales, lo que optimiza la experiencia de uso.

**Extras implementados:**
- Filtro por categoría 
- Ordenamiento por precio (menor a mayor / mayor a menor)
- Botón para limpiar la búsqueda
- Manejo de estados: cargando, error y sin resultados
