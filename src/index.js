import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import app from './app.js';
import connectToDb from './db/connection.js';
import chalk from 'chalk';

connectToDb().then((connection) => {
  console.log(chalk.green('Connected to database successfully'));
  console.log(connection.connection.host);
  app
    .listen(process.env.PORT, () => {
      console.log(chalk.blue(`Server is running on port ${process.env.PORT}`));
    })
    .catch((error) => {
      console.error(chalk.red('Error connecting to database:'), error);
    });
});
