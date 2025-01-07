import express, { Response, Request } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './src/routes/user.routes';
import session from 'express-session';
import path from 'path';
import Pet_routes from './src/routes/pet.routes';
const app = express()

const PORT = process.env.PORT || 3000;
const JWT_KEY = process.env.JWT_SECRET_KEY || 'secret dog';

// configuração da sessão
app.use(session({
    secret: JWT_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    }
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(Pet_routes);

// Rota principal
app.get("/", (req: Request, res: Response) => {
    // res.sendFile(path.join(__dirname, '../public', 'index.html')); --> aqui é o index.html
})

app.use(userRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})