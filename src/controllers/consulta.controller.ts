import { Request, Response } from "express";
import { prisma } from "../services/database.service";
import { z } from "zod";

const consultaSchema = z.object({
    data_consulta: z.string().or(z.date()).transform(val => new Date(val)),
    id_pet: z.number().positive(),
    id_clinica: z.number().positive(),
    nome_veterinario: z.string().min(3),
    diagnostico: z.string().min(10),
    prescricao: z.string().optional(),
    observacoes: z.string().optional()
});

type ConsultaData = z.infer<typeof consultaSchema>;

// Criar nova consulta
export const criarConsulta = async (req: Request, res: Response) => {
    try {
        const dados: ConsultaData = consultaSchema.parse(req.body);

        // Verifica pet e clínica em paralelo 
        const [pet, clinica] = await Promise.all([
            prisma.pet.findUnique({ where: { id_pet: dados.id_pet } }),
            prisma.clinica.findUnique({ where: { id_clinica: dados.id_clinica } })
        ]);

        if (!pet) {
            return res.status(404).json({ message: "Pet não encontrado" });
        }

        if (!clinica) {
            return res.status(404).json({ message: "Clínica não encontrada" });
        }

        const consulta = await prisma.consultaVeterinaria.create({
            data: {
                data_consulta: dados.data_consulta,
                petId_pet: dados.id_pet,
                clinicaId_clinica: dados.id_clinica,
                nome_veterinario: dados.nome_veterinario,
                diagnostico: dados.diagnostico,
                prescricao: dados.prescricao,
                observacoes: dados.observacoes
            },
            include: {
                pet: true,
                clinica: true
            }
        });

        return res.status(201).json(consulta);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ 
                message: "Dados inválidos", 
                errors: error.errors 
            });
        }
        console.error("Erro ao criar consulta:", error);
        return res.status(500).json({ message: "Erro interno ao criar consulta" });
    }
};

// Buscar histórico de consultas de um pet
export const buscarHistoricoConsultas = async (req: Request, res: Response) => {
    try {
        const { id_pet } = req.params;

        const pet = await prisma.pet.findUnique({
            where: { id_pet: Number(id_pet) }
        });

        if (!pet) {
            return res.status(404).json({ message: "Pet não encontrado" });
        }

        const consultas = await prisma.consultaVeterinaria.findMany({
            where: { petId_pet: Number(id_pet) },
            include: {
                clinica: {
                    select: {
                        nome_clinica: true,
                        telefone_clinica: true
                    }
                }
            },
            orderBy: {
                data_consulta: 'desc'
            }
        });

        return res.status(200).json({
            pet,
            consultas: consultas.length ? consultas : []
        });
    } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        return res.status(500).json({ message: "Erro ao buscar histórico de consultas" });
    }
};

// Buscar detalhes de uma consulta específica
export const buscarDetalhesConsulta = async (req: Request, res: Response) => {
    try {
        const { id_consulta } = req.params;

        const consulta = await prisma.consultaVeterinaria.findUnique({
            where: { id_consulta: Number(id_consulta) },
            include: {
                clinica: true,
                pet: {
                    include: {
                        id_usuario: true
                    }
                }
            }
        });

        if (!consulta) {
            return res.status(404).json({ message: "Consulta não encontrada" });
        }

        return res.status(200).json(consulta);
    } catch (error) {
        console.error("Erro ao buscar consulta:", error);
        return res.status(500).json({ message: "Erro ao buscar detalhes da consulta" });
    }
}; 