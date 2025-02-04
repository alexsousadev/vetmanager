
import { Request, Response } from "express";
import { PrismaService } from "../services/database.service";
import { sign, verify, JwtPayload } from "jsonwebtoken"
import { compare } from 'bcrypt';

export const prisma = new PrismaService();

const JWT_KEY = process.env.JWT_SECRET_KEY || 'secret dog'

// Validação do login
export async function checkLogin(email: string, password: string): Promise<boolean> {
    try {
        const user = await prisma.usuario.findUnique({ where: { email_usuario: email } });

        // Checar se o usuário existe e se a senha está correta
        if (user && (await compare(password, user.senha_usuario))) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Erro na validação de login:", error);
        throw error;
    }
}



// Checa se o usuário existe
export async function checkHasUser(email: string) {
    const user = await prisma.usuario.findUnique({
        where: { email_usuario: email },  // Busca o usuário pelo email
    });

    return !!user;  // Retorna true se o usuário existir, false se não existir
}


// cria um novo usuario 
export const createUser = async (nome: string, email: string, senha: string, cpf: string) => {
    await prisma.usuario.create({
        data: {
            nome_usuario: nome,
            email_usuario: email,
            senha_usuario: senha,
            cpf_usuario: cpf,
        },
    })
}

// geração do token
export const generateToken = (email: string) => {
    const JWT_KEY = process.env.JWT_SECRET_KEY

    if (!JWT_KEY) {
        throw new Error('JWT_SECRET_KEY não está definida no ambiente.');
    }

    const token = sign({ email }, JWT_KEY, { expiresIn: '1h' });
    return token;

}

// pega id do usuario com base no token
const getIdUser = async (token: string) => {
    try {
        if (!JWT_KEY) {
            throw Error('JWT_SECRET_KEY não está definida no ambiente.');
        }

        if (!token) {
            throw Error('Token não fornecido.');
        }

        const decoded = await verifyTokenAsync(token, JWT_KEY);

        console.log("Token decodificado:", decoded); // Debug

        if (!decoded || typeof decoded !== 'object' || !decoded.email) {
            throw new Error("Token inválido ou corrompido.");
        }

        const user = await prisma.usuario.findUnique({
            where: { email_usuario: decoded.email },
        });

        return user ? user.id_usuario : null;
    } catch (err) {
        console.error('Erro ao pegar o ID do usuário:', err);
        throw err;
    }
};

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Token não fornecido" });
        }

        const userId = await getIdUser(token);

        if (!userId) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const usuario = await prisma.usuario.findUnique({
            where: { id_usuario: userId },
            select: {
                id_usuario: true,
                cpf_usuario: true,
                nome_usuario: true,
                email_usuario: true,
            },
        });

        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        return res.status(200).json(usuario);
    } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error);
        return res.status(500).json({ message: "Erro ao buscar perfil do usuário", error });
    }
};



// Função para verificar o token de forma assíncrona
const verifyTokenAsync = (token: string, secret: string): Promise<JwtPayload | string> => {
    return new Promise((resolve, reject) => {
        verify(token, secret, (err, decoded) => {
            if (err || decoded == undefined) {
                return reject(err);
            }
            resolve(decoded);
        });
    });
};


// pega o nome de um usuário com base no id
const getNameUser = async (id: number) => {
    const user = await prisma.usuario.findUnique({
        where: {
            id_usuario: id
        },

        select: {
            nome_usuario: true
        }
    })

    return user?.nome_usuario;
}

export { getIdUser, getNameUser };