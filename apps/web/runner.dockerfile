FROM node:20.16-alpine

RUN apk add chromium

ENV CHROME_BIN=/usr/bin/chromium-browser