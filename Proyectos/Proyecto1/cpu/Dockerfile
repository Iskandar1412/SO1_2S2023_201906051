FROM gcc:latest

# Usar el directorio CPU
WORKDIR /cpu/

# Copiar archivos del Modulo CPU al directorio
COPY ./cpu/cpu_module .
COPY ./cpu/Makefile .

# Ejecutar comando make
RUN make

# En caso de ejecutar el Módulo CPU
# CMD [ "./cpu_module" ]

#docker build -t mod_cpu .