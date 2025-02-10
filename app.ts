import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './src/routes/user.routes';
import path from 'path';
import routesClinicas from './src/routes/clinica.routes';
import Pet_routes from './src/routes/pet.routes';
import { EnvConfig } from './src/services/env.service';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import servicoRoutes from './src/routes/servico.routes';
import agendamentoRoutes from './src/routes/agendamento.routes';

const app = express();
const PORT = EnvConfig.port;

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'VetManager API',
            version: '1.0.0',
            description: 'API do VetManager, um sistema que visa facilitar a gestão da saúde de animais de estimação, conectando tutores a clínicas veterinárias.',
        },
        servers: [
            // {
            //     url: `vetman.onrender.com/`
            // },
            {
                url: `https://vetmanager-cvof.onrender.com`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerDocument = swaggerJSDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors({
    origin: "http://localhost:8080"
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/clinicas", routesClinicas);
app.use("/users", userRoutes);
app.use("/pets", Pet_routes);
app.use("/servicos", servicoRoutes);
app.use("/agendamentos", agendamentoRoutes);

app.listen(PORT, () => {
    console.log(`\n - Server is running on port http://localhost:${PORT}\n - Swagger running on http://localhost:${PORT}/docs`);
});
