# Proyecto Gestión de Taller

## Descripción

Este proyecto es una aplicación web para la **gestión de un taller mecánico**. Permite a los mecánicos autenticarse y gestionar clientes, vehículos, reparaciones y piezas. Cada reparación está asociada a un mecánico, cliente y vehículo, y se pueden generar facturas en PDF.

El objetivo es crear una herramienta sencilla, práctica y profesional para facilitar el control de las tareas diarias en un taller.

---

## Tecnologías utilizadas

- **Backend:** Laravel (API REST)  
- **Frontend:** Angular (Standalone Components)  
- **Base de datos:** MySQL  
- **Autenticación:** Sistema propio basado en el modelo `Mechanic`  
- **Despliegue:** Docker (para backend y base de datos)  
- **Otros:** Bash scripts para automatización, generación de PDFs para facturas  

---

## Funcionalidades principales

- Registro y login de mecánicos.  
- Gestión de clientes (crear, modificar, eliminar, listar).  
- Gestión de vehículos asociados a clientes.  
- Gestión de reparaciones vinculadas a mecánicos, clientes y vehículos.  
- Gestión de piezas con precios.  
- Cálculo automático del coste total de reparaciones.  
- Generación de facturas en formato PDF con diseño profesional.  
- Visualización de reparaciones propias para cada mecánico autenticado.  
- Visualización general de clientes y vehículos para todos los mecánicos.  

---

## Instalación

### Requisitos

- Docker y Docker Compose  
- Node.js y Angular CLI (para desarrollo frontend)  
- PHP >= 8.1  
- Composer  
- MySQL  

### Pasos para arrancar el proyecto

1. Clonar el repositorio:  
```bash
git clone https://github.com/tu_usuario/taller-app.git
cd taller-app
```
2. Configurar variables de entorno para Laravel (.env).

3. Levantar contenedores Docker para backend y base de datos:
```bash
docker-compose up -d
```
4. Ejecutar migraciones y seeders:
```bash
docker exec -it nombre_contenedor_php php artisan migrate --seed
```
5.Instalar dependencias y levantar frontend Angular:
```bash
cd frontend
npm install
ng serve
```
6.Acceder a la aplicación en el navegador:
http://localhost:4200

## Uso
- Regístrate o inicia sesión como mecánico.

- Accede al panel principal donde podrás ver tus reparaciones.

- Crea clientes y vehículos.

- Añade reparaciones asociando mecánico, cliente, vehículo y piezas.

- Visualiza el coste total y genera factura PDF para cada reparación.

## Contribuciones
Si quieres contribuir, por favor abre un issue o un pull request. Estaré encantado de revisar tus aportaciones.

## Contacto
hugales2005@gmail.com

Proyecto desarrollado para el curso de Desarrollo de Aplicaciones Web (DAW).




