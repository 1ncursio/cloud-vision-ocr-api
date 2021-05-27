const express = require('express');
const app = express();
const cors = require('cors');
const hpp = require('hpp');
const helmet = require('helmet');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');

const db = require('./models');

const detectionRouter = require('./routes/detection');
const searchRouter = require('./routes/search');
const wordsRouter = require('./routes/words');

dotenv.config();

db.sequelize
  .sync()
  .then(() => {
    console.log('MYSQL 연결 성공');
  })
  .catch(console.error);

const isProduction = process.env.NODE_ENV === 'production';

app.set('port', process.env.PORT || 3005);

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: true,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      domain: isProduction && '.test.domain',
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

if (isProduction) {
  app.use(morgan('combined'));
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
  app.use(helmet());
  app.use(hpp());
} else {
  app.use(morgan('dev'));
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
}

app.get('/', (req, res) => {
  return res.status(200).json({ success: true, message: 'BACKEND TEST' });
});

app.use('/detection', detectionRouter);
app.use('/search', searchRouter);
app.use('/words', wordsRouter);

app.listen(app.get('port'), () => {
  console.log(`server listening ${app.get('port')} port ...`);
});
