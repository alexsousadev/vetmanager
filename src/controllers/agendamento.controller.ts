import { Request, Response } from "express";
import { prisma } from "../services/database.service";
import { z, ZodError } from "zod";
import { getIdOfToken } from './auth.controller';

const agendamentoSchema = z.object({
    data_agendamento: z.string().transform((val) => new Date(val)),
    horario_agendamento: z.string(),
    status_agendamento: z.string().default("AGENDADO"),
    id_tipo_servico: z.number(),
    id_pet: z.number(),
    id_clinica: z.number(),
});

type AgendamentoType = z.infer<typeof agendamentoSchema>;

const listarAgendamentos = async (req: Request, res: Response) => {
    try {
        const id = await getIdOfToken(req, res);

        if (!id) {
            if (!res.headersSent) {
                return res.status(401).json({
                    message: "Usuário não autenticado ou token inválido."
                });
            }
            return;
        }

        const agendamentos = await prisma.agendamento.findMany({
            where: { id_usuario: parseInt(id) },
            include: {
                pet: true,
                id_tipo_servico: true,
                clinica: true
            }
        });

        if (!agendamentos || agendamentos.length === 0) {
            if (!res.headersSent) {
                return res.status(404).json({
                    message: "Nenhum agendamento encontrado para este usuário."
                });
            }
            return;
        }

        if (!res.headersSent) {
            return res.status(200).json({
                count: agendamentos.length,
                agendamentos
            });
        }
    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        if (!res.headersSent) {
            return res.status(500).json({
                message: "Erro ao buscar agendamentos. Consulte os logs do servidor para mais detalhes."
            });
        }
    }
};


const agendarConsulta = async (req: Request, res: Response) => {
    try {
        const dados_agendamento = agendamentoSchema.parse(req.body);

        const idUsuario = await getIdOfToken(req, res);
        if (!idUsuario) {
            if (!res.headersSent) {
                return res.status(401).json({
                    message: "Usuário não autenticado ou token inválido."
                });
            }
            return;
        }

        if (dados_agendamento.data_agendamento < new Date()) {
            if (!res.headersSent) {
                return res.status(400).json({
                    message: "Não é possível agendar para uma data passada"
                });
            }
            return;
        }

        const pet = await prisma.pet.findFirst({
            where: {
                AND: [
                    { id_pet: dados_agendamento.id_pet },
                    { usuarioId_usuario: parseInt(idUsuario) }
                ]
            }
        });

        if (!pet) {
            if (!res.headersSent) {
                return res.status(404).json({
                    message: 'Pet não encontrado ou não pertence ao usuário'
                });
            }
            return;
        }

        const tipoServico = await prisma.tipoServico.findUnique({
            where: { id_tipo_servico: dados_agendamento.id_tipo_servico }
        });

        if (!tipoServico) {
            if (!res.headersSent) {
                return res.status(404).json({
                    message: 'Tipo de Serviço não encontrado'
                });
            }
            return;
        }

        const clinica = await prisma.clinica.findUnique({
            where: { id_clinica: dados_agendamento.id_clinica }
        });

        if (!clinica) {
            if (!res.headersSent) {
                return res.status(404).json({
                    message: 'Clínica não encontrada'
                });
            }
            return;
        }

        const agendamentoExistente = await prisma.agendamento.findFirst({
            where: {
                data_agendamento: dados_agendamento.data_agendamento,
                horario_agendamento: dados_agendamento.horario_agendamento,
                id_clinica: dados_agendamento.id_clinica,
                status_agendamento: "AGENDADO"
            }
        });

        if (agendamentoExistente) {
            if (!res.headersSent) {
                return res.status(409).json({
                    message: 'Já existe um agendamento neste horário para esta clínica'
                });
            }
            return;
        }

        const agendamento = await criarAgendamento(dados_agendamento, parseInt(idUsuario));

        if (!res.headersSent) {
            return res.status(201).json({
                message: "Agendamento criado com sucesso",
                agendamento
            });
        }
    } catch (error) {
        console.error("Erro ao criar agendamento:", error);

        if (error instanceof ZodError && !res.headersSent) {
            return res.status(400).json({
                message: 'Erro de validação nos dados da requisição.',
                errors: error.errors
            });
        }

        if (!res.headersSent) {
            return res.status(500).json({
                message: 'Ocorreu um erro inesperado ao agendar a consulta.'
            });
        }
    }
}

const criarAgendamento = async (agendamento: AgendamentoType, userId: number) => {
    try {
        return await prisma.agendamento.create({
            data: {
                data_agendamento: agendamento.data_agendamento,
                horario_agendamento: agendamento.horario_agendamento,
                status_agendamento: agendamento.status_agendamento,
                pet: { connect: { id_pet: agendamento.id_pet } },
                id_tipo_servico: { connect: { id_tipo_servico: agendamento.id_tipo_servico } },
                usuario: { connect: { id_usuario: userId } },
                clinica: { connect: { id_clinica: agendamento.id_clinica } }
            },
            include: {
                pet: true,
                id_tipo_servico: true,
                usuario: true,
                clinica: true
            }
        });
    } catch (error) {
        console.error("Erro ao criar agendamento:", error);
        throw error;
    }
}

const detalharAgendamento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            if (!res.headersSent) {
                return res.status(400).json({
                    message: "ID do agendamento inválido"
                });
            }
            return;
        }

        const idUsuario = await getIdOfToken(req, res);
        if (!idUsuario) {
            if (!res.headersSent) {
                return res.status(401).json({
                    message: "Usuário não autenticado ou token inválido."
                });
            }
            return;
        }

        const agendamento = await prisma.agendamento.findFirst({
            where: {
                AND: [
                    { id_agendamento: Number(id) },
                    { id_usuario: parseInt(idUsuario) }
                ]
            },
            include: {
                pet: true,
                id_tipo_servico: true,
                clinica: true
            }
        });

        if (!agendamento) {
            if (!res.headersSent) {
                return res.status(404).json({
                    message: "Agendamento não encontrado ou não pertence ao usuário!"
                });
            }
            return;
        }

        if (!res.headersSent) {
            return res.status(200).json(agendamento);
        }
    } catch (error) {
        console.error("Erro ao buscar detalhes do agendamento:", error);
        if (!res.headersSent) {
            return res.status(500).json({
                message: "Erro ao buscar detalhes do agendamento."
            });
        }
    }
};

export { agendarConsulta, criarAgendamento, listarAgendamentos, detalharAgendamento };