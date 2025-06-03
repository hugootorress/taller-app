# Taller App

Aplicación Fullstack para la gestión de un taller mecánico, desarrollada con **Laravel** (backend/API RESTful) y **Angular** (frontend SPA). Incluye autenticación, gestión de mecánicos, clientes, vehículos, reparaciones y piezas, así como integración con base de datos MariaDB y panel de administración phpMyAdmin.

## Características principales

- **Backend Laravel**
  - API RESTful para todas las entidades: mecánicos, clientes, vehículos, reparaciones, piezas.
  - Autenticación y autorización con roles (admin/mecánico).
  - Migraciones y seeders automáticos.
  - Seeder que crea un usuario administrador por defecto (`admin@example.com` / `password`).
  - Gestión de relaciones entre entidades (por ejemplo, un mecánico puede tener varias reparaciones).
  - Uso de Eloquent ORM y controladores estructurados.

- **Frontend Angular**
  - SPA moderna y responsiva.
  - Login y registro de usuarios.
  - Panel de administración para gestionar mecánicos, clientes, vehículos, reparaciones y piezas.
  - Consumo de la API Laravel.
  - Manejo de errores y validaciones.

- **Docker & DevOps**
  - Contenedores para backend, frontend, base de datos y phpMyAdmin.
  - El backend ejecuta migraciones y seeders automáticamente al iniciar.
  - Acceso a la base de datos mediante phpMyAdmin.

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

## Instalación y despliegue

### Requisitos previos
- Docker y Docker Compose instalados
- (Opcional) Node.js y Composer si quieres desarrollo local sin Docker

### Pasos para levantar el proyecto

1. **Clona el repositorio**
   ```sh
   git clone https://github.com/hugootorress/taller-app.git
   cd taller-app
   ```

2. **Copia los archivos locales sobre el repositorio clonado**
   - Copia todo el contenido de tu carpeta local actual (`taller_app`) dentro de la carpeta del repositorio clonado (`taller-app`).
   - Puedes hacerlo manualmente o con un comando como:
     ```sh
     xcopy /E /I /Y ..\taller_app\* .
     ```
     (Asegúrate de estar en la carpeta del repo clonado antes de ejecutar el comando)

3. **Haz commit y sube los cambios**
   ```sh
   git add .
   git commit -m "Se rehace la estructura del proyecto mejorando despliegue y documentación"
   git push origin main
   ```
   (Si tu rama principal se llama `master`, reemplaza `main` por `master`)

4. **Levanta los contenedores**
   ```sh
   docker-compose up -d
   ```
   Esto levantará:
   - Backend Laravel en `http://localhost:8000`
   - Frontend Angular en `http://localhost:4200`
   - MariaDB en el puerto `3306`
   - phpMyAdmin en `http://localhost:8080`

5. **Acceso a la base de datos**
   - Usuario: `root`
   - Contraseña: (vacía o la definida en el `docker-compose.yml`)
   - Base de datos: `taller`
   - Puedes acceder a través de [phpMyAdmin](http://localhost:8080)

6. **Usuario administrador por defecto**
   - Email: `admin@example.com`
   - Contraseña: `password`
   - Precio/hora: 15€
   - Rol: admin

7. **(Opcional) Desarrollo local**
   - Backend: `cd backend && composer install && npm install && cp .env.example .env && php artisan key:generate`
   - Frontend: `cd frontend && npm install && ng serve`

## Notas técnicas
- El backend ejecuta automáticamente las migraciones y seeders al iniciar el contenedor (ver `CMD` en el Dockerfile).
- Si cambias las migraciones, puedes reiniciar el backend con:
  ```sh
  docker-compose restart backend
  ```
- Si necesitas resetear la base de datos:
  ```sh
  docker-compose exec backend php artisan migrate:fresh --seed --force
  ```

## Tecnologías usadas
- **Backend:** Laravel, PHP 8.2, MariaDB
- **Frontend:** Angular
- **DevOps:** Docker, Docker Compose
- **Otros:** phpMyAdmin

## Autoría
- Proyecto realizado para 2º DAW
- Autor: Hugo Torres Varela

---

¡Listo para usar y ampliar según las necesidades de tu taller!
