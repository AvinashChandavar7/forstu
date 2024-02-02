import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: "MY API Documentation",
    description: "My API Documentation",
  },
  host: 'localhost:8000',
}

const outputfile = './src/json/swagger-output.json';

const routes = ['./src/routes/excel.routes.js']

swaggerAutogen(outputfile, routes, doc)