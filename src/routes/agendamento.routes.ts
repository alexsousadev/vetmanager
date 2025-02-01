import { Router } from "express";
import { agendarConsulta, cancelarAgendamento } from "../controllers/agendamento.controller";
const agendamentoRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Agendamentos
 *   description: Rotas para gerenciar agendamentos de consultas
 */

/**
 * @swagger
 * /agendamentos:
 *   post:
 *     summary: Agendar uma consulta
 *     description: Agenda uma nova consulta com os dados fornecidos.
 *     tags: [Agendamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data_agendamento:
 *                 type: string
 *                 format: date
 *                 example: "2023-10-15"
 *                 description: Data do agendamento (formato YYYY-MM-DD).
 *               horario_agendamento:
 *                 type: string
 *                 format: time
 *                 example: "14:30"
 *                 description: Horário do agendamento (formato HH:mm).
 *               id_servico:
 *                 type: integer
 *                 example: 1
 *                 description: ID do serviço a ser agendado.
 *               id_pet:
 *                 type: integer
 *                 example: 1
 *                 description: ID do pet para o qual o agendamento está sendo feito.
 *               id_usuario:
 *                 type: integer
 *                 example: 1
 *                 description: ID do usuário que está agendando a consulta.
 *               id_clinica:
 *                 type: integer
 *                 example: 1
 *                 description: ID da clínica onde a consulta será realizada.
 *     responses:
 *       201:
 *         description: Consulta agendada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                   description: ID do agendamento criado.
 *                 data_agendamento:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-15T14:30:00.000Z"
 *                   description: Data e horário do agendamento.
 *                 status_agendamento:
 *                   type: string
 *                   example: "agendado"
 *                   description: Status do agendamento.
 *                 petId:
 *                   type: integer
 *                   example: 1
 *                   description: ID do pet associado ao agendamento.
 *                 servicoId:
 *                   type: integer
 *                   example: 1
 *                   description: ID do serviço associado ao agendamento.
 *                 usuarioId:
 *                   type: integer
 *                   example: 1
 *                   description: ID do usuário associado ao agendamento.
 *                 clinicaId:
 *                   type: integer
 *                   example: 1
 *                   description: ID da clínica associada ao agendamento.
 *       400:
 *         description: Erro de validação nos dados fornecidos.
 *       500:
 *         description: Erro interno no servidor.
 */
agendamentoRoutes.post("/", agendarConsulta);

/**
 * @swagger
 * /agendamentos/{id}:
 *   put:
 *     summary: Cancelar um agendamento
 *     description: Cancela um agendamento existente com base no ID fornecido.
 *     tags: [Agendamentos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do agendamento a ser cancelado.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Agendamento cancelado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Agendamento cancelado com sucesso."
 *       404:
 *         description: Agendamento não encontrado.
 *       500:
 *         description: Erro interno no servidor.
 */
agendamentoRoutes.put("/:id", cancelarAgendamento);

export default agendamentoRoutes;