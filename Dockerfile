# specifying base image

FROM  node:alpine3.16 as nodework

# //specifying current working directory
WORKDIR /myapp

# //copying package.json file in current working directory
COPY ./package.json .

# //installing packages
RUN npm install 

# //copying project from localhost to our container
COPY . .

# //it will create a build folder for our application
RUN npm run build

CMD ["npm","run","start"]


# nginx block

# FROM nginx:1.23-alpine

# WORKDIR /usr/share/nginx/html

# RUN rm -rf ./*

# COPY --from=nodework /myapp/build .

# ENTRYPOINT [ "nginx","-g", "daemon off;" ]