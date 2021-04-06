"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			User.hasMany(models.Post, {
				foreignKey: "user_id",
			});
			User.hasMany(models.Like, {
				foreignKey: "user_id",
			});
			User.hasMany(models.Bookmark, {
				foreignKey: "user_id",
			});
		}
	}
	User.init(
		{
			nickname: DataTypes.STRING,
			email: DataTypes.STRING,
			password: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "User",
		}
	);
	return User;
};
