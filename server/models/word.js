const Sequelize = require('sequelize')
const {Model} = Sequelize;

module.exports = class Word extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true
            },

        }, {
            modelName: 'Word',
            tableName: 'words',
            charset: 'utf8',
            collate: 'utf8_general_ci',
            sequelize
        })
    }

    static associate(db) {

    }
}