import { prisma } from "../services/database.service";
import { Request, Response } from "express";
import { z, ZodError } from "zod";
import { getIdOfToken } from "./auth.controller";

const petSchema = z.object({
    nome_pet: z.string().min(2, "Nome muito curto"),
    especie_pet: z.string(),
    raca_pet: z.string(),
    altura_pet: z.number().positive("Altura deve ser positiva"),
    peso_pet: z.number().positive("Peso deve ser positiva"),
    sexo_pet: z.enum(["M", "F"]),
});

type petSchema = z.infer<typeof petSchema>;

const servicoSchema = z.object({
    id_servico: z.number(),
    nome_servico: z.string(),
    descricao_servico: z.string(),
    preco_servico: z.number(),
});

const servicosSchema = z.array(servicoSchema);

// Fazer a listagem dos pets
export const listarPets = async (req: Request, res: Response) => {
    try {
        // Obter o ID do usuário
        const userId = await getIdOfToken(req, res);

        if (!userId) {
            return; // getIdOfToken already handles the error response
        }

        // Listar os pets do usuário
        const pets = await prisma.pet.findMany({
            where: { usuarioId_usuario: userId },
        });

        return res.status(200).json(pets);
    } catch (error) {
        console.error("Erro ao buscar pets:", error);
        return res.status(500).json({ message: "Erro ao buscar pets. Consulte os logs do servidor para mais detalhes." });
    }
};


// Fazer o cadastro do Pet
export const cadastrarPet = async (req: Request, res: Response) => {
    try {
        const pet: petSchema = petSchema.parse(req.body);

        const userId = await getIdOfToken(req, res);

        if (!userId) {
            return; // getIdOfToken already handles the error response
        }

        const novo_pet = await prisma.pet.create({
            data: {
                nome_pet: pet.nome_pet,
                especie_pet: pet.especie_pet,
                raca_pet: pet.raca_pet,
                altura_pet: pet.altura_pet,
                peso_pet: pet.peso_pet,
                sexo_pet: pet.sexo_pet,
                usuarioId_usuario: userId,
            }
        });

        return res.status(201).json(novo_pet);

    } catch (error) {
        console.error("Erro ao salvar pet:", error);
        if (error instanceof ZodError) {
            return res.status(400).json({ message: 'Erro de validação nos dados da requisição.', errors: error.errors });
        }
        return res.status(500).json({ message: "Erro ao cadastrar pet. Consulte os logs do servidor para mais detalhes." });
    }
};

export const atualizarPet = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nome_pet, especie_pet, raca_pet, peso_pet } = req.body;

    try {
        const userId = await getIdOfToken(req, res);
        if (!userId) {
            return; // getIdOfToken already handles the error response
        }

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: "ID do pet inválido." });
        }

        const pet = await prisma.pet.findUnique({
            where: { id_pet: Number(id) },
        });

        if (!pet) {
            return res.status(404).json({ message: "Pet não encontrado!" });
        }

        if (pet.usuarioId_usuario !== userId) {
            return res.status(403).json({ message: "Você não tem permissão para atualizar este pet." });
        }


        const petAtualizado = await prisma.pet.update({
            where: { id_pet: Number(id) },
            data: {
                nome_pet: nome_pet,
                especie_pet: especie_pet,
                raca_pet: raca_pet,
                peso_pet: peso_pet,
            },
        });

        return res.status(200).json(petAtualizado);
    } catch (error) {
        console.error("Erro ao atualizar pet:", error);
        return res.status(500).json({ message: "Erro ao atualizar pet. Consulte os logs do servidor para mais detalhes.", error });
    }
};

// excluir um pet
export const excluirPet = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const userId = await getIdOfToken(req, res);
        if (!userId) {
            return; // getIdOfToken already handles the error response
        }

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: "ID do pet inválido." });
        }


        const pet = await prisma.pet.findUnique({
            where: { id_pet: Number(id) },
        });

        if (!pet) {
            return res.status(404).json({ message: "Pet não encontrado!" });
        }

        if (pet.usuarioId_usuario !== userId) {
            return res.status(403).json({ message: "Você não tem permissão para excluir este pet!" });
        }

        await prisma.pet.delete({
            where: { id_pet: Number(id) },
        });

        return res.status(200).json({ message: "Pet excluído permanentemente!" });
    } catch (error) {
        console.error("Erro ao excluir pet:", error);
        return res.status(500).json({ message: "Erro ao excluir pet. Consulte os logs do servidor para mais detalhes.", error });
    }
};

// detalhar um pet
export const detalharPet = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const userId = await getIdOfToken(req, res);
        if (!userId) {
            return; // getIdOfToken already handles the error response
        }
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: "ID do pet inválido." });
        }

        const pet = await prisma.pet.findUnique({
            where: { id_pet: Number(id) },
        });

        if (!pet) {
            return res.status(404).json({ message: "Pet não encontrado!" });
        }

        if (pet.usuarioId_usuario !== userId) {
            return res.status(403).json({ message: "Você não tem permissão para acessar este pet!" });
        }

        return res.status(200).json(pet);
    } catch (error) {
        console.error("Erro ao buscar detalhes do pet:", error);
        return res.status(500).json({ message: "Erro ao buscar detalhes do pet. Consulte os logs do servidor para mais detalhes.", error });
    }
};