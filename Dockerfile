FROM node:16-alpine
WORKDIR /myapp
COPY ./package*.json .
RUN npm install 

# //copying project from localhost to our container
COPY . .
EXPOSE 3000
CMD ["npm","run","start"]
