import express from 'express';
import {getMuscleGroups, getExercisesByMuscleGroup } from '../controllers/muscleGroupController';

const router = express.Router();

router.get("/muscle-groups", getMuscleGroups);
router.get("/muscle-groups/:id/exercises", getExercisesByMuscleGroup);

export default router;