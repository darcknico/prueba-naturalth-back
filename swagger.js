const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'prueba naturalth',
      version: '1.0.0',
      description:""
    },
  },
  apis: ['./routes/pokemon.js'],
  security: [
    
  ],
  basePath: '/api'
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerSpec,
  swaggerUi,
};