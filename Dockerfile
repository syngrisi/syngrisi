FROM node:13.14.0-alpine3.10
WORKDIR /vrs
COPY . .
RUN npm install
EXPOSE 3000

CMD [ "npm", "run", "startdebug" ]
#RUN npm run start
