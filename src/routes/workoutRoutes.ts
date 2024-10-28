import express from "express";
import upload from "../midleware/upload";

import {
  createWorkout,
  indexWorkouts,
  deleteWorkout,
  getWorkoutExercises,
} from "../controllers/workoutController";
import {
  createExercises,
  deleteExercise,
  indexExercises,
} from "../controllers/exercisesController";

const Router = express.Router();

Router.post("/:userId", createWorkout);
Router.get("/:userId", indexWorkouts);
Router.delete("/:userId/:workoutId", deleteWorkout);

Router.post("/:workoutId/exercises", upload.single("image"), createExercises);
Router.get("/:userId/exercises", indexExercises);
Router.delete("/:userId/:workoutId/exercises/:exerciseId", deleteExercise);
Router.get("/:userId/:workoutId/exercises",getWorkoutExercises)

export default Router;
