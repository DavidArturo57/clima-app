// ================================
// CONSTANTE GLOBAL
// ================================
// Mapa de códigos de clima a descripciones en español
const DESCRIPCIONES_CLIMA = {
    0: "Soleado",

    1: "Mayormente soleado", 
    2: "Parcialmente nublado",
    3: "Nublado",

    45: "Niebla",
    48: "Niebla con escarcha",

    51: "Llovizna ligera",
    53: "Llovizna moderada",
    55: "Llovizna intensa",

    56: "Llovizna helada ligera",
    57: "Llovizna helada intensa",

    61: "Lluvia ligera",
    63: "Lluvia moderada",
    65: "Lluvia fuerte",

    66: "Lluvia helada ligera",
    67: "Lluvia helada intensa",

    71: "Nieve ligera",
    73: "Nieve moderada",
    75: "Nieve fuerte",

    77: "Granizo",

    80: "Chubascos ligeros",
    81: "Chubascos moderados",
    82: "Chubascos fuertes",

    85: "Nevadas ligeras",
    86: "Nevadas fuertes",

    95: "Tormenta",
    96: "Tormenta con granizo ligero",
    99: "Tormenta con granizo fuerte"
};

// ================================
// CACHE (localStorage - 1 hora)
// ================================

// Tiempo de vida del cache (TTL = Time To Live)
// 60 min * 60 seg * 1000 ms = 1 hora
const CACHE_TTL = 60 * 60 * 1000; 

// Prefijo para identificar las claves en localStorage
const CACHE_PREFIX = "clima_";

// ================================
// FUNCIONES DE CACHE
// ================================

/**
 * Obtiene datos almacenados en localStorage para una ciudad.
 * 
 * Flujo:
 * 1. Busca el registro en localStorage usando la clave
 * 2. Si no existe, retorna null
 * 3. Si existe, valida si aún no ha expirado
 * 4. Si es válido, devuelve los datos
 * 5. Si expiró o hay error, elimina el registro
 */
function obtenerDeCache(ciudad) {

    // Construir la clave única para la ciudad
    const item = localStorage.getItem(CACHE_PREFIX + ciudad);

    // Si no existe nada en cache, retornar null
    if (!item) return null;

    try {
        // Convertir el string JSON a objeto
        const registro = JSON.parse(item);

        // Validar si el cache sigue vigente (no ha expirado)
        if (Date.now() - registro.timestamp < CACHE_TTL) {
            console.log("⚡ Datos obtenidos desde localStorage");
            return registro.data;
        }

        // Si el cache expiró, eliminarlo
        localStorage.removeItem(CACHE_PREFIX + ciudad);
        return null;

    } catch (error) {
        // Si ocurre un error al parsear, eliminar el registro corrupto
        localStorage.removeItem(CACHE_PREFIX + ciudad);
        return null;
    }
}

/**
 * Guarda datos en localStorage para una ciudad.
 * 
 * Flujo:
 * 1. Crea un objeto con los datos y la fecha actual
 * 2. Convierte el objeto a JSON
 * 3. Lo guarda en localStorage con una clave única
 */
function guardarEnCache(ciudad, data) {

    // Crear objeto con datos y timestamp
    const registro = {
        data: data,
        timestamp: Date.now()
    };

    // Guardar en localStorage como string JSON
    localStorage.setItem(CACHE_PREFIX + ciudad, JSON.stringify(registro));
}

