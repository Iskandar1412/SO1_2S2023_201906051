FROM node:18.17.1

WORKDIR /frontend/

COPY public/ /frontend/public
COPY src/ /frontend/src
COPY package.json /frontend/
COPY package-lock.json /frontend/

RUN npm install

CMD ["npm", "start"]

#docker build --tag app_react .

#docker run -p 3000:3000 nombre_imagen