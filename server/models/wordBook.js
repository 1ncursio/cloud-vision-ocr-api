const Sequelize = require('sequelize');
const { Model } = Sequelize;

module.exports = class WordBook extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        title: {
          type: Sequelize.STRING(30),
          defaultValue: '나의 단어장',
          allowNull: false,
        },
        // UserId
        public: {
          type: Sequelize.TINYINT,
          defaultValue: 0,
          allowNull: false,
        },
      },
      {
        modelName: 'WordBook',
        tableName: 'word_books',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        sequelize,
      }
    );
  }

  static associate(db) {}
};
