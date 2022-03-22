/* eslint-disable indent */
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User', {
            score: {
                type: DataTypes.DOUBLE,
                allowNull: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                isEmail: true
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'pending'
            }
        }, {}
    );
    User.associate = (models) => {
    };
    return User;
};