const { v4: uuid } = require('uuid');

const { createCartDAO, getCartDAO, updateCartDAO, deleteCartDAO } = require('../dao/cart.dao');
const failureMessage = require('../constant/failureMessage');
const { calculateCartSubTotal, calculateCartTotal } = require('../utility/CartCalculation');
const {
	saveCartValidator,
	getCartValidator,
	updateMultiplierValidator,
	removeConditionValidator,
	deleteCartValidator,
} = require('../validations/cart.validator');

const addCart = async (content, globalConditions, userId) => {
	try {
		saveCartValidator(content, globalConditions, userId);

		// Check if User ID is unique
		const cartExists = !!(await getCartDAO(userId));
		if (cartExists) {
			throw new Error(failureMessage.DUPLICATE_USER_ID);
		}
		const data = await composePayload(content, globalConditions, userId);
		await createCartDAO(data);
		return data;
	} catch (err) {
		throw new Error(err);
	}
};

const getCart = async userId => {
	try {
		getCartValidator(userId);
		const data = await getCartDAO(userId);
		return data;
	} catch (err) {
		throw new Error(err);
	}
};

const updateCart = async (content, globalConditions, userId) => {
	try {
		saveCartValidator(content, globalConditions, userId);
		const data = await composePayload(content, globalConditions, userId);
		await updateCartDAO(data, userId);
		return data;
	} catch (err) {
		throw new Error(err);
	}
};

const deleteCart = async userId => {
	try {
		deleteCartValidator(userId);
		await deleteCartDAO(userId);
		return true;
	} catch (err) {
		throw new Error(err);
	}
};

const updateItemMultiplier = async (userId, _itemId, multiplier) => {
	try {
		updateMultiplierValidator(userId, _itemId, multiplier);
		const cart = await getCartDAO(userId);
		if (!cart) {
			throw new Error(failureMessage.INVALID_USERID);
		}

		const concernedItemIndex = cart.content.findIndex(item => item._itemId === _itemId);
		// When Item ID is Wrong
		if (concernedItemIndex === -1) {
			throw new Error(failureMessage.INVALID_ITEM_ID);
		}

		// When Item multiplier is being set to Zero and Cart has only One item
		if (multiplier === 0 && cart.content.length === 1) {
			await deleteCartDAO(userId);
			return;
		}

		/* When incoming multiplier is greater than zero then it is updated accordingly or else
		the concerned item is removed from cart*/
		if (multiplier > 0) {
			cart.content[concernedItemIndex].multiplier = multiplier;
		} else {
			cart.content.splice(concernedItemIndex, 1);
		}

		// Updating Cart Calulations
		const data = await composePayload(cart.content, cart.globalConditions, userId);
		await updateCartDAO(data, userId);
		return data;
	} catch (error) {
		throw new Error(error);
	}
};

const removeCondition = async (userId, _itemId, _conditionId) => {
	try {
		removeConditionValidator(userId, _itemId, _conditionId);
		const cart = await getCartDAO(userId);
		if (!cart) {
			throw new Error(failureMessage.INVALID_USERID);
		}

		//Remove Global Condition
		if (!_itemId) {
			const concernedConditionIndex = cart.globalConditions.findIndex(
				condition => condition._conditionId === _conditionId
			);
			if (concernedConditionIndex === -1) {
				throw new Error(failureMessage.INVALID_GLOBAL_CONDITION_ID);
			}
			cart.globalConditions.splice(concernedConditionIndex, 1);
		}
		// Remove Item Condition
		if (_itemId) {
			const concernedItemIndex = cart.content.findIndex(item => item._itemId === _itemId);
			if (concernedItemIndex === -1) {
				throw new Error(failureMessage.INVALID_ITEM_ID);
			}
			const concernedConditionIndex = cart.content[concernedItemIndex].conditions.findIndex(
				condition => condition._conditionId === _conditionId
			);
			if (concernedConditionIndex === -1) {
				throw new Error(failureMessage.INVALID_ITEM_CONDITION_ID);
			}

			cart.content[concernedItemIndex].conditions.splice(concernedConditionIndex, 1);
		}

		// Updating Cart Calulations
		const data = await composePayload(cart.content, cart.globalConditions, userId);
		await updateCartDAO(data, userId);
		return data;
	} catch (error) {
		throw new Error(error);
	}
};

const composePayload = async (content, /*NOSONAR */ globalConditions = [], userId) => {
	const { subTotal, itemGlobalConditions } = await calculateCartSubTotal(content);
	const combinedGlobalConditions = [...(globalConditions || []), ...itemGlobalConditions].sort(
		(a, b) =>
			(a.rank === undefined) - (b.rank === undefined) || +(a.rank > b.rank) || -(a.rank < b.rank)
	);
	const total = calculateCartTotal(combinedGlobalConditions, subTotal);
	const globalConditionsWithId = globalConditions.map(condition => {
		if (!condition._conditionId) {
			condition['_conditionId'] = uuid();
		}
		return condition;
	});

	return {
		content,
		userId,
		globalConditions: globalConditionsWithId,
		subTotal: subTotal < 0 ? 0 : subTotal,
		total: total < 0 ? 0 : total,
	};
};

module.exports = {
	addCart,
	getCart,
	updateCart,
	deleteCart,
	updateItemMultiplier,
	removeCondition,
};
