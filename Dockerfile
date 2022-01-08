FROM mcr.microsoft.com/playwright:focal
WORKDIR /app
COPY . .
RUN rm package-lock.json
RUN npm install
RUN npx playwright install

RUN npm install jsdom --no-save
RUN rm -rf node_modules/jest-environment-jsdom/node_modules/jsdom/
RUN mv node_modules/jsdom node_modules/jest-environment-jsdom/node_modules/jsdom

RUN npm run build
ENTRYPOINT ["npm", "run"]
CMD ["test"]
