import { Request, Response } from "express";
import { secret } from "../auth/config";
import jwt from "jsonwebtoken";
import { prisma } from "../libs/prisma";

type imageType = string | null;

export const createExercises = async (req: Request, res: Response) => {
  const { workoutId } = req.params;
  const { predefinedExerciseId, sets, reps, startWeight, endWeight } = req.body.exercise;

  console.log("Requisicao recebida:", req.body);
  console.log("Parametros da requisicao:", req.params);

  // Converta os campos numéricos para inteiros
  const setsInt = parseInt(sets, 10);
  const repsInt = parseInt(reps, 10);
  const startWeightFloat = parseFloat(startWeight);
  const endWeightFloat = parseFloat(endWeight);

  // Verificando se os campos obrigatórios foram fornecidos.
  if(isNaN(setsInt) || isNaN(repsInt) || isNaN(startWeightFloat) || isNaN(endWeightFloat)) {
    return res.status(400).send("Todos os campos númericos devem ser fornecidos.")
  }

  if(setsInt <= 0 || repsInt <= 0 || startWeightFloat < 0 || endWeightFloat < 0 ) {
    return res.status(400).send("Os valores de séries e repeticoes devem ser positivos, e os pesos devem ser não negativos.")
  }
  

  //Verificar se foi enviado um arquivo e garantir que seja uma imagem
  const image: imageType = req.file ? req.file.filename : null;
  if(req.file && !req.file.mimetype.startsWith("image/")) {
    return res.status(400).send("Arquivo inválido. Apenas imagens são permitidas.")
  }

  // Verificar token de autenticação
  const token = req.headers.authorization?.replace("Bearer ", "");
  console.log("token enviado: " ,token)
  if (!token) {
    return res.status(401).send("Token não informado");
  }

  try {
    const decodedToken = jwt.verify(token, secret) as { id: number };

    if (!decodedToken || !decodedToken.id) {
      return res.status(401).send("Token inválido");
    }

    const userTokenId = decodedToken.id;

    //Verificar se o treino pertence ao usuário autenticado
    const workout = await prisma.workout.findUnique({
      where: { id: parseInt(workoutId) },
      include: { user: true },
    });

    console.log(workout)

    if (!workout || workout.userId !== userTokenId) {
      return res
        .status(404)
        .send("Treino não encontrado ou não pertence a esse usuário.");
    }

    //Criar o exercicio associado ao treino, com relação ao exercicio predefinido e grupo muscular
    const newExercise = await prisma.exercise.create({
      data: {
        sets: setsInt,
        reps: repsInt,
        startWeight: startWeightFloat,
        endWeight: endWeightFloat,
        image: image as string | null,
        workoutId: parseInt(workoutId),
        userId: userTokenId,
        predefinedExerciseId: predefinedExerciseId ? parseInt(predefinedExerciseId) : null,
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
      include: { user: true, workout: true, predefinedExercise: true },
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
