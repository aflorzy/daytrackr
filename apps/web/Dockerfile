FROM node as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./

ARG configuration=production

RUN npm run build

#### Stage 2, use the compiled app, ready for production with Nginx
FROM nginx

# Copy the angular build from Stage 1
COPY --from=build /app/dist/daytrackr-parser/ /usr/share/nginx/html

# Copy our custom nginx config
COPY /nginx-custom.conf /etc/nginx/conf.d/default.conf


# Change nginx permissions
RUN chgrp -R root /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 777 /var/cache/nginx /var/run /var/log/nginx

EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]
