FROM node:18.17.1

WORKDIR /backnode

COPY index.js /backnode/
COPY package.json /backnode/
COPY package-lock.json /backnode/

RUN npm install
EXPOSE 3200

CMD ["node", "index.js"]

#sudo docker build --tag node_p1_1 .
#sudo docker run -p 3200:3200 node_p1_1