const { cart } = require('../database/db');

const createCartDAO = async data => cart.create(data);

const getCartDAO = async userId => cart.findOne({ where: { userId } });

const updateCartDAO = async (data, userId) => cart.update(data, { where: { userId } });

const deleteCartDAO = async userId => cart.destroy({ where: { userId } });

const createOrUpdateDAO = async (data, userId) => {
	const resp = await cart.findOne({ where: { userId } });
	if (resp) {
		return cart.update(data, { where: { userId } });
	} else {
		return cart.create(data);
	}
};

module.exports = {
	createCartDAO,
	getCartDAO,
	updateCartDAO,
	deleteCartDAO,
	createOrUpdateDAO,
};
