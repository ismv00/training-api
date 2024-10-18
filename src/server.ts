import express from "express";
import userRoutes from "./routes/userRoutes";
import workoutRoutes from "./routes/workoutRoutes";
import muscleGroupRoutes from './routes/muscleGroupRoutes';


const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);
app.use("/muscle", muscleGroupRoutes);


app.listen(port, () => {
  console.log("Server is running");
});
