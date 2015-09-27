Package.describe({
	summary:  "say-cheese - plugin for Meteor",
	version: '1.0.2',
	name: "mikkelking:say-cheese",
	git: 'https://github.com/mikkelking/say-cheese'
});

Package.onUse(function (api) {
	api.versionsFrom("METEOR@1.1.0.3");
	api.use('jquery', 'client');
    api.addFiles('lib/say-cheese.js', "client");
    api.addFiles('lib/main.js', "client");
	api.export('SayCheese', 'client');  
});

Package.onTest(function (api) {
	api.use('jquery', 'client');
	api.use(['mikkelking:say-cheese', 'tinytest'], ['client']);
	api.addFiles('test.js', ['client']);
});
