import { Request, Response } from "express";
import { prisma } from "../services/database.service";
import { z, ZodError } from "zod";
import { generateToken } from "./auth.controller";
import { compareSync } from "bcrypt";
import { hashPassword } from "./user.controller";

const clinicaCadastroSchema = z.object({
    nome_clinica: z.string(),
    endereco_clinica: z.string(),
    telefone_clinica: z.string(),
    foto_clinica: z.string(),
    senha_clinica: z.string(),
    avaliacao_clinica: z.number(),
    total_avaliacoes: z.number(),
    cnpj_clinica: z.string()
});

type ClinicaCadastroSchema = z.infer<typeof clinicaCadastroSchema>;


const clinicaLoginSchema = z.object({
    cnpj_clinica: z.string(),
    senha_clinica: z.string()
});

type ClinicaLoginSchema = z.infer<typeof clinicaLoginSchema>;

// listar clinicas
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

// cadastrar clinica
export const cadastrarClinica = async (req: Request, res: Response) => {
    try {
        const clinica: ClinicaCadastroSchema = clinicaCadastroSchema.parse(req.body);

        createClinica(clinica);

        res.send({ message: "Clinica cadastrada com sucesso" });
    } catch (error) {
        console.error("Erro ao cadastrar clínica:", error);
        if (error instanceof ZodError) {
            return res.status(400).json({
                "error": error.message
            });
        }
    }
};

export const createClinica = async (clinica: ClinicaCadastroSchema) => {
    const hashedPassword = hashPassword(clinica.senha_clinica)

    const novaClinica = await prisma.clinica.create({
        data: {
            nome_clinica: clinica.nome_clinica,
            endereco_clinica: clinica.endereco_clinica,
            telefone_clinica: clinica.telefone_clinica,
            foto_clinica: clinica.foto_clinica,
            senha_clinica: hashedPassword,
            avaliacao_clinica: clinica.avaliacao_clinica,
            total_avaliacoes: clinica.total_avaliacoes,
            cnpj_clinica: clinica.cnpj_clinica
        },
    });

    console.log("Clínica cadastrada com sucesso:", novaClinica);
    return novaClinica;
}

export const checkLoginClinica = async (clinica: ClinicaLoginSchema) => {
    const clinica_encontrada = await prisma.clinica.findUnique({
        where: {
            cnpj_clinica: clinica.cnpj_clinica,
        },
    });

    console.log("Clínica encontrada:", clinica_encontrada);

    if (clinica_encontrada) {
        const senhaCorreta = compareSync(clinica.senha_clinica, clinica_encontrada.senha_clinica);
        console.log("Senha correta:", senhaCorreta);
        return senhaCorreta;
    }

    return false;
}

export const loginClinica = async (req: Request, res: Response) => {
    try {

        const checkLogin = await checkLoginClinica(clinicaLoginSchema.parse(req.body));

        if (!checkLogin) {
            return res.status(401).json({ error: "Email ou senha inválidos" });
        }

        const tokenJWT = generateToken("CLINICA", req.body);
        res.json({ token: tokenJWT });

    } catch (error) {
        console.error("Erro ao fazer login:", error);
        if (error instanceof ZodError) {
            return res.status(400).json({
                "error": error.message
            });
        }
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
}


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


export const detalhesClinica = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const clinica = await prisma.clinica.findUnique({
            where: { id_clinica: Number(id) },
            include: {
                Avaliacao: true, // Incluindo as avaliações da clínica
            },
        });

        if (!clinica) {
            return res.status(404).json({ message: "Clínica não encontrada!" });
        }

        return res.status(200).json(clinica);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar detalhes da clínica", error });
    }
};