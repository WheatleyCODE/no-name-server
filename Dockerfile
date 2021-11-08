FROM node

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . .

COPY ./dist ./dist

CMD ["npm", "run", "start:dev"]