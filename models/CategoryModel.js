module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define('categories', {
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        image: {
            type: Sequelize.STRING
        },
    });

    return Category;
}