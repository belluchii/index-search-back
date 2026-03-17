# Index Search — Backend

API REST del buscador de productos de Amazon con búsqueda full-text sobre un dataset de 500,000 productos.

🔗 [Demo en vivo](https://amazon-index-search.netlify.app/) · [Frontend](https://github.com/belluchii/index-search-front)

## ¿Qué es?

API que expone un índice de búsqueda sobre 500,000 productos de Amazon. Construida con Fastify y MongoDB, permite realizar búsquedas full-text de forma rápida y eficiente.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Fastify
- **Base de datos:** MongoDB (Mongoose)
- **Entorno:** dotenv

## Estructura del proyecto

```
├── controllers/   — Lógica de cada endpoint
├── db/            — Configuración de la base de datos
├── models/        — Esquemas de Mongoose
├── routes/        — Definición de rutas
├── services/      — Lógica de negocio
└── App.js         — Punto de entrada
```

## Requisitos

- Node.js >= 18.x
- MongoDB

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/belluchii/index-search-back.git
cd index-search-back
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear un archivo `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/index-search
```

4. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm start` | Inicia el servidor en producción |

## Repositorios relacionados

- [index-search-front](https://github.com/belluchii/index-search-front) — Frontend con Vue.js y Vite
