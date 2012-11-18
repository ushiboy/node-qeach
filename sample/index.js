var qeach = require('../lib/qeach'),
util = require('util');

qeach(
    [1, 2, 3, 4, 5],
    function(data, index, arr, runner) {
        util.log('q1['+ index + '] is ' + data);
        runner.next(); 
    },
    function(arr) {
        util.log('q1 end');
    }
);

qeach(
    [10, 20, 30, 40, 50],
    function(data, index, arr, runner) {
        util.log('q2['+ index + '] is ' + data);
        arr[index]++;
        runner.next(); 
    },
    function(arr) {
        util.log('q2 end and result');
        util.log(arr);
    }
);

// with timer
qeach(
    [100, 200, 300, 400, 500],
    1000,
    function(data, index, arr, runner) {
        util.log('q3['+ index + '] is ' + data);
        runner.next(); 
    },
    function(arr) {
        util.log('q3 end');
    }
);
