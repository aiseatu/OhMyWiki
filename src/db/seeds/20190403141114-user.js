'use strict';

let users = [
  {
    username: "user1",
    email: "user1@example.com",
    password: "1234567",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 0
  },
  {
    username: "user2",
    email: "user2@example.com",
    password: "1234567",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 0
  },
  {
    username: "user3",
    email: "user3@example.com",
    password: "1234567",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 0
  }
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
