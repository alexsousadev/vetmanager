import { Router } from "express";
import { loginUsuario, cadastroUsuario } from "../controllers/user.controller";

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de Usuários
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id_usuario:
 *           type: integer
 *           example: 1
 *         nome_usuario:
 *           type: string
 *           example: "João Silva"
 *         email_usuario:
 *           type: string
 *           format: email
 *           example: "joao.silva@exemplo.com"
 *         senha_usuario:
 *           type: string
 *           format: password
 *           example: "senha123"
 *         foto_usuario:
 *           type: string
 *           format: uri
 *           example: "https://exemplo.com/foto.jpg"
 *         cpf:
 *           type: string
 *           example: "123.456.789-00"
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
 *               nome_usuario:
 *                 type: string
 *               email_usuario:
 *                 type: string
 *               senha_usuario:
 *                 type: string
 *               foto_usuario:
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

export default userRouter;
