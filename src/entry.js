'use strict';

var _preact = require('preact');

if (process.env.NODE_ENV === 'development') {
	require('preact/devtools');
} else if ('serviceWorker' in navigator && location.protocol === 'https:') {
	navigator.serviceWorker.register('/sw.js');
}

const interopDefault = m => m && m.default || m;

let app = interopDefault(require('preact-cli-entrypoint'));

if (typeof app === 'function') {
	let root = document.getElementById('nacenit');
  console.log('root', root);
	let init = () => {
		let app = interopDefault(require('preact-cli-entrypoint'));
		root = (0, _preact.render)((0, _preact.h)(app), root);
	};

	if (module.hot) module.hot.accept('preact-cli-entrypoint', init);

	init();
}
