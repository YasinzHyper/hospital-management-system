'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('patients', 'surgery_details', {
      type: Sequelize.JSON,
      allowNull: false
    });
    await queryInterface.changeColumn('patients', 'billing_info', {
      type: Sequelize.JSON,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('patients', 'surgery_details', {
      type: Sequelize.TEXT,
      allowNull: false
    });
    await queryInterface.changeColumn('patients', 'billing_info', {
      type: Sequelize.TEXT,
      allowNull: false
    });
  }
};