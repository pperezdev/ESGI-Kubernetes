FROM node:18-alpine

WORKDIR /frontend
COPY . .
RUN npm install
EXPOSE 8080
CMD ["node", "app.js", "--host=0.0.0.0"]