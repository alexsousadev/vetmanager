import express from "express";
import {
    listarClinicas,
    cadastrarClinica,
    atualizarClinica,
    deletarClinica,
    loginClinica,
    detalhesClinica,
} from "../controllers/clinica.controller";
import { loginAuth } from "../controllers/auth.controller";

const clinicaRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clinicas
 *   description: API para gerenciar clínicas
 */


/**
 * @swagger
 * /clinicas:
 *   get:
 *     summary: Listar todas as clínicas
 *     tags: [Clinicas]
 *     responses:
 *       200:
 *         description: Lista de clínicas
 *       404:
 *         description: Nenhuma clínica encontrada
 */
clinicaRouter.get("/", loginAuth, listarClinicas);

/**
 * @swagger
 * /clinicas/cadastro:
 *   post:
 *     summary: Cadastrar uma nova clínica
 *     tags: [Clinics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_clinica:
 *                 type: string
 *               endereco_clinica:
 *                 type: string
 *               telefone_clinica:
 *                 type: string
 *               foto_clinica:
 *                 type: string
 *               senha_clinica:
 *                 type: string
 *     responses:
 *       201:
 *         description: Clínica cadastrada com sucesso
 */
clinicaRouter.post("/cadastro", cadastrarClinica);

/**
 * @swagger
 * /clinicas/login:
 *   post:
 *     summary: Login de clínica
 *     tags: [Clinics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cnpj_clinica:
 *                 type: string
 *               senha_clinica:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */
clinicaRouter.post("/login", loginClinica);

/**
 * @swagger
 * /clinicas/{id}:
 *   put:
 *     summary: Atualizar uma clínica
 *     tags: [Clinics]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da clínica
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_clinica:
 *                 type: string
 *               endereco_clinica:
 *                 type: string
 *               telefone_clinica:
 *                 type: string
 *               foto_clinica:
 *                 type: string
 *     responses:
 *       200:
 *         description: Clínica atualizada com sucesso
 *       404:
 *         description: Clínica não encontrada
 */
clinicaRouter.put("/:id", loginAuth, atualizarClinica);

/**
 * @swagger
 * /clinicas/{id}:
 *   delete:
 *     summary: Excluir uma clínica
 *     tags: [Clinics]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da clínica
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Clínica excluída com sucesso
 *       404:
 *         description: Clínica não encontrada
 */
clinicaRouter.delete("/:id", deletarClinica);

/**
 * @swagger
 * /clinicas/{id}:
 *   get:
 *     summary: Detalhar uma clínica
 *     tags: [Clinics]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da clínica
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes da clínica
 *       404:
 *         description: Clínica não encontrada
 */
clinicaRouter.get("/:id", loginAuth, detalhesClinica);

export default clinicaRouter;
