import express, { Response, Request } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './src/routes/user.routes';
import path from 'path';
import routesClinicas from './src/routes/clinica.routes';
import Pet_routes from './src/routes/pet.routes';
import { EnvConfig } from './src/services/env.service';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
const app = express()

const PORT = EnvConfig.port

const swaggerOptins = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'VetManager API',
            version: '1.0.0',
            description: 'API do VetManager, um sistema que visa facilitar a gestão da saúde de animais de estimação, conectando tutores a clínicas veterinárias.',
        },
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerDocument = swaggerJSDoc(swaggerOptins);
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(express.json())
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/clinicas", routesClinicas);
app.use("/users", userRoutes);
app.use("/pets", Pet_routes);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})