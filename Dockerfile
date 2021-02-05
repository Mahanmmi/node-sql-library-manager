FROM node:15.7.0-alpine3.10
EXPOSE 3000

WORKDIR /home/app

COPY . /home/app

RUN cd /home/app/client-src/node-sql-library-manager-client/ && npm install && npm run build
RUN cd /home/app && npm install

CMD npm run start
