# Dockerfile para backend Laravel + Apache
FROM php:8.2-apache

# Instala extensiones necesarias de PHP y utilidades
RUN apt-get update \
    && apt-get install -y libpng-dev libonig-dev libxml2-dev zip unzip git curl mariadb-client npm \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Habilita mod_rewrite de Apache
RUN a2enmod rewrite

# Copia los archivos del proyecto
COPY . /var/www/html

# Sobrescribe la configuración de Apache para usar public como DocumentRoot
COPY 000-default.conf /etc/apache2/sites-enabled/000-default.conf

# Instala Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Instala dependencias de PHP y Node
WORKDIR /var/www/html
RUN composer install --no-interaction --prefer-dist --optimize-autoloader \
    && npm install && npm run build

# Permisos para Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

# Ejecutar migraciones y seeders al iniciar el contenedor
CMD php artisan migrate --force && php artisan db:seed --force && apache2-foreground
