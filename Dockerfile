FROM mcr.microsoft.com/playwright:focal
WORKDIR /app
COPY . .
RUN rm package-lock.json
RUN npm install
RUN npx playwright install  
RUN npm run build
ENTRYPOINT ["npm", "run"]
CMD ["test"]