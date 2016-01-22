Function.prototype.bind = require('function-bind'); // polyfil for PhantomJS
var context = require.context('../', true, /-test\.jsx?$/);
context.keys().forEach(context);