const { v4: uuid } = require('uuid');
const ACTIONS = {
	ADD: 'ADD',
	SUB: 'SUB',
};

const getConditonalValue = async (conditions, currentPrice = 0) => {
	let variations = 0;
	let itemTotal = 0;
	const itemGlobals = [];
	for (const condition of conditions) {
		const { isPercentage, action, value, isGlobal } = condition;
		if (!condition._conditionId) condition['_conditionId'] = uuid();
		if (isGlobal) {
			itemGlobals.push(condition);
		} else {
			const variation = isPercentage ? (value / 100) * currentPrice : value;
			if (action === ACTIONS.SUB) {
				variations = variations - variation;
			} else {
				variations = variations + variation;
			}
			itemTotal = currentPrice + variations;
		}
	}
	return { itemTotal, itemGlobals };
};

const calculateCartSubTotal = async items => {
	let subTotal = 0;
	let itemGlobalConditions;
	for (const item of items) {
		const { conditions, price, quantity } = item;
		if (!item._itemId) item['_itemId'] = uuid();
		const { itemTotal, itemGlobals } = await getConditonalValue(conditions, price * quantity);
		itemGlobalConditions = itemGlobals;
		subTotal += itemTotal;
	}
	return { subTotal, itemGlobalConditions };
};

const calculateCartTotal = (globalConditions, subTotal) => {
	let currentTotal = subTotal;
	for (const { isPercentage, action, value } of globalConditions) {
		let variations = 0;
		const variation = isPercentage ? (value / 100) * currentTotal : value;
		if (action === ACTIONS.SUB) {
			variations = variations - variation;
		} else {
			variations = variations + variation;
		}
		currentTotal = currentTotal + variations;
	}
	return currentTotal;
};

module.exports = {
	calculateCartSubTotal,
	getConditonalValue,
	calculateCartTotal,
};
