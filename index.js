import {connection, authenticate} from "./config/database.js";
import { Cliente } from "./models/Cliente.js";
import { Endereco } from "./models/Endereco.js";
import { Pet } from "./models/Pet.js";

authenticate(connection).then(()=>{
    connection.sync() // connection.sync({force:true}); > dropa tudo do banco, útil em desenvolvimento.
});
