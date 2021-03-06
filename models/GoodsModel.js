module.exports = (sequelize, Sequelize) => {
    const Goods = sequelize.define('goods', {
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        image: {
            type: Sequelize.STRING
        },
        cost: {
            type: Sequelize.INTEGER
        }
    });

    return Goods;
}