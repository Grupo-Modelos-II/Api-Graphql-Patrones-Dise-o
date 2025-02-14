FROM node

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

ENTRYPOINT ["yarn"]

CMD ["start"]