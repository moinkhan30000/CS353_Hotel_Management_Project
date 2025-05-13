FROM node:20-slim

WORKDIR /app

# Only copy what’s needed to install dependencies
COPY package.json package-lock.json* ./

# Workaround for peer dep and hanging issues
RUN npm set fetch-retry-maxtimeout 60000 && \
    npm set fetch-retry-mintimeout 20000 && \
    npm install --legacy-peer-deps --verbose

# Copy the rest of the app
COPY . .

CMD ["npm", "run", "dev", "--", "--host"]
