import { Router } from "express";
import { registrarServico, cadastrarTipoServico } from "../controllers/servico.controller";

export const servicoRoutes = Router();

servicoRoutes.post("/", registrarServico);
servicoRoutes.post("/all", registrarServico);
servicoRoutes.post("/tipos", cadastrarTipoServico);
servicoRoutes.post("/servicos/tipos", cadastrarTipoServico);


export default servicoRoutes;
