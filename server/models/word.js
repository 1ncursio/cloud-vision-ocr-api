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
        kanji: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
        hiragana: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
        katakana: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
        // okurigana: {
        //   type: Sequelize.STRING(10),
        //   allowNull: true,
        // },
        korean: {
          type: Sequelize.STRING(30),
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
