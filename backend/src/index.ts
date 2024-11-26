import express from "express";
import sequelize from "./config/database";
import "./models/User";
import "./models/Driver";
import "./models/Ride";
import seedDrivers from "./seeds/seedDrivers";
import rideRoutes from "./routes/ride";
import cors from 'cors';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API is running!");
});

// Rotas
app.use("/ride", rideRoutes);

// Sincronizar banco de dados
sequelize
  .sync({ alter: true }) // Cria/atualiza as tabelas
  .then(async () => {
    console.log("Database synced successfully.");
    await seedDrivers(); // Popula o banco com os dados iniciais
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

// Inicializar o servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
