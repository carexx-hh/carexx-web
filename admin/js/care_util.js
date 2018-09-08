function post(url, params) {
	var temp = document.createElement("form");
	temp.action = url;
	temp.method = "post";
	temp.style.display = "none";
	for(var p in params) {
		var opt = document.createElement("textarea");
		opt.name = p;
		opt.value = params[p];
		temp.appendChild(opt);
	}
	document.body.appendChild(temp);
	temp.submit();
	return temp;
}

function MyDatePicker(options) {
	if(options == null) {
		options = {};
	}
	options.onpicked = function() {
		$(this).trigger('change');
	};
	options.oncleared = function() {
		$(this).trigger('change');
	};
	WdatePicker(options);
}

function showLoading() {
	var loadBox = $("body>div").append("<div class='loading'><dl><dt></dt><dd>加载中，请稍等...</dd></dl></div>");
	loadBox.find('.loading dt').append('<img src="img/loading.gif"/>');
	$('.loading').fadeIn('500');
}

function hideLoading() {
	$('.loading').fadeOut('100');
	$('.loading').remove();
}