const CART = 'cart';
module.exports = (sequelize, DataTypes) => {
	const schema = {
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},
		userId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		content: {
			type: DataTypes.JSONB,
			allowNull: false,
		},
		globalConditions: {
			type: DataTypes.JSONB,
			allowNull: true,
		},
		subTotal: DataTypes.DECIMAL,
		total: DataTypes.DECIMAL,
	};

	const cart = sequelize.define(CART, schema, {
		indexes: [
			{
				unique: true,
				fields: ['userId'],
			},
		],
	});

	return cart;
};
