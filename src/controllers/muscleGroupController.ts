import { Request, Response } from "express";
import { prisma } from '../libs/prisma';

export const getMuscleGroups = async (req:Request, res: Response) => {
  try {
    const mucleGroups = await prisma.muscleGroup.findMany();
    res.status(200).json(mucleGroups);
  } catch(error) {
    res.status(500).json({ error: "Erro ao buscar grupos musculares." });
  }
};

export const getExercisesByMuscleGroup = async (req:Request, res: Response) => {
  const { id } = req.params
  try {
    const exercises = await prisma.predefinedExercise.findMany({
      where: { muscleGroupId: parseInt(id)},
    });

    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar exercicios para o grupo muscular."})
  }
}