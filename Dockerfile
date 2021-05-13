FROM python:3.7-slim
RUN apt-get update && apt-get install build-essential -y
FROM node:12.22
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install
COPY . /usr/src/app
EXPOSE 3000
CMD ["npm", "run", "start:docker"]
