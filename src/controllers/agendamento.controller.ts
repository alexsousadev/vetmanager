import { Agendamento } from './../../node_modules/.prisma/client/index.d';
import { Request, Response, NextFunction } from "express";
import { verify } from 'jsonwebtoken';
import { prisma } from "../services/database.service";
import { sign } from "jsonwebtoken";
import { EnvConfig } from "../services/env.service";
import { z, ZodError } from "zod";

const agendamentoSchema = z.object({
    data_agendamento: z.date(),
    horario_agendamento: z.date(),
    status_agendamento: z.string(),
    id_servico: z.number(),
    id_pet: z.number(),
    id_usuario: z.number(),
    id_clinica: z.number(),
});


type AgendamentoType = z.infer<typeof agendamentoSchema>;


const agendarConsulta = async (req: Request, res: Response) => {
    const dados_agendamento = agendamentoSchema.parse(req.body);



}



const criarAgendamento = async (agendamento: AgendamentoType) => {

}