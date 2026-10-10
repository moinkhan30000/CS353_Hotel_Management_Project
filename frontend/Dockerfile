FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm set fetch-retry-maxtimeout 60000 && \
    npm set fetch-retry-mintimeout 20000 && \
    npm install --legacy-peer-deps --verbose

COPY . .

CMD ["npm", "run", "dev", "--", "--host"]
