import express from "express";
import {
    listarClinicas,
    atualizarClinica,
    deletarClinica,
    detalhesClinica, cadastroDias,
    cadastrarClinicas,
    cadastroLocalizacao,
    cadastroHorario,
    cadastroServicosClinica
} from "../controllers/clinica.controller";
import { loginAuth } from "../controllers/auth.controller";

const clinicaRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clinicas
 *   description: Gerenciamento de Clínicas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Clinica:
 *       type: object
 *       properties:
 *         id_clinica:
 *           type: integer
 *           example: 1
 *         nome_clinica:
 *           type: string
 *           example: "Clínica Veterinária Exemplo"
 *         endereco_clinica:
 *           type: string
 *           example: "Rua Exemplo, 123"
 *         telefone_clinica:
 *           type: string
 *           example: "+55 11 98765-4321"
 *         foto_clinica:
 *           type: string
 *           format: uri
 *           example: "https://exemplo.com/foto.jpg"
 *         senha_clinica:
 *           type: string
 *           format: password
 *           example: "senha123"
 *         avaliacao_clinica:
 *           type: number
 *           example: 4.5
 *         total_avaliacoes:
 *           type: integer
 *           example: 150
 *         cnpj_clinica:
 *           type: string
 *           example: "12.345.678/0001-90"
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
clinicaRouter.get("/", listarClinicas);

/**
 * @swagger
 * /clinicas/cadastro:
 *   post:
 *     summary: Cadastrar uma nova clínica
 *     tags: [Clinicas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_clinica:
 *                 type: string
 *                 description: Nome da clínica (obrigatório)
 *               endereco_clinica:
 *                 type: string
 *                 description: Endereço da clínica (obrigatório)
 *               telefone_clinica:
 *                 type: string
 *                 description: Telefone da clínica (obrigatório)
 *               foto_clinica:
 *                 type: string
 *                 description: URL da foto da clínica (obrigatório)
 *               senha_clinica:
 *                 type: string
 *                 description: Senha da clínica (obrigatório)
 *               avaliacao_clinica:
 *                 type: number
 *                 description: Avaliação da clínica (obrigatório)
 *               total_avaliacoes:
 *                 type: integer
 *                 description: Total de avaliações (obrigatório)
 *               cnpj_clinica:
 *                 type: string
 *                 description: CNPJ da clínica (obrigatório)
 *     responses:
 *       201:
 *         description: Clínica cadastrada com sucesso
 */

clinicaRouter.post("/cadastro", cadastrarClinicas);

clinicaRouter.post("/localizacao", cadastroLocalizacao);

clinicaRouter.post("/horario", cadastroHorario);

clinicaRouter.post("/servicos", cadastroServicosClinica);

/**
 * @swagger
 * /clinicas/{id}:
 *   put:
 *     summary: Atualizar uma clínica
 *     tags: [Clinicas]
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
 *     tags: [Clinicas]
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
 *     tags: [Clinicas]
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
clinicaRouter.get("/:id", detalhesClinica);

clinicaRouter.post("/cadastrodias", cadastroDias)

export default clinicaRouter;
