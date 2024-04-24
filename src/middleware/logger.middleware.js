import fs from 'fs'
import winston from 'winston'
import os from 'os'

const fsPromise = fs.promises

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'request-logging'},
    transports: [
        new winston.transports.File( {filename: 'logs.txt'})
    ]
})

const loggerMiddleware = async (req, res, next) => {

    const newLine = os.EOL;
    if(!req.url.includes('signin')) {
        const logData = `${new Date().toString()}${newLine}req URL: ${req.url}${newLine} req Body: ${JSON.stringify(req.body)}`
        logger.info(logData)
    }
    next();

}

export default loggerMiddleware;
