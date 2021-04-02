const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const Sequelize = require('sequelize');

const dbConfig = {
	db_host: 'localhost',
	db_user_name: 'cartuser',
	db_password: 'cartuser',
	db_name: 'cart',
	db_dialect: 'sqlite',
	db_pool: {
		max: 5,
		min: 0,
		acquire: 0,
		idle: 10000,
	},
};

const config = {
	host: dbConfig.db_host,
	dialect: dbConfig.db_dialect || 'sqlite',
	storage: 'cart.sqlite',
	operatorsAliases: 0,
	define: {
		freezeTableName: 0,
		timestamps: true,
	},
	pool: {
		max: dbConfig.db_pool.max,
		min: dbConfig.db_pool.min,
		acquire: dbConfig.db_pool.acquire,
		idle: dbConfig.db_pool.idle,
	},
	logging: false,
};

const sequelize = new Sequelize(
	dbConfig.db_name,
	dbConfig.db_user_name,
	dbConfig.db_password,
	config
);

const db = {};
fs.readdirSync(path.join(__dirname, 'models'))
	.filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
	.forEach(file => {
		const model = require(path.join(__dirname, 'models', file))(sequelize, Sequelize.DataTypes);
		db[model.name] = model;
	});

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

console.log(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
