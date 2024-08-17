FROM node:20.16-alpine as build

WORKDIR /workspace

COPY package*.json ./

RUN npm install -g npm@10.8.2

RUN npm install --configuration=production

COPY . .

RUN npm run build:ci 


FROM nginx:alpine

COPY --from=build /workspace/dist/daytrackr-parser /usr/share/nginx/html

COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK CMD curl --fail http://localhost:80 || exit 1

ENTRYPOINT ["nginx","-g","daemon off;"]