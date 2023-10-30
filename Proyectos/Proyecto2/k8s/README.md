## Install Lens Kubernetes APP (Ubuntu)

> Get the Lens Desktop public security key and add it to your keyring:

```curl -fsSL https://downloads.k8slens.dev/keys/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/lens-archive-keyring.gpg > /dev/null```

> Add the Lens Desktop repo to your `/etc/apt/sources.list.d` directory.
>> Specify the `stable` channel

```echo "deb [arch=amd64 signed-by=/usr/share/keyrings/lens-archive-keyring.gpg] https://downloads.k8slens.dev/apt/debian stable main" | sudo tee /etc/apt/sources.list.d/lens.list > /dev/null```

> Install or update Lens Desktop:

```sudo apt update```

```sudo apt install lens```

> Run Lens Desktop

```lens-desktop```

## Instalación de Gcloud

- curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-367.0.0-linux-x86_64.tar.gz
- tar -xzvf <imagen>.tar.gz
  - `reiniciar terminal`
- gcloud --version
- gloud components install kubectl
- gcloud components update
- kubectl version

## Ver proyecto que se esta usando (kubernetes)

- kubectl config current-context

## Inisiar seción GCloud

- gcloud auth login

## Lista de cliente GCloud

- gcloud auth list

## Creación Clustern en Kubernetes Engine (Google Cloud)

- `Crear`
- `Cambiar a Clúster Estándar`
  - <b>Aspectos básicos del clúster</b>
    - `Nombre`: <poner_cualquier_nombre>
    - Dejar el resto por default
  - <b>Gupo de Nodos</b>
    - <i>Nodes</i>
      - Se pueden cambiar los procesadores pero generalmente se puede standar
  - `CREAR` //creamos la instancia

## Conectar Cluster

- <i>dos puntos en la instancia y en conectar se saca</i>
  - gcloud container clusters get-credentials <nombre_cluster> --zone <zona (us-central1-c)> --project <nombre_cluster_o_algo_diferente>
    - gcloud container clusters get-credentials proyecto2 --zone us-central1-c --project compact-gadget-397419
  - kubectl create ns <nombre-namespace>
    - kubectl create ns proyecto2
  - kubectl get nodes -o wide //para ver los puertos de los gkes

## Comandos Kubernetes

### Agregar Configuraciones

- kubectl apply -f <ruta-archivo> -n <namespace> //se puede usar para la ruta el /. asi pone todos
  - kubectl apply -f ./deployments/. -n proyecto2

### Quitar Configuraciones

- kubectl delete -f <ruta-archivo> -n <namespace> //se puede usar para la ruta el /. asi pone todos
  - kubectl apply -f ./deployments/. -n proyecto2

### Editar Configuraciones

- kubectl edit <tipo-objeto> <nombre-objeto> -n <namespace>

### Ver servicios 

- kubectl get services -n <namespace>

### Exponer puertos de servicios de tipo ClusterIP

- kubectl port-forward service/<nombre-servicio> <puerto>:<puerto> -n <namespace>
  - kubectl port-forward service/redis-service 6379:6379 -n proyecto2

### Ver puertos de cluster

- kubectl get nodes -o wide

### Ver todos los servicios de un namespace

- kubectl get all -n <namespace>

### Ver los ingress de un namespace

- kubectl get ing -n <namespace>

## Ingresar a Redis cualquier IP

- redis-cli -h <ip> -p 6379
  - redis-cli -h 34.134.109.230 -p 6379

## Instalar Nginx y Configurar

- kubectl create ns nginx-ingress
- helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx -n nginx-ingress
- helm repo update
- helm install nginx-ingress ingress-nginx/ingress-nginx -n nginx-ingress
- kubectl get services -n nginx-ingress

## Usar Cloud Run

### Primero ir a Container Registry

- Abrir Shell
  - docker pull <usr-dockerhub>/<nombre-proyecto>:<tag>
    - docker pull iskandar1412/react-p2:v1
  - docker tag <usr-dockerhub>/<nombre-proyecto>:<tag> gcr.io/<ID-Proyecto>/<cualquier-nombre>
      - El ID del proyecto esta a la par del logo de gcloud donde dicce my-proyect o algo asi, click y compiar id
    - docker tag iskandar1412/react-p2:v1 gcr.io/compact-gadget-397419/frontp2:v1
  - gcloud auth list
  - gcloud config list
  - gcloud auth configure-docker
  - gcloud auth login
  - docker push gcr.io/<ID-Proyecto>/<cualquier-nombre>
    - docker push gcr.io/compact-gadget-397419/frontp2:v1

### Ir a Cloud Run

- `Crear nuevo servicio`
  - `URL de la imagen del contenedor` -> seleccionar
    - `Container Registry`
      - Desplegar la imagen que uno busca
        - Seleccionar
      - Se puede cambiar region
    - `Autenticación`
      - Seleccionar `Permitir invocaciones sin autenticar`
  - `Crear`

## Instalación Helm

- curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3
- chmod 700 get_helm.sh
- ./get_helm.sh
- helm version

## Instalación Istio (No se uso para este proyecto)

- `https://github.com/istio/istio/releases`
- curl -L https://github.com/istio/istio/releases/download/1.19.3/istio-1.19.3-linux-amd64.tar.gz -o istio-1.19.3-linux-amd64.tar.gz
- tar -zxvf istio-1.19.3-linux-amd64.tar.gz
- mv istio-1.19.3 ~/
  - Abrir terminal y `nano ~/.bashrc` y agregar lo siguiente
    - export PATH=~/istio-1.19.3/bin:$PATH
  - Reiniciar terminal
- istioctl version