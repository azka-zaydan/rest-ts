import express from 'express';
import http from 'http';
import mongoose, {Error} from 'mongoose';
import {config} from './config/config';
import Logging from './library/Logging';
import authorRoutes from './routes/Author'
import bookRoutes from './routes/Book'
const router = express();

mongoose.connect(config.mongo.url, {w: 'majority', retryWrites: true})
	.then(() => {
		Logging.info('Connected to MongoDB');
		startServer();
	})
	.catch((err) => {
		Logging.error(`Unable to Connect: ${err}`);
	});

const startServer = () => {
	router.use((req, res, next) => {
		Logging.info(`Incoming -> Method: [${req.method}] - url: [${req.url}] - IP [${req.socket.remoteAddress}]`);
		res.on('finish', () => {
			Logging.info(`Outgoing -> Method: [${req.method}] - url: [${req.url}] - IP [${req.socket.remoteAddress}] - status [${res.statusCode}]`);
		});
		next();
	});
	router.use(express.urlencoded({extended: true}));
	router.use(express.json());

	router.use((req, res, next) => {
		res.header('Acess-Control-Allow-Origin', '*');
		res.header('Acess-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

		if (req.method === 'OPTIONS') {
			res.header('Acess-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
			return res.status(200).json({});
		}

		next();
	});

	// routes 
	router.use('/authors',authorRoutes)
	router.use('/books',bookRoutes)
	router.get('/ping', (req, res, next) => res.status(200).json({message: 'pong'}));

	router.use((req, res, next) => {
		const error = new Error('not found');
		Logging.error(error);
		return res.status(404).json({message: error.message});
	});
	http.createServer(router).listen(config.server.port, () => {
		Logging.info(`Server is running on port: ${config.server.port}`);
	});
};
