## FUNCIONAMIENTO

<video src='https://drive.google.com/file/d/1mnV9PEcGuNS6zN7jOB6BCr_SWJcBWDHB/view?usp=drive_link' width="180"></video>

## Crear contenedor mysql (docker)

>sudo docker pull mysql<br/>
>sudo docker volume ls<br/>
>sudo docker volume prune<br/>
>sudo docker stop $(sudo docker ps -aq)<br/>
>sudo docker rm $(sudo docker ps -aq)<br/>
>sudo docker volume prune<br/>
>sudo docker volume ls<br/>
>sudo docker ps<br/>
>sudo docker run --name <nombre_contenedor (cualquiera)> -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=<contraseña> <nombre_imagen (mysql)><br/>
>sudo docker exec -it <nombre_contenedor> mysql -uroot -p<contraseña>

## Iniciar contenedor (cuando se reinicia ordenador)

>sudo docker start <imagen>

## Ver si el puerto está siendo utilizado

>sudo lsof -i <puerto><br/>
>>sudo lsof -i :3306

## Liberar o eliminar proceso en el puerto

>sudo kill -9 <PID>

- ver estado mysql

>sudo docker mysql status

- Reiniciar docker

>sudo service docker restart