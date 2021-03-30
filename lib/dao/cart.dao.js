const Cart = require('../database/db').cart;

const createCartDAO = async data => Cart.create(data);

const getCartDAO = async userId => Cart.findOne({ where: { userId } });

const updateCartDAO = async (data, userId) => Cart.update(data, { where: { userId } });

const deleteCartDAO = async userId => Cart.destroy({ where: { userId } });

const createOrUpdateDAO = async (data, userId) => {
	const resp = await Cart.findOne({ where: { userId } });
	if (resp) {
		return Cart.update(data, { where: { userId } });
	} else {
		return Cart.create(data);
	}
};

module.exports = {
	createCartDAO,
	getCartDAO,
	updateCartDAO,
	deleteCartDAO,
	createOrUpdateDAO,
};
