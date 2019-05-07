FROM node:8.9.1

WORKDIR /usr/src/html

ENV NPM_CONFIG_LOGLEVEL warn

COPY . .

RUN yarn install

RUN yarn run build

RUN yarn global add serve

CMD serve -s build

EXPOSE 5000
