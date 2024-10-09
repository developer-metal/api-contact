FROM node:18.18.0-alpine3.18
RUN apk update && apk upgrade --no-cache && \
    apk upgrade libssl3 libcrypto3 --no-cache && \
    mkdir /backoffice
WORKDIR /backoffice
COPY . ./
RUN pwd
RUN npm i -g npm@10.6.0
RUN npm i -g turbo@1.13.3
RUN npm i -g @nestjs/cli
RUN npm cache clean --force
RUN npm install --ignore-scripts --loglevel verbose --timeout=600000
RUN npm ls
RUN pwd
RUN ls -la
EXPOSE 3500
CMD ["npm", "run", "build"]