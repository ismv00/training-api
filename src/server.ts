import express from "express";
import userRoutes from "./routes/userRoutes";
import workoutRoutes from "./routes/workoutRoutes";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);

app.listen(port, () => {
  console.log("Server is running");
});
