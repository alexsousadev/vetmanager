import express, { Response, Request } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.routes';
import session from 'express-session';
import path from 'path';
import routesClinicas from './routes/clinica.routes';
import Pet_routes from './routes/pet.routes';
import { swaggerSpec, swaggerUi } from './swagger';

const app = express()

const PORT = process.env.PORT || 3000;
const JWT_KEY = process.env.JWT_SECRET_KEY || 'secret dog';


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// configuração da sessão
app.use(session({
    secret: JWT_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    }
}));


app.use(express.json())
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use("/users",userRoutes)
app.use("/pets", Pet_routes);
app.use("/clinicas", routesClinicas);

// Rota principal

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../public/home.html"))
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})