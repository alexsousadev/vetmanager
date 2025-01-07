import express from "express";
import {
    listarClinicas,
    cadastrarClinica,
    atualizarClinica,
    deletarClinica,
} from "../controllers/clinica.controller";

const routesClinicas = express.Router();


routesClinicas.get("/", listarClinicas); 
routesClinicas.post("/", cadastrarClinica); 
routesClinicas.put("/:id", atualizarClinica); 
routesClinicas.delete("/:id", deletarClinica); 

export default routesClinicas;
