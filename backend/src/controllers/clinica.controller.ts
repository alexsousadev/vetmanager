import { Request, Response } from "express";
import { PrismaService } from "../services/database.service";

const prisma = new PrismaService();


export const listarClinicas = async (req: Request, res: Response) => {
    try {
        const clinicas = await prisma.clinica.findMany({
            include: {
                Avaliacao: true,
            },
        });

        if (!clinicas || clinicas.length === 0) {
            return res.status(404).json({ message: "Nenhuma clínica encontrada!" });
        }

        return res.status(200).json(clinicas);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao listar clínicas", error });
    }
};



export const cadastrarClinica = async (req: Request, res: Response) => {
    try {
        console.log("Dados recebidos no body:", req.body);

        const { 
            nome_clinica, 
            endereco_clinica,
            telefone_clinica,
            foto_clinica,
            avaliacao_clinica,
            total_avaliacoes,
            latitude,
            longitude
        } = req.body;

        if (!nome_clinica || !endereco_clinica || !telefone_clinica || !foto_clinica || !avaliacao_clinica || total_avaliacoes === undefined || latitude === undefined || longitude === undefined) {
            console.log("Erro de validação: Campos obrigatórios ausentes");
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }

        const novaClinica = await prisma.clinica.create({
            data: {
                nome_clinica,
                endereco_clinica,
                telefone_clinica,
                foto_clinica,
                avaliacao_clinica,
                total_avaliacoes,
                latitude,
                longitude
            },
        });

        console.log("Clínica cadastrada com sucesso:", novaClinica);
        return res.status(201).json(novaClinica);
    } catch (error) {
        console.error("Erro ao cadastrar clínica:", error);
        return res.status(500).json({ message: "Erro ao cadastrar clínica", error });
    }
};



export const atualizarClinica = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            nome_clinica,
            endereco_clinica,
            telefone_clinica,
            foto_clinica,
            avaliacao_clinica,
            total_avaliacoes,
        } = req.body;

        const clinica = await prisma.clinica.findUnique({
            where: { id_clinica: Number(id) },
        });

        if (!clinica) {
            return res.status(404).json({ message: "Clínica não encontrada!" });
        }

        const clinicaAtualizada = await prisma.clinica.update({
            where: { id_clinica: Number(id) },
            data: {
                nome_clinica,
                endereco_clinica,
                telefone_clinica,
                foto_clinica,
                avaliacao_clinica,
                total_avaliacoes,
            },
        });

        return res.status(200).json(clinicaAtualizada);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao atualizar clínica", error });
    }
};


export const deletarClinica = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const clinica = await prisma.clinica.findUnique({
            where: { id_clinica: Number(id) },
        });

        if (!clinica) {
            return res.status(404).json({ message: "Clínica não encontrada!" });
        }

        await prisma.clinica.delete({
            where: { id_clinica: Number(id) },
        });

        return res.status(200).json({ message: "Clínica deletada com sucesso!" });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao deletar clínica", error });
    }
};
