//var fis = require('fis3');
fis.match('**.js',{
	optimizer: fis.plugin('uglify-js'),
	domain: 'http://www.liubeijing.ren/demo/myWebQQ',
	useHash:true,
	release: '$0'
});
fis.match('**css',{
	optimizer: fis.plugin('clean-css'),
	domain: 'http://www.liubeijing.ren/demo/myWebQQ',
	useHash:true,
	release: '$0'
});
fis.match('**png', {
  optimizer: fis.plugin('png-compressor'),
});
fis.match('::package', {
  spriter: fis.plugin('csssprites')
});

