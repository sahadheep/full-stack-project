FROM node:18-alpine
WORKDIR /app
# FIX: Go up one level (../) to find package.json in the 'final project' folder
COPY ../package.json ../package-lock.json* ./
RUN npm ci --only=production
COPY . .
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "index.js"]