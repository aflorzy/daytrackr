#### Stage 1: Build the angular application
FROM node as build

# Configure the main working directory inside the docker image.
# This is the base directory used in any further RUN, COPY, and ENTRYPOINT
# commands.
WORKDIR /app

# Copy the package.json as well as the package-lock.json and install
# the dependencies. This is a separate step so the dependencies
# will be cached unless changes to one of those two files
# are made.
COPY package*.json ./

RUN curl -fsSLO https://get.docker.com/builds/Linux/x86_64/docker-17.04.0-ce.tgz \
  && tar xzvf docker-17.04.0-ce.tgz \
  && mv docker/docker /usr/local/bin \
  && rm -r docker docker-17.04.0-ce.tgz

RUN npm install

# Copy the main application
COPY . ./

# Arguments
ARG configuration=production

# Build the application
RUN npm run build

#### Stage 2, use the compiled app, ready for production with Nginx
FROM nginx

# Copy the angular build from Stage 1
COPY --from=build /app/dist/daytrackr-parser/ /usr/share/nginx/html

# Copy our custom nginx config
COPY /nginx-custom.conf /etc/nginx/conf.d/default.conf


# Expose port 80 to the Docker host, so we can access it
# from the outside.
EXPOSE 81

ENTRYPOINT ["nginx","-g","daemon off;"]
