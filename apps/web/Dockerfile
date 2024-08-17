FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build:ci


FROM nginx:alpine

COPY --from=build /app/dist/my-angular-app /usr/share/nginx/html

COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK CMD curl --fail http://localhost:80 || exit 1

ENTRYPOINT ["nginx","-g","daemon off;"]