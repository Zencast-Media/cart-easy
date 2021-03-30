const joi = require('joi');

const USER_ID_RULE = joi.string().required('A Valid User ID is required');

const saveCartValidator = (content, globalConditions, userId) => {
	const CONDITION_RULES = {
		name: joi.string().required('Condition Name is required'),
		isPercentage: joi.boolean().required('Is Percentage Flag is required'),
		value: joi.any().when('isPercentage', {
			is: true,
			then: joi
				.number()
				.positive('Condition Value cannot be negative')
				.max(100, 'Percentage Value cannot be more than 100')
				.required('Condition Value is required'),
			otherwise: joi
				.number()
				.positive('Condition Value cannot be negative')
				.required('Condition Value is required'),
		}),
		action: joi.string().valid('ADD', 'SUB').required('Action is required'),
	};

	const schema = joi.object({
		userId: USER_ID_RULE,
		globalConditions: joi.array().items(joi.object().keys(CONDITION_RULES).unknown()),
		content: joi
			.array()
			.items(
				joi
					.object()
					.keys({
						price: joi
							.number()
							.positive('Item price cannot be negative')
							.required('Item price is required'),
						quantity: joi
							.number()
							.positive('Quantity cannot be negative')
							.required('Quantity is required'),
						conditions: joi.array().items(
							joi
								.object()
								.keys({
									...CONDITION_RULES,
									isGlobal: joi.boolean().required('Is Global Flag is required'),
									rank: joi.any().when('isGlobal', {
										is: true,
										then: joi
											.number()
											.min(1, 'Rank cannot be less than 1')
											.required('Rank is required when Is Global flag is true'),
										otherwise: joi.forbidden(),
									}),
								})
								.unknown()
						),
					})
					.unknown()
			)
			.required('Cart Item(s) are required'),
	});

	const { error } = schema.validate({ content, globalConditions, userId });
	if (error) {
		throw new Error(error.details[0].message);
	}

	// Extra Validation
	// content.forEach(({ conditions }) => {
	// 	if (conditions?.length > 0) {
	// 		const isAnyItemConditionGlobal = conditions.some(cond => cond.isGlobal);
	// 		const doesGlobalCondtionsContainRank = globalConditions.every(cond => cond.rank > 0);
	// 		if (isAnyItemConditionGlobal && !doesGlobalCondtionsContainRank) {
	// 			throw new Error(
	// 				'Global Conditions must contain a non-zero, positive rank if any of the Item Conditions are global'
	// 			);
	// 		}
	// 		if (!isAnyItemConditionGlobal && doesGlobalCondtionsContainRank) {
	// 			throw new Error(
	// 				"Global Conditions must not contain 'rank' if none of the Item Conditions are global"
	// 			);
	// 		}
	// 	}
	// });
};

const getCartValidator = userId => {
	const schema = joi.object({
		userId: USER_ID_RULE,
	});
	const { error } = schema.validate({ userId });
	if (error) {
		throw new Error(error.details[0].message);
	}
};

const updateQuantityValidator = (userId, _itemId, quantity) => {
	const schema = joi.object({
		userId: USER_ID_RULE,
		_itemId: joi.string().required('Item ID is required'),
		quantity: joi.number().positive('Quantity cannot be negative').required('Quantity is required'),
	});
	const { error } = schema.validate({ userId, _itemId, quantity });
	if (error) {
		throw new Error(error.details[0].message);
	}
};

const removeConditionValidator = (userId, _itemId, _conditionId) => {
	const schema = joi.object({
		userId: USER_ID_RULE,
		_itemId: joi.string().required('Item ID is required'),
		_conditionId: joi.string().required('Condition ID is required'),
	});
	const { error } = schema.validate({ userId, _itemId, _conditionId });
	if (error) {
		throw new Error(error.details[0].message);
	}
};

const deleteCartValidator = userId => {
	const schema = joi.object({
		userId: USER_ID_RULE,
	});
	const { error } = schema.validate({ userId });
	if (error) {
		throw new Error(error.details[0].message);
	}
};

module.exports = {
	saveCartValidator,
	getCartValidator,
	updateQuantityValidator,
	removeConditionValidator,
	deleteCartValidator,
};