// ================================
// FUNCIÓN: obtenerCoordenadas
// ================================
// Convierte el nombre de una ciudad en coordenadas (latitud y longitud)
async function obtenerCoordenadas(nombreCiudad) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nombreCiudad)}&count=1&language=es`;

    // Realiza la petición a la API de geocodificación
    const response = await fetch(url);

    // Verifica si la respuesta HTTP es válida
    if (!response.ok) {
        throw new Error("No se pudo conectar con el servicio de geocodificación");
    }

    // Convierte la respuesta a JSON
    const data = await response.json();

    // Valida que existan resultados para la ciudad
    if (!data.results || data.results.length === 0) {
        throw new Error("Ciudad no encontrada");
    }

    // Extrae latitud, longitud y nombre de la ciudad encontrada
    const { latitude, longitude, name } = data.results[0];

    return {
        latitude,
        longitude,
        nombreCiudad: name
    };
}

// ================================
// FUNCIÓN: obtenerClima
// ================================
// Consulta el clima actual usando latitud y longitud
async function obtenerClima(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    // Realiza la petición a la API del clima
    const response = await fetch(url);

    // Verifica si la respuesta HTTP es válida
    if (!response.ok) {
        throw new Error("No se pudo obtener la información del clima");
    }

    // Convierte la respuesta a JSON
    const data = await response.json();

    // Valida que existan datos de clima
    // 🔹 MEJORA: validación más robusta de la respuesta
    if (!data.current_weather || typeof data.current_weather.temperature !== "number") {
        throw new Error("Respuesta inesperada de la API");
    }

    // Retorna el objeto de clima actual
    return data.current_weather;
}

// ================================
// FUNCIÓN: traducirCodigoClima
// ================================
// Convierte el código de clima en una descripción legible
function traducirCodigoClima(codigoClima) {
    // Si el código no existe, devuelve un mensaje con el código recibido
    return DESCRIPCIONES_CLIMA[codigoClima] ?? `Código desconocido (${codigoClima})`;
}

// ================================
// FUNCIÓN PRINCIPAL
// ================================
/**
 * Obtiene el clima actual de una ciudad a partir de su nombre.
 *
 * Flujo de la función:
 * 1. Valida el nombre de la ciudad proporcionado
 * 2. Obtiene las coordenadas (latitud y longitud) usando la API de geocodificación
 * 3. Consulta el clima actual con esas coordenadas
 * 4. Traduce el código de clima a una descripción legible
 * 5. Retorna un objeto con la información del clima o un error
 * 6. Maneja errores y retorna mensajes claros en caso de fallo
 * 
 * @async
 * @function obtenerClimaPorCiudad
 *
 * @param {string} nombreCiudad - Nombre de la ciudad a consultar (no vacío)
 *
 * @returns {Promise<Object>} Resultado con datos del clima o error // Objeto con el resultado de la operación:
 *
 * ✔ En caso de éxito:
 * {
 *   ciudad: string,
 *   temperatura: string,
 *   viento: string,
 *   descripcion: string
 * }
 *
 * ✖ En caso de error:
 * {
 *   error: true,
 *   mensaje: string
 * }
 *
 * @example
 * async function ejemplo() {
 *   const resultado = await obtenerClimaPorCiudad("Coacalco");
 *
 *   if (resultado.error) {
 *     console.error("Error:", resultado.mensaje);
 *   } else {
 *     console.log(`Clima en ${resultado.ciudad}`);
 *     console.log(`Temperatura: ${resultado.temperatura}`);
 *     console.log(`Viento: ${resultado.viento}`);
 *     console.log(`Estado: ${resultado.descripcion}`);
 *   }
 * }
 */
// Orquesta todo el proceso: ciudad → coordenadas → clima → resultado final
async function obtenerClimaPorCiudad(nombreCiudad) {
    try {
        // Validación básica de entrada
        if (!nombreCiudad || nombreCiudad.trim() === "") {
            throw new Error("Debes proporcionar el nombre de una ciudad");
        }
        
        // 🔹 MEJORA: normalizar ciudad para mejor cache
        const ciudadNormalizada = nombreCiudad.toLowerCase().trim();

        // 1. Obtener coordenadas de la ciudad
        const { latitude, longitude, nombreCiudad: ciudad } =
            await obtenerCoordenadas(ciudadNormalizada);

        // 2. Obtener datos del clima
        const clima = await obtenerClima(latitude, longitude);

        // 3. Extraer datos relevantes
        const { temperature, weathercode, windspeed } = clima;

        // 4. Validar que los datos sean correctos
        if (typeof temperature !== "number" || typeof windspeed !== "number") {
            throw new Error("Datos de clima inválidos");
        }

        // 5. Construir respuesta final
        return {
            ciudad,
            temperatura: `${temperature} °C`,
            viento: `${windspeed} km/h`,
            descripcion: traducirCodigoClima(weathercode)
        };

    } catch (error) {
        // Manejo centralizado de errores
        return {
            error: true,
            mensaje: error.message
        };
    }
}

// ================================
// FUNCIÓN CON CACHE (localStorage) obtenerClimaConCache
// ================================
/**
 * Obtiene el clima de una ciudad utilizando cache (localStorage).
 * 
 * Flujo:
 * 1. Busca si ya existen datos guardados en cache
 * 2. Si existen, los devuelve directamente (evita llamar a la API)
 * 3. Si no existen, consulta la API
 * 4. Guarda el resultado en cache para futuras consultas
 * 5. Devuelve el resultado final
 */
async function obtenerClimaConCache(ciudad) {

    // 🔹 MEJORA: normalizar ciudad
    const ciudadNormalizada = ciudad.toLowerCase().trim();

    // 1. Intentar obtener datos desde cache (localStorage)
    const cacheData = obtenerDeCache(ciudadNormalizada);

    // Si hay datos en cache, se retornan inmediatamente
    if (cacheData) {
        console.log("📦 Datos obtenidos desde cache");
        return cacheData;
    }

    // 2. Si no hay cache, llamar a la API para obtener datos actuales
    const resultado = await obtenerClimaPorCiudad(ciudad);

    // 3. Guardar en cache solo si la respuesta es válida (sin errores)
    if (!resultado.error) {
        guardarEnCache(ciudad, resultado);
    }

    // Indicar que los datos provienen de la API
    console.log("🌐 Datos obtenidos desde API");

    // 4. Retornar el resultado (ya sea exitoso o con error)
    return resultado;
}

// ================================
// EVENTO DEL BOTÓN
// ================================
// Maneja el clic del usuario para buscar el clima
document.getElementById("btnBuscar").addEventListener("click", async function () {

    const btn = document.getElementById("btnBuscar");

    // Obtener ciudad seleccionada del select
    const ciudad = document.getElementById("city").value;

    // Validar que el usuario seleccionó una ciudad
    if (!ciudad) {
        alert("Selecciona una ciudad");
        return;
    }

    // 🔹 MEJORA: bloquear botón (evita múltiples peticiones)
    btn.disabled = true;

    // 🔹 MEJORA: indicador de carga
    const elTemp = document.getElementById("temperature");
    const elWind = document.getElementById("wind");
    const elDesc = document.getElementById("description");

    elTemp.textContent = "Cargando...";
    elWind.textContent = "Cargando...";
    elDesc.textContent = "Cargando...";

    // Llamar a la función con caché
    const resultado = await obtenerClimaConCache(ciudad);

    // 🔹 MEJORA: habilitar botón
    btn.disabled = false;

    // Validar si hubo error
    if (resultado.error) {
        alert(resultado.mensaje);
        return;
    }

    // ================================
    // MOSTRAR RESULTADOS EN EL HTML
    // ================================
    document.querySelector("#weather-result h2").textContent = `Clima en ${resultado.ciudad}`;
    document.getElementById("temperature").textContent = `Temperatura: ${resultado.temperatura}`;
    document.getElementById("wind").textContent = `Viento: ${resultado.viento}`;
    document.getElementById("description").textContent = `Estado: ${resultado.descripcion}`;
});