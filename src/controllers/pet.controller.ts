import { prisma } from "../services/database.service";
import { Request, Response } from "express";
import { z } from "zod";

const petSchema = z.object({
    nome_pet: z.string(),
    especie: z.string(),
    raca: z.string(),
    peso: z.number(),
    id_usuario: z.number()
});

type petSchema = z.infer<typeof petSchema>;

const servicoSchema = z.object({
    id_servico: z.number(),
    nome_servico: z.string(),
    descricao_servico: z.string(),
    preco_servico: z.number(),
});

const servicosSchema = z.array(servicoSchema);

// Listar
export const listarPets = async (req: Request, res: Response) => {

    try {
        const pet = await prisma.pet.findMany();

        if (!pet) {
            res.json({ message: "Nenhum pet encontrado." }).status(404);
        }

        res.json(pet);

    } catch (error) {
        console.error("Erro ao buscar pet:", error);
        throw error;
    }

}

// Salvar
export const SalvarPet = async (req: Request, res: Response) => {

    try {

        const pet: petSchema = petSchema.parse(req.body);


        console.log("dados: ", req.body)

        const novo_pet = await prisma.pet.create({
            data: {
                nome_pet: pet.nome_pet,
                especie: pet.especie,
                raca: pet.raca,
                peso: pet.peso,
                usuarioId_usuario: pet.id_usuario
            }
        });

        res.json(novo_pet);

    } catch (error) {
        console.error("Erro ao salvar pet:", error);
        throw error;
    }

}

export const atualizarPet = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nome_pet, especie, raca, peso, id_usuario } = req.body;

    try {
        const pet = await prisma.pet.findUnique({
            where: { id_pet: Number(id) },
        });

        if (!pet) {
            return res.status(404).json({ message: "Pet não encontrado!" });
        }

        const petAtualizado = await prisma.pet.update({
            where: { id_pet: Number(id) },
            data: {
                nome_pet,
                especie,
                raca,
                peso,
                id_usuario,
            },
        });

        return res.status(200).json(petAtualizado);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao atualizar pet", error });
    }
};

export const excluirPet = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const pet = await prisma.pet.findUnique({
            where: { id_pet: Number(id) },
        });

        if (!pet) {
            return res.status(404).json({ message: "Pet não encontrado!" });
        }

        await prisma.pet.delete({
            where: { id_pet: Number(id) },
        });

        return res.status(200).json({ message: "Pet excluído permanentemente!" });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao excluir pet", error });
    }
};

export const detalharPet = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const pet = await prisma.pet.findUnique({
            where: { id_pet: Number(id) },
        });

        if (!pet) {
            return res.status(404).json({ message: "Pet não encontrado!" });
        }

        return res.status(200).json(pet);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar detalhes do pet", error });
    }
};

export const registrarServico = async (req: Request, res: Response) => {
    try {
        const servicos = servicosSchema.parse(req.body);

        const servicosCriados = await Promise.all(servicos.map(servico =>
            prisma.servico.create({
                data: {
                    id_servico: servico.id_servico,
                    nome_servico: servico.nome_servico,
                    descricao_servico: servico.descricao_servico,
                    preco_servico: servico.preco_servico,
                }
            })
        ));

        return res.status(201).json(servicosCriados);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao registrar serviços", error });
    }
};