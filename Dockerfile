FROM node:latest

LABEL org.opencontainers.image.authors="623337308@qq.com/monitor-web"

RUN mkdir -p /monitor-web
WORKDIR /monitor-web

COPY . /monitor-web

RUN npm i pnpm -g
RUN npm i typescript -g
RUN pnpm i
RUN npm build

ENTRYPOINT ["npm", "run"]
CMD ["serve"]

EXPOSE 4040
