require.config({
  paths: {
    jquery: '../lib/jquery-2.1.3',
    service: '../serviceInterface/serviceInterface',
    handlebars: '../lib/handlebars-v4.0.2'
  }
});

require(["jquery","service",'handlebars'], function($,service,Handlebars) {
});