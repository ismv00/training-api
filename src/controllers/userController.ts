import { Request, Response } from "express";
import { prisma } from "../libs/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";
import { secret } from "../auth/config";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.email, user.password, user.id);
    return res.json({ user: user.email, password: user.password, token });
  } catch (error) {
    res.status(400).json({ error: "E-mail already exists" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = generateToken(user.email, user.password, user.id);
  return res.json({ token: token });
};

export const index = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();

  return res.status(201).json(users);
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Verifica se o token está presente no cabeçalho da requisição
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).send("Token não fornecido");
    }

    // Verifica e decodifica o token
    const decodedToken = jwt.verify(token, secret) as { id: number };

    if (!decodedToken || !decodedToken.id) {
      return res.status(401).send("Token inválido");
    }

    const userTokenId = decodedToken.id;

    // Compara o ID do token com o ID do parâmetro
    if (parseInt(userId) !== userTokenId) {
      return res.status(401).send("Usuário não autorizado");
    }

    // Encontra o usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    if (!user) {
      return res.status(404).send("Usuário não encontrado");
    }

    // Deleta os treinos associados ao usuário
    await prisma.workout.deleteMany({
      where: {
        userId: parseInt(userId),
      },
    });

    // Deleta o usuário
    await prisma.user.delete({
      where: {
        id: parseInt(userId),
      },
    });

    return res.status(200).send("Usuário deletado com sucesso");
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return res.status(500).send("Erro interno do servidor");
  }
};
