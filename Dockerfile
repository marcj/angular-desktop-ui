FROM node:alpine

RUN npm config set unsafe-perm true
RUN npm i -g lerna npm-local-development
RUN apk --no-cache add git

ADD package.json /lib/package.json
ADD lerna.json /lib/lerna.json
ADD packages/native-ui/package.json /lib/packages/native-ui/package.json
#ADD packages/native-ui/package-lock.json /lib/packages/native-ui/package-lock.json

ADD packages/angular-test/package.json /lib/packages/angular-test/package.json
ADD packages/angular-test/package-lock.json /lib/packages/angular-test/package-lock.json

RUN cd /lib && npm run bootstrap

ADD . /lib
RUN cd /lib && npm-local-development --no-watcher
RUN cd /lib/packages/native-ui && npm run docs
RUN cd /lib/packages/angular-test && ./node_modules/.bin/ng build --prod

FROM nginx:alpine

ENV PORT=8080

COPY --from=0 /lib/packages/angular-test/dist/angular-desktop-ui /usr/share/nginx/html

RUN echo "gzip on; \
          gzip_buffers 16 8k; \
          gzip_comp_level 1; \
          gzip_http_version 1.1; \
          gzip_min_length 10; \
          gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/x-icon application/vnd.ms-fontobject font/opentype application/x-font-ttf; \
          gzip_vary on; \
          gzip_proxied any; # Compression for all requests. \
          ## No need for regexps. See \
          ## http://wiki.nginx.org/NginxHttpGzipModule#gzip_disable \
          gzip_disable msie6;" > /etc/nginx/conf.d/gzip.conf

RUN sed -i -e "s/index.htm;/;\n        try_files \$uri \$uri\/ \/index.html;/g" /etc/nginx/conf.d/default.conf

CMD sed -i -e "s/listen       80/listen       $PORT/g" /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
