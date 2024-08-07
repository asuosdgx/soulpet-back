import { connection, authenticate } from "./config/database.js";
import express from "express";
import { clientesRouter } from './routes/Clientes.js';
import { petsRouter } from './routes/Pets.js';
import cors from "cors";

authenticate(connection).then(() => {
  connection.sync(); // connection.sync({force:true}); > dropa tudo do banco, útil em desenvolvimento.
});

// Definir a aplicação backend em Express
// Recursos pré-configurados

const app = express();
app.use(express.json());//Garante que as requisiçoes que tem body sejam lidas como json
app.use(cors({ origin: "http://localhost:5173" })); //CONFIG CORS > em origin colocar o url do front                                          
app.use(clientesRouter)
app.use(petsRouter)
// Rodar a aplicação backend
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000/");
});
