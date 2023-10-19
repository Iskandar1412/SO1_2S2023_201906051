## Traffic Generator (Python)

> sudo apt install python3.10-venv <br/>
> python3 -m venv venv <br/>
> source venv/bin/activate <br/>
> pip install locust <br/>

### Correr Locust

> locust -f traffic_generator.py

#### Abrir Locust (Navegador)

> http://0.0.0.0:8089

#### Pide una dirección en la que se pone la dirección del cliente (En este caso es el gRPC Client)

> http://<host_del_cliente>:<puerto_del_coso>         `http://localhost:3255`

## Base De Datos de MySQL Cloud

- Ir a SQL (Tenemos en la parte superior izquierda 3 barras que dan un menu desplegable)
- Se crea una Instancia de MySQL
  - Información de Instancia:
    - Colocar ID y Contraseña (guardar contraseña)
  - Edición de Cloud SQL:
    - Enterprise
    - `Elige un ajuste predeterminado para esta edición. Los ajustes predeterminados se pueden personalizar más adelante según sea necesario`
      - Cambiar de Producción a Desarrollo
  - Se puede usar la zona horaria predeterminada
  - Personaliza tu Instancia:
    - Almacenamiento:
      - Puedes cambiar la cantidad de memoria que tiene
    - Protección de Datos:
      - Opciones Avanzadas:
        - Deseleccionar la casilla de `Habilitar protección contra la eliminación`
    - Conexiones:
      - Redes Autorizadas:
        - AGREGAR UNA RED:
          - Por medio de la página `ionos.es/tools/dirección-ip` poner tu IP para poder conectarte de lo contrario no se podrá conectar tu ordenador a la base de datos creada
          - Puedes agregar más de una IP (siempre publicas)
- Listo - Opcion de Crear Instancia y se espera a que se cree la instancia

## Conectar DBEAVER

- En nueva Conexión
  - Se sabe que es de MySQL
    - Pestaña `Driver Properties`
      - `allowPublicKeyRetrieval`: TRUE
    - Pestaña `General`
      - `Server Host`: Poner IP Publica de la DB (la que te de)
      - `Nombre de usuario`: root
      - `Contraseña`: Se pone la que la instancia
      - `Port`: 3306
    - Click en `Probar conexión...` y en caso que no de errores... listo conectate.

