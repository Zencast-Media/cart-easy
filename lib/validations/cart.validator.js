const joi = require('joi');

const USER_ID_RULE = joi.string().required();

const saveCartValidator = (content, globalConditions, userId) => {
	const CONDITION_RULES = {
		name: joi.string().required(),
		isPercentage: joi.boolean().required(),
		value: joi.any().when('isPercentage', {
			is: true,
			then: joi.number().positive().max(100).required(),
			otherwise: joi.number().positive().required(),
		}),
		action: joi.string().valid('ADD', 'SUB').required(),
	};

	const schema = joi.object({
		userId: USER_ID_RULE,
		globalConditions: joi.array().items(
			joi
				.object()
				.keys({
					...CONDITION_RULES,
					rank: joi
						.number()
						.min(1)
						.when(
							joi.ref('/globalConditions', {
								adjust: value => value.length > 1,
							}),
							{
								is: true,
								then: joi.required(),
								otherwise: joi.optional(),
							}
						),
				})
				.unknown()
		),
		content: joi
			.array()
			.items(
				joi
					.object()
					.keys({
						price: joi.number().positive().required(),
						quantity: joi.number().positive().required(),
						conditions: joi.array().items(
							joi
								.object()
								.keys({
									...CONDITION_RULES,
									isGlobal: joi.boolean().required(),
									rank: joi.any().when('isGlobal', {
										is: true,
										then: joi.number().min(1).required(),
										otherwise: joi.forbidden(),
									}),
								})
								.unknown()
						),
					})
					.unknown()
			)
			.required(),
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
	const schema = joi.object({ userId: USER_ID_RULE });
	const { error } = schema.validate({ userId });
	if (error) {
		throw new Error(error.details[0].message);
	}
};

const updateQuantityValidator = (userId, _itemId, quantity) => {
	const schema = joi.object({
		userId: USER_ID_RULE,
		_itemId: joi.string().required(),
		quantity: joi.number().positive().required(),
	});
	const { error } = schema.validate({ userId, _itemId, quantity });
	if (error) {
		throw new Error(error.details[0].message);
	}
};

const removeConditionValidator = (userId, _itemId, _conditionId) => {
	const schema = joi.object({
		userId: USER_ID_RULE,
		_itemId: joi.string().required(),
		_conditionId: joi.string().required(),
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
