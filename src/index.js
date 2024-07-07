import app from './app.js';
import 'dotenv/config';
import logger from './logs/logger.js';
import { sequelize } from './database/database.js';
async function main() {
    // iniciar sequelize
    await sequelize.sync({ force: true });

    const port = process.env.PORT;
    app.listen(port);
    logger.info(`Listening on port: ${port}`);
}
main();