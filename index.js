const db = require('./lib/database/db');

const {
	addCart,
	getCart,
	updateCart,
	deleteCart,
	updateItemMultiplier,
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

exports.updateItemMultiplier = async (userId, _itemId, multiplier) => {
	await db.sequelize.sync();
	return updateItemMultiplier(userId, _itemId, multiplier);
};

exports.removeCondition = async (userId, _itemId, _conditionId) => {
	await db.sequelize.sync();
	return removeCondition(userId, _itemId, _conditionId);
};
