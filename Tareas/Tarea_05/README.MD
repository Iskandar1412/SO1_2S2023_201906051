## Conectar por SSH a la Máquina Virtual

1. Al crear la máquina virtual de compute engine (antes de) en el ordenador secundario hacer lo siguiente:
   1. `sudo apt-get install openssh-server`
   2. `sudo apt-get install openssh-client`
   3. `sudo systemctl restart ssh`
<br/><br/>
2. Crear Keygen o ssh para la maquina virtual (poder conectarse)
   1. `ssh-keygen -t rsa -b 4096 -C "<Correo>"`
      1. `ssh-keygen -t rsa -b 4096 -C "3005375220101@ingenieria.usac.edu.gt"`
   2. `cat ~/.ssh/id_rsa.pub`
      1. Copiar el contenido en el portapapeles y eso se usará para la ssh de la máquina virtual
<br/><br/>
3. Para la Maquina Virtual (Cloud)
   1. Ir a opciones avanzadas -> Seguridad -> Administrar Acceso
   2. En donde está `Agrega Claves SSH generadas de forma manual`
      1. En agregar elemento se pega lo del `id_rsa.pub`
   3. El resto de la configuración es al gusto (aunque preferible por cualquier otro proyecto activar el trafico de HTTP y HTTPS)
   4. Se crea la máquina:
      1. `sudo apt update`
      2. `sudo apt upgrade`
      3. `sudo apt install python3 python3-pip`
      4. `pip3 install flask`
      5. `pip3 install flask-cors`
<br/><br/>
4. Para que se pueda conectar por SSH
   1. `sudo chmod 700 ~/.ssh`
   2. `touch ~/.ssh/authorized_keys`
   3. `echo "<contenido id_rsa.pub>" >> ~/.ssh/authorized_keys`
   4. `sudo chmod 600 ~/.ssh/authorized_keys`
<br/><br/>
5. Ajustar Firewall
   1. En el menu de navegación de google Cloud (las tres barras horizontales) buscar la opcion de Firewall:
      1. Esta en `Red de VPC` -> `Firewall`
   2. Creamos 2 nuevas reglas de Firewall (El nombre puede ser cualquiera pero para tener idea `all-in` & `all-out` se usaran)
      1. La primera (Entrada)
         1. Donde está la `Dirección de Trafico` queda en `Entrada`
         2. En `Destinos` seleccionar `Todas las Intancias de Red`
         3. En `Rangos de IPv4 de origen` poner `0.0.0.0/0`
         4. y en `protocolos` y puertos poner `Permitir todo`
      2. La segunda (Salida)
         1. Donde está la `Dirección de Trafico` queda en `Salida`
         2. En `Destinos` seleccionar `Todas las Intancias de Red`
         3. En `Rangos de IPv4 de origen` poner `0.0.0.0/0`
         4. y en `protocolos` y puertos poner `Permitir todo`
   3. Ahora iremos a donde está nuestra instancia de VM y la seleccionamos
      1. Click en la opción de `Editar`
      2. Buscamos donde están las `Etiquetas de Red`
         1. Agregamos `all-in` & `all-out`
<br/><br/>
6. Conectar desde el pc secundario
   1. `ssh ~/.ssh/id_rsa <USUARIO>@<IP_EXTERNA>`
   2. En caso de no saber el usuario que tienes
      1. `whoami`
<br/><br/>
7. Correr aplicacion y obtener PID
   1. `python3 <aplicacion>.py &`
   2. `ps aux  | grep python` (Para ver los procesos corridos por python)
<br/><br/>
8. Eliminar proceso
   1. `kill -9 <PID_Proceso>`