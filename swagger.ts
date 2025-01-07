import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "VetManager API",
      version: "1.0.0",
      description: "API para gerenciamento de clínicas veterinárias",
    },
    servers: [
      {
        url: "http://localhost:3000", // Altere para a URL do seu servidor de produção
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Caminho para os arquivos que possuem as rotas documentadas
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
