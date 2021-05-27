const Sequelize = require('sequelize');
const { Model } = Sequelize;

module.exports = class Word extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        // hiragana katakana okurigana kanji level korean
        hiragana: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        katakana: {
          type: Sequelize.STRING(10),
          allowNull: true,
        },
        okurigana: {
          type: Sequelize.STRING(10),
          allowNull: true,
        },
        kanji: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        korean: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        level: {
          type: Sequelize.TINYINT,
          allowNull: true,
        },
      },
      {
        modelName: 'Word',
        tableName: 'words',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        sequelize,
      }
    );
  }

  static associate(db) {}
};
