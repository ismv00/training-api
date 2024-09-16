import { Request, Response } from "express";
import { secret } from "../auth/config";
import jwt from "jsonwebtoken";
import { prisma } from "../libs/prisma";
import { DaysOfWeek } from "../enums/daysOfWeek";

export const createWorkout = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, dayOfWeek } = req.body;

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

    const validDaysOfWeek =
      Array.isArray(dayOfWeek) &&
      dayOfWeek.every((day: number) => day >= 0 && day <= 6);
    if (!validDaysOfWeek) {
      return res.status(400).send("Dias da semana inválido.");
    }

    // Criando o novo treino

    const newWorkout = await prisma.workout.create({
      data: {
        name,
        dayOfWeek,
        userId: parseInt(userId),
      },
    });

    return res.status(201).json(newWorkout);
  } catch (error) {
    console.error("Erro ao criar treino:", error);
    return res.status(500).send("Erro interno do servidor");
  }
};

export const indexWorkouts = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send("Token não fornecido");
  }

  try {
    const decodedToken = jwt.verify(token, secret) as { id: number };
    if (!decodedToken || !decodedToken.id) {
      return res.status(401).send("Token Invalido");
    }

    const userTokenId = decodedToken.id;

    if (parseInt(userId) !== userTokenId) {
      return res.status(401).send("Usuário não autorizado");
    }

    //Busca se existe esse usuário informado
    // Encontra o usuário no banco de dado
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    if (!user) {
      return res.status(404).send("Usuário não encontrado");
    }

    const workouts = await prisma.workout.findMany({
      where: {
        userId: parseInt(userId),
      },

      include: { user: true, exercises: true },
    });

    return res.status(201).json(workouts);
  } catch (error) {
    console.error("Erro ao listar os treinos", error);
    return res.status(500).send("Erro interno no servidor.");
  }
};

export const deleteWorkout = async (req: Request, res: Response) => {
  const { userId, workoutId } = req.params;

  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send("Token não fornecido");
  }

  try {
    const decodedToken = jwt.verify(token, secret) as { id: number };

    if (!decodedToken || !decodedToken.id) {
      return res.status(401).send("Token inválido");
    }

    const userTokenId = decodedToken.id;

    if (parseInt(userId) !== userTokenId) {
      return res.status(401).send("Usuário não autorizado");
    }

    const workout = await prisma.workout.findUnique({
      where: {
        id: parseInt(workoutId),
      },
    });
    if (!workout || workout.userId !== parseInt(userId)) {
      return res
        .status(404)
        .send("Treino não encontrado ou não pertence a esse usuário.");
    }

    await prisma.workout.delete({
      where: { id: parseInt(workoutId) },
    });
    return res.status(200).send("Treino deletado com sucesso!");
  } catch (error) {
    console.error("Erro ao deletar o treino", error);
    return res.status(500).send("Erro interno no servidor");
  }
};
