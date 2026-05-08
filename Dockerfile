FROM node:22 as build

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN CI=1 node --require @swc-node/register ./node_modules/nx/bin/nx.js build shell --configuration=production

FROM nginx:alpine

COPY --from=build /app/dist/shell /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]