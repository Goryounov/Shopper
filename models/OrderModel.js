module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define('orders', {
        user_id: {
            type: Sequelize.INTEGER
        },
        goods_id: {
            type: Sequelize.INTEGER
        },
        goods_cost: {
            type: Sequelize.INTEGER
        },
        goods_amount: {
            type: Sequelize.INTEGER
        },
        total: {
            type: Sequelize.INTEGER
        },
        date: {
            type: Sequelize.DATE
        }
    });

    return Order;
}