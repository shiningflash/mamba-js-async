const testqueueWorker = require('./workers/worker');
const testqueueWorkerCallback = require('./workers/testqueue.worker');

module.exports.init = () => {
	testqueueWorkerCallback.init('testqueue');
	testqueueWorker.init('testqueue', testqueueWorkerCallback.messageReceivedEvent);
};