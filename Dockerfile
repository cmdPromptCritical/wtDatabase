FROM node:latest
ENV NODE_ENV=dev
ENV PORT=3000
ENV PORT_HTTP=3001
WORKDIR /usr/share/wtdb

# allegedly running this helps builds run faster by caching
# node_modules before copying everything from source folder
COPY package*.json ./

RUN npm install

#install pm2
RUN npm install pm2 --save

# if in production, use instead:
# RUN npm ci --only=production

# move everything into container
COPY . .

EXPOSE 3000

CMD ["node", "bin/www2"]
