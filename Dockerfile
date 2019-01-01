FROM node:10-alpine

RUN mkdir -p /usr/src/svc && apk add --no-cache bash curl

WORKDIR /usr/src/svc
COPY . /usr/src/svc

EXPOSE 8000

RUN npm install
RUN npm rebuild
CMD npm start
