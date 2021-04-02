const { sequelize } = require('./lib/database/db');

const {
	addCart,
	getCart,
	updateCart,
	deleteCart,
	updateItemMultiplier,
	removeCondition,
} = require('./lib/controllers/cart.controller');

exports.createCart = async (content, globalConditions, userId) => {
	await sequelize.sync();
	return addCart(content, globalConditions, userId);
};

exports.getCart = async userId => {
	await sequelize.sync();
	return getCart(userId);
};

exports.updateCart = async (content, globalConditions, userId) => {
	await sequelize.sync();
	return updateCart(content, globalConditions, userId);
};

exports.deleteCart = async userId => {
	await sequelize.sync();
	return deleteCart(userId);
};

exports.updateItemMultiplier = async (userId, _itemId, multiplier) => {
	await sequelize.sync();
	return updateItemMultiplier(userId, _itemId, multiplier);
};

exports.removeCondition = async (userId, _itemId, _conditionId) => {
	await sequelize.sync();
	return removeCondition(userId, _itemId, _conditionId);
};
