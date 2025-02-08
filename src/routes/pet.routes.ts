import { Router } from "express";
import { listarPets, atualizarPet, excluirPet, detalharPet, cadastrarPet } from "../controllers/pet.controller";

const petRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Gerenciamento de Pets
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       properties:
 *         id_pet:
 *           type: integer
 *           example: 1
 *         nome_pet:
 *           type: string
 *           example: "Rex"
 *         especie_pet:
 *           type: string
 *           example: "Cachorro"
 *         raca_pet:
 *           type: string
 *           example: "Labrador"
 *         altura_pet:
 *           type: number
 *           example: 0.6
 *         peso_pet:
 *           type: number
 *           example: 30.5
 *         sexo_pet:
 *           type: string
 *           example: "Macho"
 */


/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Listar todos os pets do usuário
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pets
 */
petRouter.get("/", listarPets);

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
 *               especie_pet:
 *                 type: string
 *               raca_pet:
 *                 type: string
 *               altura_pet:
 *                 type: number
 *               peso_pet:
 *                 type: number
 *               sexo_pet:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pet salvo com sucesso
 */
petRouter.post("/", cadastrarPet);

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
 *               especie_pet:
 *                 type: string
 *               raca_pet:
 *                 type: string
 *               altura_pet:
 *                 type: number
 *               peso_pet:
 *                 type: number
 *               sexo_pet:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pet atualizado com sucesso
 *       404:
 *         description: Pet não encontrado
 */
petRouter.put("/:id", atualizarPet);

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
petRouter.delete("/:id", excluirPet);

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
petRouter.get("/:id", detalharPet);

export default petRouter;
