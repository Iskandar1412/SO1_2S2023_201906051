FROM gcc:latest

# Usar el directorio RAM
WORKDIR /ram/

# Copiar archivos del Modulo Ram al directorio
COPY ./ram/ram_module.c .
COPY ./ram/Makefile .

# Ejecutar comando make
RUN make

# En caso de ejecutar el Módulo RAM
# CMD [ "./ram_module" ]

#docker build -t mod_ram .