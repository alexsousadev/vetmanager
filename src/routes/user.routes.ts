import { Router, Request, Response } from "express";
import { checkLogin, checkHasUser, generateToken, createUser } from "../controllers/user.controller";
import { genSaltSync, hashSync } from 'bcrypt';
import { userAuth } from '../middlewere/user-auth.middlewere';
import { z, ZodError } from 'zod';
import path from "path";



const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(2),
    cpf: z.string()
});

const router = Router();

// Swagger Tags
/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Endpoints relacionados a autenticação e gerenciamento de usuários.
 */

/**
 * @swagger
 * /users/login:
 *   get:
 *     summary: Exibe a página de login
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Página HTML do login exibida com sucesso.
 */
router.get("/users/login", (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, "../../public/login.html"))
});

/**
 * @swagger
 * /users/cadastro:
 *   get:
 *     summary: Exibe a página de cadastro
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Página HTML do cadastro exibida com sucesso.
 */
router.get("/cadastro", (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, "../../public/cadastro.html"))
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso, redireciona para o dashboard.
 *       401:
 *         description: Email ou senha inválidos.
 *       500:
 *         description: Erro interno no servidor.
 */
router.post("/login", async (req: Request, res: Response) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const loginValidation = await checkLogin(email, password);

        if (loginValidation) {
            const tokenJWT = generateToken(email);
            req.session.user = tokenJWT;
            res.redirect("/dashboard");
        } else {
            res.status(401).json({ error: "Email ou senha inválidos" });
        }
    } catch (error) {
        if (error instanceof ZodError) {
            res.json({ error: error.message });
        }
        res.status(500).json({ error: "Erro interno no servidor." });
    }
});

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Encerra a sessão do usuário
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Sessão encerrada com sucesso, redireciona para a página inicial.
 *       500:
 *         description: Erro ao encerrar a sessão.
 */
router.get("/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Erro ao encerrar a sessão.");
        }
        res.redirect("/");
    });
});

/**
 * @swagger
 * /users/cadastro:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               cpf:
 *                 type: string
 *                 example: 12345678901
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso, redireciona para o login.
 *       400:
 *         description: Dados de entrada inválidos.
 *       409:
 *         description: Usuário já existe.
 *       500:
 *         description: Erro interno no servidor.
 */
router.post("/cadastro", async (req: Request, res: Response) => {
    try {
        
        const { name, email, password, cpf } = userSchema.parse(req.body);

        const salt = genSaltSync(10);
        const hashedPassword = hashSync(password, salt);

        const registerValidation = await checkHasUser(email);
        if (registerValidation) {
            return res.status(409).json({ error: "Usuário já existe" });
        }

        createUser(name, email, hashedPassword, cpf);
        return res.redirect("/users/login");
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ error: "Dados de entrada inválidos" });
        }
        return res.status(500).json({ error: "Ocorreu um erro interno do servidor." });
    }
});

/**
 * @swagger
 * /users/dashboard:
 *   get:
 *     summary: Exibe a página do dashboard
 *     tags: [Usuários]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Página do dashboard exibida com sucesso.
 *       401:
 *         description: Usuário não autenticado.
 */
router.get("/dashboard", userAuth, (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, "/public/dashboard.html"))
});

export default router;
