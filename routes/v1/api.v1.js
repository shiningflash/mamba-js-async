const express = require('express');
const router = express.Router();
const amqpManager = require('../../events/amqp.manager');

router.get('/', (req, res) => {
	amqpManager.connect()
		.then((channel) => {
			amqpManager.sendMessageToQueue(channel, 'testqueue', 'Hello from RabbitMQ!');
			res.status(200).json({status: 'all okay!'});
		})
		.catch((error) => {
			res.status(400).json({error: error});
		});
});

router.post('/sales-order/create', (req, res) => {
	amqpManager.connect()
		.then((channel) => {
			console.log(req.body);
			amqpManager.sendMessageToQueue(channel, 'sales_order.events.captured.erpnext.create', JSON.stringify(req.body));
			res.status(200).json({status: 'message published'});
		})
		.catch((error) => {
			res.status(400).json({error: error});
		});
});

module.exports = router;