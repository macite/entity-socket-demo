FROM node:16

ENV DEBIAN_FRONTEND noninteractive

WORKDIR /certain-ice-ui

EXPOSE 4200

ENV NODE_ENV docker

# Install packages within the container
COPY package.json package-lock.json /certain-ice-ui/
# RUN npm install
# CMD npm start

CMD start.sh
