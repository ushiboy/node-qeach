var EventEmitter = require('events').EventEmitter;

function QEach_(queue, timer) {
    EventEmitter.call(this);
    this.queue_ = queue;
    this.index_ = -1;
    this.isTerminate_ = false;
    this.timer_ = timer || null;
    this.next();
}
require('util').inherits(QEach_, EventEmitter);

QEach_.prototype.next = function() {
    var self = this;
    if (self.isTerminate_) {
        return;
    }
    process.nextTick(function() {
        self.index_++;
        if (self.index_ < self.queue_.length) {
            var q = self.queue_[self.index_];
            if (self.timer_ != null) {
                setTimeout(function() {
                    self.emit('data', q, self.index_, self.queue_, self);
                }, self.timer_);
            } else {
                self.emit('data', q, self.index_, self.queue_, self);
            }
        } else {
            self.emit('end', self.queue_);
        }
    });
};

QEach_.prototype.terminate = function() {
    var self = this;
    self.isTerminate_ = true;
    process.nextTick(function() {
        self.emit('end', self.queue_);
    });
};

module.exports = function(queue, timer, onData, onEnd) {
    if (!Array.isArray(queue)) {
        throw new Error('Bad Queue Parameter.')
    }
    if (typeof(timer) !== 'number') {
        onEnd = onData;
        onData = timer;
        timer = null;
    }
    var qr = new QEach_(queue, timer).on('data', onData)
    if (onEnd) {
        qr.on('end', onEnd);
    }
    return qr;
};
