FROM node:16

WORKDIR /home/aws-metering

COPY package*.json ./ 

COPY . .

RUN npm install 

EXPOSE 3000

CMD ["node", "index.js"]

