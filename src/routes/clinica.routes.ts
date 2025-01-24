import express from "express";
import {
    listarClinicas,
    atualizarClinica,
    deletarClinica,
    detalhesClinica, cadastroDias,
    cadastrarClinicas,
    cadastroLocalizacao,
    cadastroHorario,
    cadastroServicos
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

/**
 * @swagger
 * /clinicas/cadastro/multiple:
 *   post:
 *     summary: Cadastrar várias clínicas
 *     tags: [Clinicas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clinicas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     cnpj_clinica:
 *                       type: string
 *                     nome_clinica:
 *                       type: string
 *                     endereco_clinica:
 *                       type: string
 *                     telefone_clinica:
 *                       type: string
 *                     foto_clinica:
 *                       type: string
 *                     avaliacao_clinica:
 *                       type: number
 *                     total_avaliacoes:
 *                       type: integer
 *                     localizacao:
 *                       type: object
 *                       properties:
 *                         latitude:
 *                           type: number
 *                         longitude:
 *                           type: number
 *                         endereco:
 *                           type: string
 *                         cidade:
 *                           type: string
 *                         estado:
 *                           type: string
 *                         cep:
 *                           type: string
 *                     disponibilidade:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           dia_semana:
 *                             type: string
 *                           horario_inicio:
 *                             type: string
 *                           horario_fim:
 *                             type: string
 *     responses:
 *       201:
 *         description: Clínicas cadastradas com sucesso
 */
clinicaRouter.post("/cadastro", cadastrarClinicas);

clinicaRouter.post("/localizacao", cadastroLocalizacao);

clinicaRouter.post("/horario", cadastroHorario);

clinicaRouter.post("/servicos", cadastroServicos);

// clinicaRouter.post("/povoar", povoarClinica)

/**
 * @swagger
 * /clinicas/login:
 *   post:
 *     summary: Login de clínica
 *     tags: [Clinicas]
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
// clinicaRouter.post("/login", loginClinica);

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
