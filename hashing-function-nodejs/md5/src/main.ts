// npm install mongodb; npm install @types/mongodb;
import express from 'express';
import bodyParser from 'body-parser';
import { hashRoutes } from './routes/hashs';
//import { Todo } from './models/todo';

const app: express.Application = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use('/hash',hashRoutes);

//const hostname: string = process.env.HOST_ADDR || "0.0.0.0";
const port: string = process.env.PORT || "8080";
const nodeEnv: string = process.env.NODE_ENV || "production";

app.listen(parseInt(port), async function ()
{
  console.log(`Server running at http://localhost:${port}/ in ${nodeEnv}`);
});
