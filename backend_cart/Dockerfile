FROM node:16-alpine as development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5002
CMD ["npm", "start"]
