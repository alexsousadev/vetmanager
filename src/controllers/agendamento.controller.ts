import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../services/database.service";

const agendamentoSchema = z.object({
    data_agendamento: z.string(),
    horario_agendamento: z.string(),
    id_servico: z.number(),
    id_pet: z.number(),
    id_usuario: z.number(),
    id_clinica: z.number(),
}).transform((data) => {
    // Combine date and time into a single DateTime string
    const dataHora = `${data.data_agendamento}T${data.horario_agendamento}:00.000Z`;
    return {
        ...data,
        data_agendamento: new Date(dataHora),
    };
});

type AgendamentoType = z.infer<typeof agendamentoSchema>;

const criarAgendamento = async (agendamento: AgendamentoType) => {
    // Verifica se as datas são válidas
    if (isNaN(agendamento.data_agendamento.getTime())) {
        throw new Error("Invalid date provided");
    }

    const novoAgendamento = await prisma.agendamento.create({
        data: {
            data_agendamento: agendamento.data_agendamento,
            horario_agendamento: agendamento.horario_agendamento,
            petId: agendamento.id_pet,
            servicoId: agendamento.id_servico,
            usuarioId: agendamento.id_usuario,
            clinicaId: agendamento.id_clinica,
        }
    });

    return novoAgendamento;
};

const agendarConsulta = async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        const dados_agendamento = agendamentoSchema.parse(req.body);
        const novoAgendamento = await criarAgendamento(dados_agendamento);
        console.log(novoAgendamento)
        res.status(201).json(novoAgendamento);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors
            });
        } else {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
};


const cancelarAgendamento = async (req: Request, res: Response) => {
    try {
        const id_agendamento = req.params.id;

        const agendamento = await prisma.agendamento.findUnique({
            where: { id_agendamento: Number(id_agendamento) },
        });

        if (!agendamento) {
            return res.status(404).json({ message: "Agendamento não encontrado" });
        }

        await prisma.agendamento.update({
            where: { id_agendamento: Number(id_agendamento) },
            data: {
                status_agendamento: "Cancelado",
            },
        });

        return res.status(200).json({ message: "Agendamento cancelado com sucesso" });
    } catch (error) {
        console.error("Error details:", error);
        return res.status(500).json({ message: "Erro ao cancelar agendamento", error });
    }
};


export { agendamentoSchema, agendarConsulta, cancelarAgendamento }