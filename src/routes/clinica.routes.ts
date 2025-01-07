import express from "express";
import {
    listarClinicas,
    cadastrarClinica,
    atualizarClinica,
    deletarClinica,
} from "../controllers/clinica.controller";

const routesClinicas = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clínicas
 *   description: Endpoints para gerenciamento de clínicas veterinárias
 */

/**
 * @swagger
 * /clinicas:
 *   get:
 *     summary: Lista todas as clínicas
 *     tags: [Clínicas]
 *     responses:
 *       200:
 *         description: Lista de clínicas retornada com sucesso
 */
routesClinicas.get("/", listarClinicas);

/**
 * @swagger
 * /clinicas:
 *   post:
 *     summary: Cadastra uma nova clínica
 *     tags: [Clínicas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Clínica Vet
 *               endereco:
 *                 type: string
 *                 example: Rua das Flores, 123
 *     responses:
 *       201:
 *         description: Clínica cadastrada com sucesso
 */
routesClinicas.post("/", cadastrarClinica);

/**
 * @swagger
 * /clinicas/{id}:
 *   put:
 *     summary: Atualiza informações de uma clínica
 *     tags: [Clínicas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da clínica
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               endereco:
 *                 type: string
 *     responses:
 *       200:
 *         description: Clínica atualizada com sucesso
 */
routesClinicas.put("/:id", atualizarClinica);

/**
 * @swagger
 * /clinicas/{id}:
 *   delete:
 *     summary: Remove uma clínica pelo ID
 *     tags: [Clínicas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da clínica
 *     responses:
 *       200:
 *         description: Clínica deletada com sucesso
 */
routesClinicas.delete("/:id", deletarClinica);

export default routesClinicas;
