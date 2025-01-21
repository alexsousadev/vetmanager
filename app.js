"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const user_routes_1 = __importDefault(require("./src/routes/user.routes"));
const path_1 = __importDefault(require("path"));
const clinica_routes_1 = __importDefault(require("./src/routes/clinica.routes"));
const pet_routes_1 = __importDefault(require("./src/routes/pet.routes"));
const env_service_1 = require("./src/services/env.service");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const app = (0, express_1.default)();
const PORT = env_service_1.EnvConfig.port;
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
const swaggerDocument = (0, swagger_jsdoc_1.default)(swaggerOptins);
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use("/clinicas", clinica_routes_1.default);
app.use("/users", user_routes_1.default);
app.use("/pets", pet_routes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
