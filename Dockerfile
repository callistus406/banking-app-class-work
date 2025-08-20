FROM node:current-alpine3.22


WORKDIR /app


COPY package.json package-lock.json /app/

RUN npm install



COPY . /app/


EXPOSE 4000


CMD [ "npm","run", "dev" ]

