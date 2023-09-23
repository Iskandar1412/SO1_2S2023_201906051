FROM node:18.17.1

WORKDIR /front-p1

COPY public/ /front-p1/public
COPY src/ /front-p1/src
COPY package.json /front-p1/
COPY package-lock.json /front-p1/

RUN npm install

CMD ["npm", "start"]

#sudo docker build --tag prueba_p1 .
#sudo docker run -p 3000:3000 prueba_p1