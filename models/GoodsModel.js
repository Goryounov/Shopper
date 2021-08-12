module.exports = (sequelize, Sequelize) => {
    const Goods = sequelize.define('goods', {
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
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