FROM node:15.7.0-alpine3.10
EXPOSE 3000

WORKDIR /home/app

COPY . /home/app

RUN npm install
CMD npm run start