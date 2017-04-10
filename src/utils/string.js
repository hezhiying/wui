String.prototype.getBody = function () {
	let rx    = /<body[^>]*>([\s\S]+?)<\/body>/i;
	var result = rx.exec(this);
	if(result && result.length === 2)
		return result[1];
	return this;
};

