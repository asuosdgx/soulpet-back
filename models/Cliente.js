import { connection } from "../config/database.js";
import { DataTypes } from "sequelize";
import { Endereco } from "./Endereco.js";
import { Pet } from "./Pet.js";

export const Cliente = connection.define("cliente", {
    nome: {
        type:DataTypes.STRING(130),
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});
Cliente.hasOne(Endereco);
Endereco.belongsTo(Cliente); //gera uma chave estrangeira na tabela endereços
Cliente.hasMany(Pet);
Pet.belongsTo(Cliente);


