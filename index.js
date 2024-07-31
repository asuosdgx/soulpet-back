import { connection, authenticate } from "./config/database.js";
import { Cliente } from "./models/Cliente.js";
import { Endereco } from "./models/Endereco.js";
import { Pet } from "./models/Pet.js";
import express from "express";

authenticate(connection).then(() => {
  connection.sync(); // connection.sync({force:true}); > dropa tudo do banco, útil em desenvolvimento.
});

// Definir a aplicação backend em Express
// Recursos pré-configurados

const app = express();
app.use(express.json()); //Garante que as requisiçoes que tem body sejam lidas como json

// Definir os endpoints do backend
// Métodos: GET (leitura), POST (inserção), PUT (alteração), DELETE (remoção)
app.get("/hello", (req, res) => {
  // manipulador de rota
  res.send("Batata!"); // enviando a resposta para quem solicitou
});

// Listagem de todos os clientes
app.get("/clientes", async (req, res) => {
  // SELECT * FROM clientes;
  const listaClientes = await Cliente.findAll();
  res.json(listaClientes);
});

// Listagem de um cliente específico (ID = ?)
// :id => parâmetro de rota
app.get("/clientes/:id", async (req, res) => {
  // SELECT * FROM clientes WHERE id = 1;
  const cliente = await Cliente.findOne({
    where: { id: req.params.id },
    include: [Endereco], // juntar os dados do cliente com seu respectivo endereço
  });

  if (cliente) {
    res.json(cliente);
  } else {
    res.status(404).json({ message: "Cliente não encontrado!" });
  }
});

app.post("/clientes", async (req, res) => {
  const { nome, email, telefone, endereco } = req.body;

  try {
    await Cliente.create(
      { nome, email, telefone, endereco },
      { include: [Endereco] } //Indica que o endereço será salvo e associado ao cliente
    );
    res.json({ message: "Cliente criado com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Um erro ocorreu ao inserir o cliente." }); // 500 erro interno.
  }
});
app.put("/clientes/:id", async (req, res) => { //atualização de cadastro
  //checar se o cliente existe primeiro
  const idCliente = req.params.id // usando uma const para guardar o id
  const {nome, email, telefone, endereco} = req.body;
  try{
    const cliente = await Cliente.findOne({where: {id:idCliente}});// faz a verificação do id do cliente
    if(cliente){ //se ele existir
      await Endereco.update(endereco, {where: {clienteId:idCliente}}) // indicando onde será feita, caso o clienteId(sql) = idcliente
      await cliente.update({nome,email,telefone});
      res.json({message: "Cliente atualizado!"})
    }else{
      res.status(404).json({message:"O cliente não foi encontrado."})
    }
  }catch(err){
    res.status(500).json({message: "Ocorreu um erro ao atualizar o cliente."})
  }
});
app.delete("/clientes/:id", async (req, res)=>{
  const idCliente = req.params.id;
  

  try{
    const cliente = await Cliente.findOne({where: {id:idCliente}});
  
    if(cliente){
      await cliente.destroy();
    }else{
      res.status(404).json({ message: "Cliente não encontrado." })
    }
    }catch(err){
      res.status(500).json({ message: "Ocorreu um erro ao excluir o cliente." })
    
    }
  });

// Rodar a aplicação backend
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000/");
});
