const db = require('./lib/database/db');

const {
	addCart,
	getCart,
	updateCart,
	deleteCart,
	updateItemQuantity,
	removeCondition,
} = require('./lib/controllers/cart.controller');

exports.addCart = async (content, globalConditions, userId) => {
	await db.sequelize.sync();
	return addCart(content, globalConditions, userId);
};

exports.getCart = async userId => {
	await db.sequelize.sync();
	return getCart(userId);
};

exports.updateCart = async (content, globalConditions, userId) => {
	await db.sequelize.sync();
	return updateCart(content, globalConditions, userId);
};

exports.deleteCart = async userId => {
	await db.sequelize.sync();
	return deleteCart(userId);
};

exports.updateItemQuantity = async (userId, _itemId, quantity) => {
	await db.sequelize.sync();
	return updateItemQuantity(userId, _itemId, quantity);
};

exports.removeCondition = async (userId, _itemId, _conditionId) => {
	await db.sequelize.sync();
	return removeCondition(userId, _itemId, _conditionId);
};
