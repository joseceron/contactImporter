require("dotenv").config();
const { Sequelize, DataTypes, Model } = require('sequelize');

const HOST = process.env.HOST
const DB_USER = process.env.DB_USER
const PASSWORD = process.env.PASSWORD
const DB = process.env.DB

let sequelizeConnector = new Sequelize(DB, DB_USER, PASSWORD, {
  host: HOST,
  dialect: 'postgres'
});

sequelizeConnector.authenticate().then(_=>{
  console.log('Authenticated')
}).catch(error => {
  console.log('Error Authentication')
  console.log(error)
})

const Contact = sequelizeConnector.define('Contacts', {
  address: { type: DataTypes.STRING, allowNull: true},
  credit_card: { type: DataTypes.STRING, allowNull: true},
  dof: {type: DataTypes.DATE, allowNull: true},
  email: { type: DataTypes.STRING, allowNull: true},
  file_name: { type: DataTypes.STRING, allowNull: true},
  franchise: { type: DataTypes.STRING, allowNull: true},
  name: { type: DataTypes.STRING, allowNull: true},
  phone: { type: DataTypes.STRING, allowNull: true},
  user_token: { type: DataTypes.STRING, allowNull: true},
}, {
  tableName: 'contacts', 
  underscored: true, 
  timestamps: true, 
  // createdAt: 'created_at',
  createdAt: false,
  updatedAt: false, 
  deletedAt: false
});

module.exports = {
  sequelizeConnector, 
  Contact,
};
