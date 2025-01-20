import { Router } from "express";
import { loginUsuario, cadastroUsuario, Dash } from "../controllers/user.controller";
import { usuarioAuth } from "../controllers/auth.controller";

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para gerenciar usuários
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email_usuario:
 *                 type: string
 *               senha_usuario:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */
userRouter.post("/login", loginUsuario)

/**
 * @swagger
 * /users/cadastro:
 *   post:
 *     summary: Cadastro de usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               cpf:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       409:
 *         description: Usuário já cadastrado
 */
userRouter.post("/cadastro", cadastroUsuario)

/**
 * @swagger
 * /users/dash:
 *   get:
 *     summary: Dashboard do usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retorna a dashboard do usuário
 */
userRouter.get("/dash", usuarioAuth, Dash)

export default userRouter;
