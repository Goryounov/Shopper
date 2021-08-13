const Sequelize = require("sequelize");
const sequelize = new Sequelize("market", "root", "root", {
    dialect: "mysql",
    host: "localhost",
    logging: false
});

const models = {};

models.Sequelize = Sequelize;
models.sequelize = sequelize;

models.user = require('./models/UserModel')(sequelize, Sequelize);
models.role = require('./models/RoleModel')(sequelize, Sequelize);
models.order = require('./models/OrderModel')(sequelize, Sequelize);
models.goods = require('./models/GoodsModel')(sequelize, Sequelize);
models.category = require('./models/CategoryModel')(sequelize, Sequelize);

models.role.belongsToMany(models.user, { through: 'users_roles', foreignKey: 'role_id', otherKey: 'user_id'});
models.user.belongsToMany(models.role, { through: 'users_roles', foreignKey: 'user_id', otherKey: 'role_id'});

models.goods.belongsToMany(models.category, { through: 'categories_goods', foreignKey: 'goods_id', otherKey: 'category_id'});
models.category.belongsToMany(models.goods, { through: 'categories_goods', foreignKey: 'category_id', otherKey: 'goods_id'});

module.exports = {models: models};