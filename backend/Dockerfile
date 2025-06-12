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

# Copia configuración personalizada de PHP
# COPY php.ini /usr/local/etc/php/

# Instala dependencias de PHP y Node
WORKDIR /var/www/html
RUN composer install --no-interaction --prefer-dist --optimize-autoloader \
    && npm install && npm run build

# Permisos para Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data /var/www/html/public \
    && chown -R www-data:www-data /var/www/html/vendor \
    && chown -R www-data:www-data /var/www/html/app \
    && chown -R www-data:www-data /var/www/html/config \
    && chown -R www-data:www-data /var/www/html/resources \
    && chown -R www-data:www-data /var/www/html/routes \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap \
    && chmod -R 755 /var/www/html/public \
    && chmod -R 755 /var/www/html/vendor \
    && chmod -R 755 /var/www/html/app \
    && chmod -R 755 /var/www/html/config \
    && chmod -R 755 /var/www/html/resources \
    && chmod -R 755 /var/www/html/routes

EXPOSE 80

# Ejecutar migraciones y seeders al iniciar el contenedor
CMD php artisan migrate --force && php artisan db:seed --force && apache2-foreground
