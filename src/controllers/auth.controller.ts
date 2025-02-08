import { Request, Response, NextFunction } from "express";
import { verify } from 'jsonwebtoken';
import { prisma } from "../services/database.service";
import { sign } from "jsonwebtoken";
import { EnvConfig } from "../services/env.service";
import { getIdOfUser } from "./user.controller";

// Add this at the top of the file, after the imports
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const JWT_KEY = EnvConfig.jwtsecret;


// Tipos de login
export type loginClinica = {
    cnpj_clinica: string;
    senha_clinica: string;
};

export type loginUsuario = {
    id_usuario: string; // teste
    email_usuario: string;
    senha_usuario: string;
};

export type LoginType = "USUARIO" | "CLINICA";


// Estrutura para o Payload
interface BaseAuthPayload {
    id: string;
    email: string;
    type: LoginType;
    iat?: number;
    exp?: number;
}

interface UsuarioPayload extends BaseAuthPayload {
    type: "USUARIO";
    cpf: string;
}

interface ClinicaPayload extends BaseAuthPayload {
    type: "CLINICA";
    cnpj: string;
}

export type AuthPayload = UsuarioPayload | ClinicaPayload;

export const typePayload = (
    typeLogin: LoginType,
    dataLogin: loginUsuario | loginClinica
) => {

    return {
        dataLogin,
        role: typeLogin,
    };
};

// Middleware factory that creates role-specific middleware
const createRoleMiddleware = (allowedRoles: LoginType[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Acesso não autorizado - Token não fornecido' });
        }

        const token = authHeader.split(' ')[1];


        try {
            const decoded = verify(token, JWT_KEY) as { payload: { role: LoginType } };

            if (!allowedRoles.includes(decoded.payload.role)) {
                return res.status(403).json({
                    error: 'Acesso negado - Você não tem permissão para acessar este recurso'
                });
            }

            req.user = decoded;
            next();
        } catch (err) {
            console.error('Erro na verificação do token:', err);
            return res.status(401).json({ error: 'Token inválido ou expirado' });
        }
    };
};



// Specific middleware for usuario-only routes
export const usuarioAuth = createRoleMiddleware(['USUARIO']);

// Specific middleware for clinica-only routes
export const clinicaAuth = createRoleMiddleware(['CLINICA']);


// logout
const finalizarSessao = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Erro ao encerrar a sessão.");
        }
        res.redirect("/");
    });

}

// middlewere para verificação do login
function loginAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso não autorizado - Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = verify(token as string, JWT_KEY);
        console.log("token decodificado: \n", decodedToken);
        next();
    } catch (err) {
        console.error('Erro de verificação do token:', err);
        return res.status(401).json({ error: 'Token inválido.' });
    }
}


// Validação do login (de clinica e de usuario)
export async function checkLogin(
    credentials: loginUsuario | loginClinica
): Promise<boolean> {
    try {
        let record;

        if ("email_usuario" in credentials) {
            record = await prisma.usuario.findUnique({
                where: { email_usuario: credentials.email_usuario }
            });
        } else {
            record = await prisma.clinica.findUnique({
                where: { cnpj_clinica: credentials.cnpj_clinica },
            });
            console.log("\nResultado: ", record, "\n");
        }

        if (record) return true;

        return false;
    } catch (error) {
        console.error("Erro na validação de login:", error);
        throw error;
    }
}

// gerar Token para autenticação
export const generateToken = async (
    typeLogin: LoginType,
    dataLogin: loginUsuario | loginClinica
) => {
    const payload = typePayload(typeLogin, dataLogin);
    let email = "";

    if (typeLogin === 'USUARIO') { // Example: Adjust conditions based on your types
        email = (dataLogin as loginUsuario).email_usuario; // Type assertion
    } else if (typeLogin === 'CLINICA') {
        email = (dataLogin as loginClinica).cnpj_clinica; // Assuming this property exists
    } else {
        throw new Error("Tipo de login inválido."); // Handle invalid login types
    }

    console.log("email: ", email);
    const id = await getIdOfUser(email);

    console.log("id: ", id);


    if (!JWT_KEY) {
        throw new Error("JWT_SECRET_KEY não está definida no ambiente.");
    }

    const token = sign({ payload, id }, JWT_KEY, { expiresIn: "1h" });
    console.log("token: ", token);
    return token;
};

// Função para decodificar o token
export const decodeToken = (token: string) => {
    try {
        const decoded = verify(token, JWT_KEY);
        return decoded;
    } catch (err) {
        console.error('Erro ao decodificar o token:', err);
        throw new Error('Token inválido.');
    }
};


// pegar o Id do Token JWT
export const getIdOfToken = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Token não fornecido' });
        return null; // Retorna null para indicar que não há token válido
    }

    const token = authHeader.split(' ')[1];

    try {
        // Decodificar o token para obter o ID do usuário
        const decoded = decodeToken(token) as any;

        if (!decoded || typeof decoded.id === 'undefined') {
            res.status(401).json({ error: 'Token inválido ou ID do usuário não encontrado no token' });
            return null; // Retorna null se a decodificação falha ou 'id' não existe
        }

        const userId = decoded.id;
        return userId;

    } catch (error) {
        console.error("Erro ao decodificar token:", error);
        res.status(401).json({ error: 'Token inválido' });
        return null; // Retorna null em caso de erro na decodificação
    }
}


export { loginAuth, finalizarSessao };