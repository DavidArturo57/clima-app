# 🌤️ App del Clima

## 📌 Resumen del proyecto

Aplicación web sencilla que permite a los usuarios seleccionar una ciudad y consultar información meteorológica en tiempo real utilizando la API de Open-Meteo.

La aplicación muestra:

* 🌡️ Temperatura
* 🌬️ Velocidad del viento
* ⛅ Estado del clima

Incluye validaciones y manejo de errores para un funcionamiento confiable.

---

## ⚙️ Instrucciones de instalación

1. Descarga o clona el proyecto:

   ```bash
   git clone https://github.com/yourusername/clima-app.git
   ```

2. Abre la carpeta del proyecto en tu editor (VS Code recomendado)

3. Ejecuta el archivo `index.html` en tu navegador:

   * Doble clic
   * O usando Live Server

---

## 🚀 Guía de uso

1. Abre la aplicación en el navegador
2. Selecciona una ciudad del menú desplegable
3. Haz clic en **"Consultar Clima"**
4. Visualiza los resultados en pantalla

---

## 📊 Ejemplo de resultado

```
Clima en Coacalco
Temperatura: 22 °C
Viento: 10 km/h
Estado: Soleado
```

---

## ✅ Funcionalidades

* Selección de ciudad desde un menú
* Conversión de ciudad a coordenadas (Geocoding)
* Consulta de clima en tiempo real
* Visualización de:

  * Temperatura
  * Viento
  * Estado del clima
* Uso de iconos para mejorar la interfaz
* Traducción de códigos de clima a texto
* Código claro y estructurado

---

## ⚠️ Manejo de errores

La aplicación contempla los siguientes casos:

* ❌ Ciudad no seleccionada
* ❌ Ciudad no encontrada
* ❌ Error en la API
* ❌ Problemas de red
* ❌ Datos incompletos

En cada caso se muestra un mensaje claro al usuario.

---

## 🌐 Información de la API

Se utiliza la API gratuita de Open-Meteo:

### 🔹 Geocoding API

Convierte el nombre de la ciudad en coordenadas:

```
https://geocoding-api.open-meteo.com/v1/search
```

### 🔹 Weather API

Obtiene el clima actual:

```
https://api.open-meteo.com/v1/forecast
```

Parámetros principales:

* latitude
* longitude
* current_weather=true

---

## 📁 Estructura del proyecto

```
clima-app/
│
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── assets/
│   └── icons/
└── README.md
```

---

## 🔮 Mejoras futuras

* 🌤️ Iconos dinámicos según el clima
* 📍 Búsqueda por texto (input de ciudad)
* 📊 Mostrar más datos (humedad, presión, etc.)
* 📱 Diseño responsive
* ⏳ Indicador de carga
* 🧪 Pruebas automatizadas

---

## 👨‍💻 Autor

Proyecto desarrollado como práctica de consumo de APIs con JavaScript.
