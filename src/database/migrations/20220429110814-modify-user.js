module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'state', {
    type: Sequelize.STRING,
    allowNull: true
  }),
  down: (queryInterface) => queryInterface.removeColumn('Users', 'state')
};
