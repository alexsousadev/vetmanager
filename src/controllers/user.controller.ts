import { prisma } from "../services/database.service";
import { verify, JwtPayload } from "jsonwebtoken";
import { compareSync, hashSync } from "bcrypt";
import { Request, Response } from "express";
import { ZodError, z } from "zod";
import { generateToken, loginUsuario } from "./auth.controller";
import { EnvConfig } from "../services/env.service";

const JWT_KEY = EnvConfig.jwtsecret;

// validação do input de usuário
const userSchema = z.object({
  nome_usuario: z.string(),
  email_usuario: z.string().email(),
  senha_usuario: z.string().min(2),
  cpf: z.string(),
  foto_usuario: z.string().optional(),
});

type UserSchema = z.infer<typeof userSchema>;

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = hashSync(password, saltRounds); // bcrypt.hashSync is synchronous, no
  return hashedPassword;
};


// cadastro de usuario
export async function cadastroUsuario(req: Request, res: Response) {
  try {

    console.log("dados: ", req.body)

    const newUser: UserSchema = userSchema.parse(req.body);


    if (await checkHasUser(newUser.email_usuario)) {
      return res.status(409).json({ error: "Usuário já cadastrado" }); // 409 Conflict
    }

    if (await checkCpf(newUser.cpf)) {
      return res.status(409).json({ error: "CPF já cadastrado" }); // 409 Conflict
    }

    await createUser(newUser.nome_usuario, newUser.email_usuario, newUser.senha_usuario, newUser.cpf, newUser.foto_usuario || "");
    // return res.redirect("/login")
    res.send({ message: "Usuário cadastrado com sucesso" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: "Dados de entrada inválidos" });
    }
    return res
      .status(500)
      .json({ error: "Ocorreu um erro interno do servidor." });
  }
}

export async function checkLoginUser(userCredentials: loginUsuario) {
  try {

    console.log("usuario: ", userCredentials);
    if (!userCredentials.email_usuario) {
      console.error("Email do usuário não fornecido.");
      return null; // Retorna null ou false se o email não estiver presente
    }

    const user = await prisma.usuario.findUnique({
      where: {
        email_usuario: userCredentials.email_usuario, // Use o valor correto aqui
      }
    });

    if (user && (compareSync(userCredentials.senha_usuario, user.senha_usuario))) {
      return user; // Retorna o usuário encontrado
    }

    return false; // Retorna o usuário encontrado
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
}


// login de usuário
export async function loginUsuario(req: Request, res: Response) {
  try {
    const loginValidation = await checkLoginUser(req.body);

    if (loginValidation) {
      const tokenJWT = await generateToken("USUARIO", req.body);
      res.json({ token: tokenJWT });
    } else {
      res.status(401).json({ error: "Email ou senha inválidos" });
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}


// Checa se o usuário existe
export async function checkHasUser(email: string) {
  const user = await prisma.usuario.findUnique({
    where: { email_usuario: email }, // Busca o usuário pelo email
  });

  return !!user; // Retorna true se o usuário existir, false se não existir
}

export const checkCpf = async (cpf: string) => {
  const user = await prisma.usuario.findUnique({
    where: { cpf_usuario: cpf }, // Busca o usuário pelo email
  });

  return !!user; // Retorna true se o usuário existir, false se não existir
};

// cria um novo usuario
export const createUser = async (
  nome: string,
  email: string,
  senha: string,  // senha is still the plain text password here
  cpf: string,
  foto: string
) => {
  try {
    const hashedPassword = await hashPassword(senha); // Await the hashing!

    const newUser = await prisma.usuario.create({
      data: {
        nome_usuario: nome,
        email_usuario: email,
        senha_usuario: hashedPassword, // Now you're storing the *result* of the promise
        cpf_usuario: cpf,
        foto_usuario: foto,
      },
    });
    return newUser; // Return the created user object
  } catch (error) {
    console.error("Error creating user:", error);
    throw error; // Re-throw the error to be handled by your error middleware
  }
};



// pega id do usuario com base no token
const getIdUser = async (token: string) => {
  try {
    if (!JWT_KEY) {
      throw Error("JWT_SECRET_KEY não está definida no ambiente.");
    }

    if (token) {
      const decoded = await verifyTokenAsync(token, JWT_KEY);

      if (decoded && typeof decoded !== "string" && "email" in decoded) {
        const user = await prisma.usuario.findUnique({
          where: { email_usuario: decoded.email }, // Busca o usuário pelo email
        });

        if (!!user) {
          return user.id_usuario;
        }
      }
    }
  } catch (err) {
    console.error("Erro ao pegar o ID do usuário:", err);
    throw err; // Isso vai cair no bloco catch do router e causar o "internal server error"
  }
};

// Função para verificar o token de forma assíncrona
const verifyTokenAsync = (
  token: string,
  secret: string
): Promise<JwtPayload | string> => {
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
      id_usuario: id,
    },

    select: {
      nome_usuario: true,
    },
  });

  return user?.nome_usuario;
};



const getIdOfUser = async (email: string) => {
  const user = await prisma.usuario.findUnique({
    where: {
      email_usuario: email,
    },
  });

  return user?.id_usuario;
};

export { getIdUser, getNameUser, getIdOfUser };
