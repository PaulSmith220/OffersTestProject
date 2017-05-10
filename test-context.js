/**
 * Created by paul on 10.05.2017.
 */
var context = require.context('./tests', true, /\.spec\.js$/);
context.keys().forEach(context);