FROM node:14.15.0-alpine

WORKDIR /devtool.page
COPY package.json package-lock.json /devtool.page/
RUN npm ci

COPY . /devtool.page
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]