import express from 'express';
import config from 'config';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const port: number = config.get('DB.DB_PORT') || 3000;

app.listen(port, () => console.log(`TaskHub is listening on port ${port}...`));
