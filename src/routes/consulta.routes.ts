import { Router } from "express";
import { 
    criarConsulta, 
    buscarHistoricoConsultas, 
    buscarDetalhesConsulta 
} from "../controllers/consulta.controller";
import { usuarioAuth } from "../controllers/auth.controller";

const consultaRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Consultas
 *   description: Gerenciamento de consultas veterinárias
 */

/**
 * @swagger
 * /consultas:
 *   post:
 *     summary: Registrar uma nova consulta
 *     tags: [Consultas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data_consulta:
 *                 type: string
 *                 format: date-time
 *               id_pet:
 *                 type: integer
 *               id_clinica:
 *                 type: integer
 *               nome_veterinario:
 *                 type: string
 *               diagnostico:
 *                 type: string
 *               prescricao:
 *                 type: string
 *               observacoes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Consulta registrada com sucesso
 */
consultaRouter.post("/", usuarioAuth, criarConsulta);

/**
 * @swagger
 * /consultas/pet/{id_pet}:
 *   get:
 *     summary: Buscar histórico de consultas de um pet
 *     tags: [Consultas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_pet
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Histórico de consultas encontrado
 */
consultaRouter.get("/pet/:id_pet", usuarioAuth, buscarHistoricoConsultas);

/**
 * @swagger
 * /consultas/{id_consulta}:
 *   get:
 *     summary: Buscar detalhes de uma consulta específica
 *     tags: [Consultas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_consulta
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes da consulta encontrados
 */
consultaRouter.get("/:id_consulta", usuarioAuth, buscarDetalhesConsulta);

export default consultaRouter; 