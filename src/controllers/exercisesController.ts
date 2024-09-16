import { Request, Response } from "express";
import { secret } from "../auth/config";
import jwt from "jsonwebtoken";
import { prisma } from "../libs/prisma";
import path from "path";

type imageType = string | null;

export const createExercises = async (req: Request, res: Response) => {
  const { workoutId } = req.params;
  const { name, sets, reps, startWeight, endWeight } = req.body;

  // Converta os campos numéricos para inteiros
  const setsInt = parseInt(sets, 10);
  const repsInt = parseInt(reps, 10);
  const startWeightFloat = parseFloat(startWeight);
  const endWeightFloat = parseFloat(endWeight);

  //Verificar se foi enviado um arquivo
  const image: imageType = req.file ? req.file.filename : null;

  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send("Token não informado");
  }
  try {
    const decodedToken = jwt.verify(token, secret) as { id: number };

    if (!decodedToken || !decodedToken.id) {
      return res.status(401).send("Token inválido");
    }

    const userTokenId = decodedToken.id;

    const workout = await prisma.workout.findUnique({
      where: { id: parseInt(workoutId) },
      include: { user: true },
    });

    if (!workout || workout.userId !== userTokenId) {
      return res
        .status(404)
        .send("Treino não encontrado ou não pertence a esse usuário.");
    }

    const newExercise = await prisma.exercise.create({
      data: {
        name,
        sets: setsInt,
        reps: repsInt,
        startWeight: startWeightFloat,
        endWeight: endWeightFloat,
        image: image as string | null,
        workoutId: parseInt(workoutId),
        userId: userTokenId,
      },
    });

    return res.status(201).json(newExercise);
  } catch (error) {
    console.error("Erro ao criar exercício", error);
    return res.status(500).send("Erro interno no servidor");
  }
};

export const indexExercises = async (req: Request, res: Response) => {
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

    const exercises = await prisma.exercise.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: { user: true, workout: true },
    });

    return res.status(201).json(exercises);
  } catch (error) {
    console.error("Erro ao listar os treinos", error);
    return res.status(500).send("Erro interno no servidor.");
  }
};

export const deleteExercise = async (req: Request, res: Response) => {
  const { workoutId, exerciseId, userId } = req.params;

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send("Token não informado");
  }

  try {
    const decodedToken = jwt.verify(token, secret) as { id: number };
    if (!decodedToken || decodedToken.id !== parseInt(userId)) {
      return res.status(401).send("Token inválido ou usuário não autorizado");
    }

    // Verifica se o treino pertence ao usuário logado
    const workout = await prisma.workout.findUnique({
      where: { id: parseInt(workoutId) },
      include: { user: true },
    });

    if (!workout || workout.userId !== decodedToken.id) {
      return res
        .status(404)
        .send("Treino não encontrado ou não pertence a esse usuário.");
    }

    // Verifica se o exercício existe e pertence ao treino
    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(exerciseId), workoutId: parseInt(workoutId) },
    });

    if (!exercise) {
      return res
        .status(404)
        .send("Exercício não encontrado ou não pertence a esse treino.");
    }

    // Deleta o exercício
    await prisma.exercise.delete({
      where: { id: parseInt(exerciseId) },
    });

    return res.status(200).send("Exercício deletado com sucesso.");
  } catch (error) {
    console.error("Erro ao deletar exercício", error);
    return res.status(500).send("Erro interno no servidor.");
  }
};
