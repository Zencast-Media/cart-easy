const joi = require('joi');

const USER_ID_RULE = joi.string().required();

const DISABLE_CONVERT = { convert: false };

const saveCartValidator = (content, globalConditions, userId, isUpdate = false) => {
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
						name: joi.string().required(),
						price: joi.number().positive().required(),
						multiplier: joi
							.number()
							.min(isUpdate ? 0 : 1)
							.required(),
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

	const { error } = schema.validate({ content, globalConditions, userId }, DISABLE_CONVERT);
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
	const { error } = schema.validate({ userId }, DISABLE_CONVERT);
	if (error) {
		throw new Error(error.details[0].message);
	}
};

const updateMultiplierValidator = (userId, _itemId, multiplier) => {
	const schema = joi.object({
		userId: USER_ID_RULE,
		_itemId: joi.string().required(),
		multiplier: joi.number().min(0).required(),
	});
	const { error } = schema.validate({ userId, _itemId, multiplier });
	if (error) {
		throw new Error(error.details[0].message);
	}
};

const removeConditionValidator = (userId, _itemId, _conditionId) => {
	const schema = joi.object({
		userId: USER_ID_RULE,
		_itemId: joi.string().optional(),
		_conditionId: joi.string().required(),
	});
	const { error } = schema.validate({ userId, _itemId, _conditionId }, DISABLE_CONVERT);
	if (error) {
		throw new Error(error.details[0].message);
	}
};

const deleteCartValidator = userId => {
	const schema = joi.object({
		userId: USER_ID_RULE,
	});
	const { error } = schema.validate({ userId }, DISABLE_CONVERT);
	if (error) {
		throw new Error(error.details[0].message);
	}
};

module.exports = {
	saveCartValidator,
	getCartValidator,
	updateMultiplierValidator,
	removeConditionValidator,
	deleteCartValidator,
};
