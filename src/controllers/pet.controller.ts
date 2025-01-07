import { PrismaService } from "../services/database.service";
import { Request, Response } from "express";

const prisma = new PrismaService();

// Listar
export const listarPets = async (req: Request, res: Response) => {
    
    try {
        const pet = await prisma.pet.findMany();

        if(!pet){
            res.json({message:"Nenhum pet encontrado."}).status(404);
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
        const{
            nome_pet,
            especie,
            raca,
            peso,
            id_usuario
        } = req.body;

        const novo_pet = await prisma.pet.create({
            data:{
                nome_pet,
                especie,
                raca,
                peso,
                id_usuario
            }
        });

        res.json(nome_pet);

    } catch (error) {
        console.error("Erro ao salvar pet:", error);
        throw error;
    }

}   