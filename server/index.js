const express = require('express');
const cors = require('cors');
const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  return res.status(200).json({ success: true, message: 'hello server' });
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`server listening ${PORT} port ...`);
});
