FROM node:18 as build

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npx nx build host --configuration=production

FROM nginx:alpine

COPY --from=build /app/dist/host/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]