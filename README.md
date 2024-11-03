<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# CULTURA GASTRONÓMICA API

## Pasos para correr el proyecto localmente
1. Clonar proyecto
2. ``` npm install ```
3. Clonar archivo ``` env.template ``` Y renombrarlo a ``` .env  ```
4. Cambiar las variables de entorno de ser necesario.
5. Levantar la base de datos
```
  docker-compose up -d
```
6. Levantar la aplicación localmente: ``` npm run start:dev ```


## Pasos para ejecutar request de colecciones Postman
1. Importar cada colección en Postman
2. Para cada colecciones se dejó disponible un request de login el cual crea el token y este se convierte en una variable usada por los demás request
3. Antes de ejecutar cualquier request de las colecciones es necesario ejecutar el login.


# Enlaces de interés

[Jenkins](http://157.253.238.75:8080/jenkins-misovirtual/). Para tener acceso deben iniciar sesión con su usuario de GitHub.
 
[Sonar](http://157.253.238.75:8080/sonar-misovirtual/). No se requieren crededenciales de acceso.

