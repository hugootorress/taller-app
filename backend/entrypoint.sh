#!/bin/sh

# Arreglar permisos de storage y bootstrap/cache
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Generar clave de aplicación si no existe
if ! grep -q "^APP_KEY=" .env || [ -z "$(php artisan key:env)" ]; then
  php artisan key:generate --force
fi

# Esperar a que MariaDB esté disponible
until mysql -hmariadb -utalleruser -ptallerpass -e 'select 1' taller; do
  echo "Esperando a que MariaDB esté listo..."
  sleep 2
done

# Ejecutar migraciones y seeders
php artisan migrate --force && php artisan db:seed --force

# Iniciar Apache en primer plano
apache2-foreground
