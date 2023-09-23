# Manual Técnico (Proyecto 1 Sistemas Operativos 1 "N")

## Introducción

<p style="text-align: justify;">
Dentro del primer proyecto del laboratorio de Sistemas Operativos 1, fue realizada tanto por medio de la utilización de maquinas virtuales GCP Compute Engine de Google Cloud, las aplicaciiones realizadas para dichas máquinas fueron módulos para el escaneo del Kernel del sistema operativo de las mísmas y un backend para el envio y recibimiento de información, en de las cuales los módulos fueron creados por medio del lenguaje de programación C++ y tambien para su compilado la utilización de Markdown para ejecutar dichos módulos, utilizando diferentes métodos para la obtención de la información pedida para dicho proyecto, Mediante el cúal se hizo un Backend en el lenguaje de programación Go (Golang) para la obtención de la información de los módulos; En el ordenador se creó para la plataforma de monitoreo un backend en NodeJS por medio de peticiones de React para conectar y hacer peticiones al backend de Go y este mismo enviaba y hacia peticiones a la base de datos de MySQL para posteriormente recibir la información de React.<br/><br/>

Se empleo el lenguaje de C++ como herramienta en la función de las de monitoreo y obtención de información del Sistema Operativo de la maquina virtual, que por medio del Backend de Go se creaba un archivo tanto para el CPU como para la memoria RAM en las cuales se sobreescribia la información con respecto al tiempo; de las cuales por medio de NodeJS se hacían peticiones al backend de GO para la obtención de la información, enviarla a la base de datos de MySQL y posteriormente por medio de una petición 'GET' de React enviarle la información a tiempo real para la monitorización de la máquina virtual (2 máquinas fueron creadas para el proyecto de GCP, teniendo para Autoscaling otras 2 que se crearían al utilizar cierto porcentaje del CPU de las máquinas virtuales), el proyecto cuenta con peticiones GET y DELETE; en donde la plataforma de React puede hacer peticiones para tambien eliminar procesos de la MV y obtener los procesos actuales y por medio de otra pagina para poder ver los registros a lo largo del tiempo tanto de la memoria RAM como del CPU.<br/><br/>

Se pudo determinar que la implementación de los módulos y el almacenamiento de la información obtenida en cada una de ellos no mostro ningún problema durante su ejecución.
</p>

## Requisitos del Sistema

>- **_Sistema Operativo:_** Ubuntu 20.04 o superior
>- **_Kernel Utilizado:_** linux-headers-6.2.0-32-generic
>- **_CPU:_** Intel Pentium D o AMD Athlon 64 (K8) 2.6GHz. (Requisitos Mínimo)
>- **_RAM:_** 600MB
>- **_Lenguajes Utilizados:_** C++, Go, Markdown, JavaScript
>- **_Base de Datos:_** MySQL
>- **_Contenedores:_** Docker
>- **_IDE:_** Visual Studio Code
>- **_USO de Framework (Backend):_** NodeJS
>- **_USO de Framework (Fronted):_** React

## Requisitos del Proyecto:

### NodeJS

>- **_"axios":_** "^1.5.0"
>- **_"cors":_** "^2.8.5"
>- **_"dotenv":_** "^16.3.1"
>- **_"express":_** "^4.18.2"
>- **_"mysql":_** "^2.18.1"
>- **_"mysql2":_** "^3.6.1"

### React (dependencies):

>- **_"@testing-library/jest-dom":_** "^5.16.5"
>- **_"@testing-library/react":_** "^13.4.0"
>- **_"@testing-library/user-event":_** "^13.5.0"
>- **_"axios":_** "^1.4.0"
>- **_"body-parser":_** "^1.20.2"
>- **_"chart.js":_** "^4.4.0"
>- **_"fusioncharts":_** "^3.20.0"
>- **_"react":_** "^18.2.0"
>- **_"react-chartjs-2":_** "^5.2.0"
>- **_"react-dom":_** "^18.2.0"
>- **_"react-draggable"_**: "^4.4.5"
>- **_"react-fusioncharts":_** "^4.0.0"
>- **_"react-graphviz":_** "^0.7.0"
>- **_"react-scripts":_** "5.0.1"
>- **_"web-vitals":_** "^2.1.4"

### React (devDependencies):

>- **_"@types/d3":_** "^7.4.0"
>- **_"@types/d3-graphviz":_** "^2.6.7"
>- **_"@types/file-saver":_** "^2.0.5"
>- **_"@types/lodash":_** "^4.14.182"
>- **_"@types/node":_** "^16.18.23"
>- **_"@types/react":_** "^18.0.35"
>- **_"@types/react-anchor-link-smooth-scroll":_** "^1.0.2"
>- **_"electron":_** "^24.8.3"
>- **_"fs-extra":_** "^11.1.1"
>- **_"path-browserify":_** "^1.0.1"
>- **_"tslint":_** "^5.12.1"
>- **_"webpack-cli":_** "^5.0.2"

## Explicación del Código

### Módulos C++

#### Módulo CPU

Mediante la función de obtener calculate_cpu_usage

```
static unsigned long calculate_cpu_usage(void) {
    char buf[256];
    struct file *file;
    unsigned long total_time, idle_time;

    file = filp_open("/proc/stat", O_RDONLY, 0);
    if (!file)
        return 0;

    kernel_read(file, buf, sizeof(buf), &file->f_pos);
    filp_close(file, NULL);

    sscanf(buf, "cpu %lu %lu %lu %lu %lu %lu %lu %lu", &user, &nice,
           &system, &idle, &iowait, &irq, &softirq, &steal);
    
    total_time = user + nice + system + idle + iowait + irq + softirq + steal;
    idle_time = idle + iowait;

    return 100 * (total_time - idle_time) / total_time;
}
```

#### Módulo RAM

```
```