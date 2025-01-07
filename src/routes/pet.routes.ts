import { Router } from "express";
import { listarPets, SalvarPet } from "../controllers/pet.controller";

const Pet_routes = Router();

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Endpoints para gerenciamento de pets
 */

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Lista todos os pets
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Lista de pets retornada com sucesso
 */
Pet_routes.get("/", listarPets);

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Cadastra um novo pet
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Rex
 *               raca:
 *                 type: string
 *                 example: Labrador
 *               idade:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Pet cadastrado com sucesso
 */
Pet_routes.post("/", SalvarPet);

export default Pet_routes;
