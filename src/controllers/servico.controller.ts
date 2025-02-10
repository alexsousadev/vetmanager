import { prisma } from "../services/database.service";
import { Request, Response } from "express";
import { z } from "zod";

const servicoSchema = z.object({
    id_servico: z.number(),
    nome_servico: z.string(),
    descricao_servico: z.string(),
    preco_servico: z.number(),
    id_tipo_servico: z.number().nullable()
});

const servicosSchema = z.array(servicoSchema);

// registro de serviços
export const registrarServico = async (req: Request, res: Response) => {
    try {
        const servicos = servicosSchema.parse(req.body);

        console.log("Servicos: ", servicos);

        const servicosCriados = await Promise.all(
            servicos.map(async (servico) => {
                // Verifica se o serviço já existe
                const servicoExistente = await prisma.servico.findUnique({
                    where: { id_servico: servico.id_servico }
                });

                if (servicoExistente) {
                    // Atualiza o serviço existente
                    return prisma.servico.update({
                        where: { id_servico: servico.id_servico },
                        data: {
                            nome_servico: servico.nome_servico,
                            descricao_servico: servico.descricao_servico,
                            preco_servico: servico.preco_servico
                        }
                    });
                }

                // Cria um novo serviço
                return prisma.servico.create({
                    data: {
                        id_servico: servico.id_servico,
                        nome_servico: servico.nome_servico,
                        descricao_servico: servico.descricao_servico,
                        preco_servico: servico.preco_servico
                    }
                });
            })
        );

        return res.status(201).json({
            message: "Serviços registrados com sucesso",
            servicos: servicosCriados
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                message: "Erro ao registrar serviços",
                error: error.message
            });
        }
        return res.status(500).json({
            message: "Erro ao registrar serviços",
            error: "Erro desconhecido"
        });
    }
};

// Schema for TipoServico
const tipoServicoSchema = z.object({
    id_tipo_servico: z.number(),
    nome_tipo: z.string(),
    servicoId_servico: z.number()
});

const tiposServicoSchema = z.array(tipoServicoSchema);

// Function to register service types
export const cadastrarTipoServico = async (req: Request, res: Response) => {
    try {
        const tipos_servico = tiposServicoSchema.parse(req.body);

        // Check if the service exists
        const servico = await prisma.servico.findUnique({
            where: { id_servico: tipos_servico[0].servicoId_servico }
        });

        if (!servico) {
            return res.status(404).json({ message: "Serviço não encontrado" });
        }

        const tiposCriados = await Promise.all(
            tipos_servico.map(async (tipo) => {
                // Check if tipo already exists
                const tipoExistente = await prisma.tipoServico.findUnique({
                    where: { id_tipo_servico: tipo.id_tipo_servico }
                });

                if (tipoExistente) {
                    // Update if exists
                    return prisma.tipoServico.update({
                        where: { id_tipo_servico: tipo.id_tipo_servico },
                        data: {
                            nome_tipo: tipo.nome_tipo,
                            servicoId_servico: tipo.servicoId_servico
                        }
                    });
                }

                return prisma.tipoServico.create({
                    data: {
                        id_tipo_servico: tipo.id_tipo_servico,
                        nome_tipo: tipo.nome_tipo,
                        servicoId_servico: tipo.servicoId_servico
                    }
                });
            })
        );

        return res.status(201).json({
            message: "Tipos de serviço registrados com sucesso",
            tipos: tiposCriados
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                message: "Erro ao registrar tipos de serviço",
                error: error.message
            });
        }
        return res.status(500).json({
            message: "Erro ao registrar tipos de serviço",
            error: "Erro desconhecido"
        });
    }
};





const cadastrarServico = async (servico: z.infer<typeof servicoSchema>) => {
    try {
        const novoServico = await prisma.servico.create({
            data: {
                id_servico: servico.id_servico,
                nome_servico: servico.nome_servico,
                descricao_servico: servico.descricao_servico,
                preco_servico: servico.preco_servico
            }
        });
        return novoServico;
    } catch (error) {
        throw error;
    }
}

export { cadastrarServico };