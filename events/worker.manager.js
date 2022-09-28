const testqueueWorker = require('./workers/worker');
const testqueueWorkerCallback = require('./workers/testqueue.worker');

module.exports.init = () => {
	testqueueWorkerCallback.init('sales_order.failed.events.captured.erpnext.E-Commerce');
	testqueueWorker.init('sales_order.failed.events.captured.erpnext.E-Commerce', testqueueWorkerCallback.messageReceivedEvent);
};