import express from 'express';
import path from 'path';

const app = express();
const port = 3000;
const __dirname = import.meta.dirname;

app.use(express.static(path.join(__dirname, 'dist')));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
