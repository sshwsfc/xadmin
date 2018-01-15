FROM node:8.9.4-alpine

COPY / /src/

WORKDIR /src

RUN rm -rf node_modules

RUN yarn

EXPOSE 8080

ENTRYPOINT ["yarn", "start"]