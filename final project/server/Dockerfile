FROM node:18-alpine
WORKDIR /app
# Correct the path to copy package.json from the build context
# The build context is now the 'server' folder, so package.json should be copied from there.
COPY package.json package-lock.json* ./
RUN npm ci --only=production
COPY . .
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "index.js"]