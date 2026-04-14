// ================================
// PRUEBAS PARA APP DEL CLIMA
// ================================

/**
 * Prueba 1: Ciudad válida
 * Espera obtener datos correctos sin error
 */
async function pruebaCiudadValida() {
    console.log("🧪 Prueba: Ciudad válida");

    const resultado = await obtenerClimaPorCiudad("coacalco");

    if (!resultado.error) {
        console.log("✅ Éxito:", resultado);
    } else {
        console.error("❌ Falló:", resultado.mensaje);
    }
}


/**
 * Prueba 2: Ciudad inválida
 * Espera recibir error
 */
async function pruebaCiudadInvalida() {
    console.log("🧪 Prueba: Ciudad inválida");

    const resultado = await obtenerClimaPorCiudad("ciudad_inexistente_123");

    if (resultado.error) {
        console.log("✅ Error controlado:", resultado.mensaje);
    } else {
        console.error("❌ No detectó error:", resultado);
    }
}


/**
 * Prueba 3: Entrada vacía
 * Espera error por validación
 */
async function pruebaEntradaVacia() {
    console.log("🧪 Prueba: Entrada vacía");

    const resultado = await obtenerClimaPorCiudad("");

    if (resultado.error) {
        console.log("✅ Validación correcta:", resultado.mensaje);
    } else {
        console.error("❌ Falló validación:", resultado);
    }
}


/**
 * Prueba 4: Cache funcionando
 * Segunda llamada debe usar cache
 */
async function pruebaCache() {
    console.log("🧪 Prueba: Cache");

    console.log("➡ Primera llamada (API)");
    await obtenerClimaConCache("coacalco");

    console.log("➡ Segunda llamada (debería usar cache)");
    await obtenerClimaConCache("coacalco");
}


// ================================
// EJECUTAR PRUEBAS
// ================================
async function ejecutarPruebas() {
    await pruebaCiudadValida();
    await pruebaCiudadInvalida();
    await pruebaEntradaVacia();
    await pruebaCache();
}

// Ejecutar todas las pruebas
ejecutarPruebas();