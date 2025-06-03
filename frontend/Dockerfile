# Dockerfile para frontend Angular + Nginx
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps && npm run build

# Servir con Nginx
FROM nginx:1.25
# Copiar el build de Angular (carpeta browser) al root de Nginx
COPY --from=build /app/dist/todo-app-angular/browser /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
