// async router doc: https://www.npmjs.com/package/express-async-router

const { v4: uuidv4 } = require('uuid');

const AsyncRouter = require("express-async-router").AsyncRouter;
const amqpManager = require('../../events/amqp.manager');

var router = AsyncRouter();

router.get('/', (req, res) => {
	return amqpManager.connect()
		.then((channel) => {
			amqpManager.sendMessageToQueue(channel, 'testqueue', 'Hello from RabbitMQ!');
			res.status(200).json({status: 'all okay!'});
		})
		.catch((error) => {
			res.status(400).json({error: error});
		});
});

router.post('/sales-order/create', (req, res) => {
	return amqpManager.connect()
		.then((channel) => {
			console.log(req.body);
			
			// way 1
			// amqpManager.sendMessageToQueue(channel, 'sales_order.events.captured.erpnext.create', JSON.stringify(req.body));
			// way 2
			var exchange = 'sales_order.events.exchange'
			var routing_key = 'sales_order.events.captured.erpnext'
			channel.assertExchange(exchange, 'topic', {
				durable: true
			});
			event_id = uuidv4();
			event_msg = {
				event_id: event_id,
				payload: req.body
			}
			channel.publish(exchange, routing_key, Buffer.from(JSON.stringify(event_msg)));

			res.status(200).json({
				status: 'message published',
				event_id: event_id
			});
		})
		.catch((error) => {
			res.status(400).json({error: error});
		});
});

module.exports = router;