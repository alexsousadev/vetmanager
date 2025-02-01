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
 * /users/login:
 *   post:
 *     summary: Login de usuário
 *     description: Realiza o login de um usuário com email e senha.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email_usuario
 *               - senha_usuario
 *             properties:
 *               email_usuario:
 *                 type: string
 *                 format: email
 *                 example: "usuario@example.com"
 *                 description: Email do usuário.
 *               senha_usuario:
 *                 type: string
 *                 format: password
 *                 example: "senha123"
 *                 description: Senha do usuário.
 *     responses:
 *       200:
 *         description: Login bem-sucedido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   description: Token de autenticação JWT.
 *       401:
 *         description: Credenciais inválidas.
 *       500:
 *         description: Erro interno no servidor.
 */
userRouter.post("/login", loginUsuario);

/**
 * @swagger
 * /users/cadastro:
 *   post:
 *     summary: Cadastro de usuário
 *     description: Cadastra um novo usuário no sistema.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome_usuario
 *               - email_usuario
 *               - senha_usuario
 *               - cpf
 *             properties:
 *               nome_usuario:
 *                 type: string
 *                 example: "João Silva"
 *                 description: Nome completo do usuário.
 *               email_usuario:
 *                 type: string
 *                 format: email
 *                 example: "joao.silva@example.com"
 *                 description: Email do usuário.
 *               senha_usuario:
 *                 type: string
 *                 format: password
 *                 example: "senha123"
 *                 description: Senha do usuário.
 *               cpf:
 *                 type: string
 *                 example: "123.456.789-00"
 *                 description: CPF do usuário (formato XXX.XXX.XXX-XX).
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                   description: ID do usuário cadastrado.
 *                 nome_usuario:
 *                   type: string
 *                   example: "João Silva"
 *                   description: Nome do usuário cadastrado.
 *                 email_usuario:
 *                   type: string
 *                   example: "joao.silva@example.com"
 *                   description: Email do usuário cadastrado.
 *                 cpf:
 *                   type: string
 *                   example: "123.456.789-00"
 *                   description: CPF do usuário cadastrado.
 *       409:
 *         description: Usuário já cadastrado (email ou CPF já existente).
 *       500:
 *         description: Erro interno no servidor.
 */
userRouter.post("/cadastro", cadastroUsuario);

export default userRouter;