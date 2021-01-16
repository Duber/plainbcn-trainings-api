FROM node:14

WORKDIR /app
COPY . .
RUN npm ci

EXPOSE 3001
ENTRYPOINT ["npm", "start"]