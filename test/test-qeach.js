!function() {
    QUnit = require('qunitjs');
    var util = require('util'),
    qunitTap = require('qunit-tap').qunitTap;
    qunitTap(QUnit, util.puts, { noPlan: true });
    QUnit.init();
    QUnit.config.updateRate = 0;
    assert = QUnit;
}();


var qeach = require('../lib/qeach');

QUnit.module('qeach Module');

QUnit.asyncTest('basic step', 4, function() {
    var src = ['abc', 123, false];

    qeach(src, function(data, index, arr, runner) {
        assert.equal(src[index], data, 'same src value');
        runner.next(); 
    }, function() {
        assert.ok(true, 'end runner');
        QUnit.start();
    });
});

QUnit.asyncTest('array overwite', 2, function() {
    var src = ['abc', 123, false],
    expects = ['abc', 456, true];

    qeach(src, function(data, index, arr, runner) {
        arr[index] = expects[index];
        runner.next(); 
    }, function(arr) {
        assert.deepEqual(arr, expects, 'same array value');
        assert.ok(true, 'end runner');
        QUnit.start();
    });
});

QUnit.asyncTest('array item remove', 2, function() {
    var src = ['abc', 123, false],
    expects = ['abc', false];

    qeach(src, function(data, index, arr, runner) {
        if (index === 1) {
            arr.splice(1, 1);
        }
        runner.next(); 
    }, function(arr) {
        assert.deepEqual(arr, expects, 'same array value');
        assert.ok(true, 'end runner');
        QUnit.start();
    });
});

QUnit.asyncTest('terminate step', 2, function() {
    var src = ['abc', 123, false];

    qeach(src, function(data, index, arr, runner) {
        assert.ok(index < 1, 'reachable index');
        if (index === 0) {
            runner.terminate();
        }
        runner.next(); 
    }, function() {
        assert.ok(true, 'end runner');
        QUnit.start();
    });
});

QUnit.asyncTest('step with timer', 4, function() {
    var src = ['abc', 123, false],
    timer = 500,
    ts = (new Date()).getTime();

    qeach(src, timer, function(data, index, arr, runner) {
        ts += timer;
        assert.ok(Math.abs((new Date()).getTime() - ts) < 10, 'timer step');
        runner.next(); 
    }, function() {
        assert.ok(true, 'end runner');
        QUnit.start();
    });
});

QUnit.asyncTest('step with timer and terminate', 3, function() {
    var src = ['abc', 123, false],
    timer = 500,
    ts = (new Date()).getTime();

    qeach(src, timer, function(data, index, arr, runner) {
        assert.ok(index < 1, 'reachable index');
        ts += timer;
        assert.ok(Math.abs((new Date()).getTime() - ts) < 10, 'timer step');
        if (index === 0) {
            runner.terminate();
        }
        runner.next(); 
    }, function() {
        assert.ok(true, 'end runner');
        QUnit.start();
    });
});

QUnit.test('bad param', 1, function() {
    try {
        qeach(1);
    } catch (e) {
        assert.ok(e, 'error');
    }
});

QUnit.asyncTest('none end listener ', 3, function() {
    var src = ['abc', 123, false];
    qeach(src, function(data, index, arr, runner) {
        assert.equal(src[index], data, 'same src value');
        runner.next();
        if (index === 2) {
            QUnit.start();
        } 
    });
});

QUnit.asyncTest('none end listener with timer ', 3, function() {
    var src = ['abc', 123, false];
    qeach(src, 100, function(data, index, arr, runner) {
        assert.equal(src[index], data, 'same src value');
        runner.next(); 
        if (index === 2) {
            QUnit.start();
        } 
    });
});
