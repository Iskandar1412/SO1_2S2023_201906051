FROM node:18.18.0

WORKDIR /nodeback

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3500

CMD ["node", "index.js"]

# sudo docker build -t iskandar1412/node-socket:v1 .
# sudo docker tag iskandar1412/node-socket:v1 iskandar1412/node-socket:v1
# sudo docker push iskandar1412/node-socket:v1