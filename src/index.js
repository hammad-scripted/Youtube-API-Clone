import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1']);

import chalk from 'chalk';

import app from './app.js';
import connectToDb from './db/connection.js';

connectToDb()
  .then((connection) => {
    console.log(chalk.green.bold('Connected to database successfully'));

    console.log(connection.connection.host);

    app.listen(process.env.PORT, () => {
      console.log(
        chalk.blue.bold(`Server is running on port ${process.env.PORT}`),
      );
    });
  })
  .catch((error) => {
    console.error(chalk.red.bold('Error connecting to database:'), error);
  });
