import { Router } from "express";
import { listarPets, SalvarPet } from "../controllers/pet.controller";

const Pet_routes = Router();

Pet_routes.get("/",listarPets);
Pet_routes.post("/",SalvarPet);

export default Pet_routes