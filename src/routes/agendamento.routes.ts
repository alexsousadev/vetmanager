import { Router } from "express";
import { agendarConsulta, detalharAgendamento, listarAgendamentos, deletarAgendamentoConsulta } from "../controllers/agendamento.controller";

export const agendamentoRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Agendamento
 *   description: Gerenciamento de Agendamentos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Agendamento:
 *       type: object
 *       properties:
 *         id_agendamento:
 *           type: integer
 *           example: 1
 *         data_agendamento:
 *           type: string
 *           format: date-time
 *           example: "2023-10-01T10:00:00Z"
 *         horario_agendamento:
 *           type: string
 *           example: "10:00"
 *         status_agendamento:
 *           type: string
 *           example: "AGENDADO"
 *         id_tipo_servico:
 *           type: integer
 *           example: 1
 *         id_pet:
 *           type: integer
 *           example: 1
 *         id_clinica:
 *           type: integer
 *           example: 1
 *         resultadoId:
 *           type: integer
 *           nullable: true
 *           example: null
 *         servicoId_servico:
 *           type: integer
 *           nullable: true
 *           example: null
 *         tipoServicoId_tipo_servico:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /agendamentos:
 *   post:
 *     summary: Agendar uma nova consulta
 *     tags: [Agendamento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - data_agendamento
 *               - horario_agendamento
 *               - id_tipo_servico
 *               - id_pet
 *               - id_clinica
 *             properties:
 *               data_agendamento:
 *                 type: string
 *                 format: date-time
 *               horario_agendamento:
 *                 type: string
 *               status_agendamento:
 *                 type: string
 *                 default: AGENDADO
 *               id_tipo_servico:
 *                 type: integer
 *               id_pet:
 *                 type: integer
 *               id_clinica:
 *                 type: integer
 *             example:
 *               data_agendamento: "2023-10-01T10:00:00Z"
 *               horario_agendamento: "10:00"
 *               status_agendamento: "AGENDADO"
 *               id_tipo_servico: 1
 *               id_pet: 1
 *               id_clinica: 1
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 agendamento:
 *                   $ref: '#/components/schemas/Agendamento'
 *       400:
 *         description: Erro de validação nos dados da requisição
 *       404:
 *         description: Pet, Tipo de Serviço, Usuário ou Clínica não encontrado
 *       500:
 *         description: Erro inesperado ao agendar a consulta
 */
agendamentoRoutes.post("/", agendarConsulta);

/**
 * @swagger
 * /agendamentos:
 *   get:
 *     summary: Listar agendamentos do usuário autenticado
 *     tags: [Agendamento]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de agendamentos do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agendamento'
 *       401:
 *         description: Não autenticado, token JWT ausente ou inválido.
 *       404:
 *         description: Nenhum agendamento encontrado para este usuário.
 *       500:
 *         description: Erro ao buscar agendamentos. Consulte os logs do servidor para mais detalhes.
 */
agendamentoRoutes.get("/", listarAgendamentos);

/**
 * @swagger
 * /agendamentos/{id}:
 *   get:
 *     summary: Detalhar um agendamento específico
 *     tags: [Agendamento]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do agendamento
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Detalhes do agendamento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agendamento'
 *       401:
 *         description: Não autenticado, token JWT ausente ou inválido.
 *       404:
 *         description: Agendamento não encontrado ou não pertence ao usuário!
 *       500:
 *         description: Erro ao buscar detalhes do agendamento. Consulte os logs do servidor para mais detalhes.
 */
agendamentoRoutes.get("/:id", detalharAgendamento);

/**
 * @swagger
 * /agendamentos/{id}/cancelar:
 *   patch:
 *     summary: Cancelar um agendamento específico
 *     tags: [Agendamento]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do agendamento
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Agendamento cancelado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agendamento'
 *       401:
 *         description: Não autenticado, token JWT ausente ou inválido.
 *       403:
 *         description: Não autorizado a cancelar este agendamento
 *       404:
 *         description: Agendamento não encontrado ou não pertence ao usuário!
 *       422:
 *         description: Não é possível cancelar um agendamento que já foi realizado ou já está cancelado
 *       500:
 *         description: Erro ao cancelar agendamento. Consulte os logs do servidor para mais detalhes.
 */
agendamentoRoutes.patch("/:id/cancelar", deletarAgendamentoConsulta);

export default agendamentoRoutes;