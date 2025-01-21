import { Router } from "express";
import { listarPets, SalvarPet, atualizarPet, excluirPet, detalharPet } from "../controllers/pet.controller";
import { usuarioAuth } from "../controllers/auth.controller";

const petRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Gerenciamento de Pets
 */

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Listar todos os pets
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pets
 */
petRouter.get("/", usuarioAuth, listarPets);

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Salvar um novo pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_pet:
 *                 type: string
 *               especie:
 *                 type: string
 *               raca:
 *                 type: string
 *               peso:
 *                 type: number
 *               id_usuario:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Pet salvo com sucesso
 */
petRouter.post("/", usuarioAuth, SalvarPet);

/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Atualizar um pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do pet
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_pet:
 *                 type: string
 *               especie:
 *                 type: string
 *               raca:
 *                 type: string
 *               peso:
 *                 type: number
 *               id_usuario:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Pet atualizado com sucesso
 *       404:
 *         description: Pet não encontrado
 */
petRouter.put("/:id", usuarioAuth, atualizarPet);

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Excluir um pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do pet
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pet excluído com sucesso
 *       404:
 *         description: Pet não encontrado
 */
petRouter.delete("/:id", usuarioAuth, excluirPet);

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Detalhar um pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do pet
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do pet
 *       404:
 *         description: Pet não encontrado
 */
petRouter.get("/:id", usuarioAuth, detalharPet);

export default petRouter;