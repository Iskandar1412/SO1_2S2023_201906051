FROM node:18.17.1

WORKDIR /front-p2

COPY public/ /front-p2//public
COPY src/ /front-p2//src
COPY package.json /front-p2//
COPY package-lock.json /front-p2//

RUN npm install
EXPOSE 3000

CMD ["npm", "start"]

#sudo docker build --tag prueba_p1 .
#sudo docker run -p 3000:3000 prueba_p1


# sudo docker build -t iskandar1412/react-p2:v1 .
# sudo docker tag iskandar1412/react-p2:v1 iskandar1412/react-p2:v1
# sudo docker push iskandar1412/react-p2:v1