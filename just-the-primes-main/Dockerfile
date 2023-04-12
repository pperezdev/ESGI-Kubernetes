FROM node:18-alpine

WORKDIR /backendd
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", "app.js", "--host=0.0.0.0"]