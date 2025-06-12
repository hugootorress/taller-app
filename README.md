# Taller App

Aplicación Fullstack para la gestión de un taller mecánico, desarrollada con **Laravel** (backend/API RESTful) y **Angular** (frontend SPA). El despliegue está totalmente dockerizado y preparado para producción en un servidor Linux (por ejemplo, AWS EC2), usando nginx-proxy y Let's Encrypt para HTTPS. El frontend es el único punto público, y el backend solo es accesible internamente por Docker.

## Características principales

- **Backend Laravel**
  - API RESTful para todas las entidades: mecánicos, clientes, vehículos, reparaciones, piezas.
  - Autenticación y autorización con roles (admin/mecánico) usando Laravel Sanctum (API tokens).
  - Migraciones y seeders automáticos al iniciar el contenedor.
  - Seeder que crea un usuario administrador por defecto (`admin@example.com` / `password`).
  - Gestión de relaciones entre entidades.
  - CORS abierto para permitir acceso desde el frontend.
  - El backend NO es accesible directamente desde Internet, solo desde la red interna de Docker.

- **Frontend Angular**
  - SPA moderna y responsiva.
  - Login y registro de usuarios.
  - Panel de administración para gestionar mecánicos, clientes, vehículos, reparaciones y piezas.
  - Todas las llamadas a la API se hacen vía `/api` (proxy nginx), evitando problemas de CORS y mixed content.
  - Manejo de errores y validaciones.

- **Docker & DevOps**
  - Contenedores para backend (Laravel+Apache), frontend (Angular+nginx), base de datos (MariaDB), phpMyAdmin, nginx-proxy y acme-companion (Let's Encrypt).
  - nginx-proxy gestiona el dominio público y el certificado SSL automáticamente.
  - El backend solo es visible para el frontend y otros servicios internos.
  - Seguridad reforzada: solo los puertos 80/443 están abiertos en el firewall/SG de AWS.

## Despliegue en producción (resumen de lo realizado)

- Se desplegó en una instancia EC2 de AWS (Ubuntu), abriendo solo los puertos 22 (SSH), 80 y 443.
- Se configuró `docker-compose.yml` para que solo el frontend sea público, y el backend solo accesible por la red interna de Docker.
- nginx-proxy y acme-companion gestionan el dominio y el certificado SSL de Let's Encrypt.
- El frontend expone el dominio público (por ejemplo, `https://tallermatehtorres.zapto.org`), y todas las peticiones `/api` se redirigen internamente al backend.
- El backend ejecuta migraciones y seeders automáticamente al iniciar el contenedor.

## Estructura del proyecto

```
taller_app/
├── backend/         # Laravel API
│   ├── app/         # Modelos, controladores, etc.
│   ├── database/    # Migraciones y seeders
│   ├── public/      # DocumentRoot
│   ├── routes/      # Rutas API/web
│   ├── Dockerfile   # Docker backend
│   └── ...
├── frontend/        # Angular SPA
│   ├── src/         # Código fuente Angular
│   ├── Dockerfile   # Docker frontend
│   └── ...
├── docker-compose.yml
└── README.md
```

## Instalación y despliegue local (desarrollo)

1. Clona el repositorio y copia tu `.env` en `backend/`.
2. Ejecuta:
   ```sh
   docker-compose up -d --build
   ```
3. Accede al frontend en `http://localhost` (o el dominio configurado).

## Despliegue en servidor (producción)

1. Sube el proyecto a tu servidor (por ejemplo, EC2 Ubuntu).
2. Configura tu dominio y apunta el DNS a la IP pública del servidor.
3. Ajusta el archivo `.env` en `backend/` para producción (DB, mail, etc).
4. Ejecuta:
   ```sh
   docker-compose up -d --build
   ```
5. nginx-proxy y acme-companion gestionarán el certificado SSL automáticamente.
6. El frontend será accesible por HTTPS y todas las llamadas a `/api` funcionarán de forma segura.

## Seguridad
- Solo el frontend es público.
- El backend y la base de datos solo son accesibles internamente.
- Certificados SSL automáticos con Let's Encrypt.
- Firewall/Security Group solo permite 22, 80 y 443.

---

¡Listo para usar y ampliar según las necesidades de tu taller!
