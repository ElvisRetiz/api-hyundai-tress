# API Service

### Prerrequisitos
  - Node.js
  - PM2

### Arrancar el servicio
  1. Abrir la consola y ubicarse en la carpeta del servicio
  2. Ejecutar el comando: PM2 start api-service.exe --name api --log "LOCATION/api-service/logs/api.log" --log-date-format "YYYY-MM-DD hh:mm:ss"
  3. Para validar, ingresar a http://localhost:PORT/api/
  
### Archivos de log y monitoreo
Para el monitoreo de la aplicacion existe una carpeta con nombre "logs", dentro de la carpeta del servicio, donde se almacenaran los mensajes de salida de la aplicacion tras cada proceso.

De manera independiente se pudiera monitorear desde consola ejecutando el comando: pm2 logs api 

### Estructura general de la aplicacion
api-service //*carpeta principal*
    |-api-service.exe //*ejecutable del servicio*
    |-assets //*carpeta para los assets de la aplicacion*
    |-config //*carpeta para los archivos de configuracion*
    |-logs //*carpeta para los archivos de log*
    |-node_modules 
    |-app.key
    |-package.json
    |-package-lock.json