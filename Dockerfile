FROM node:15.7.0-alpine3.10
EXPOSE 3000 8080

WORKDIR /home/app

COPY . /home/app

RUN npm install
CMD ./start.sh