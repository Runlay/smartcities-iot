import express from "express";
import path from "path";

const __dirname = import.meta.dirname;

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "dist")));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
