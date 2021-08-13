module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        first_name: {
            type: Sequelize.STRING
        },
        last_name: {
            type: Sequelize.STRING
        },
        login: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.TEXT
        },
        salt: {
            type: Sequelize.STRING
        },
        hash: {
            type: Sequelize.STRING
        }
    });

    return User;
}