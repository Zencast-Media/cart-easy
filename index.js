const db = require('./lib/database/db');

const cart = exports;
const {
	addCart,
	getCart,
	updateCart,
	deleteCart,
	updateItemQuantity,
	removeCondition,
} = require('./lib/controllers/cart.controller');

cart.addCart = async (content, globalConditions, userId) => {
	await db.sequelize.sync();
	addCart(content, globalConditions, userId);
};

cart.getCart = async userId => {
	await db.sequelize.sync();
	return getCart(userId);
};
