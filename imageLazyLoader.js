(function($) {
/*
 * imageLazyLoader
 *
 * Copyright (c) 2010 hisasann
 *
 * Description:
 * 　画像遅延ローダー
 */

var opts = {
		threshold: 0,			// 先読みpx
		container: window		// スクロールコンテナ
	},

	selector = null,

	_IMAGE_CACHE = null,

	EVENT_NAME = "scroll.imageLazyLoader"

	;

$.fn.imageLazyLoader = function(options){
	_IMAGE_CACHE = $.makeArray(this);
	selector = $(this).selector;
	$.imageLazyLoader(options);
};

$.imageLazyLoader = function(options){
	$.extend(opts, options);

	bindScroll();

	// fire
	$(opts.container).trigger(EVENT_NAME);

	return $.imageLazyLoader;
};

$.imageLazyLoader.refresh = function() {
	_IMAGE_CACHE = $.makeArray($(selector));

	// fire
	$(opts.container).trigger(EVENT_NAME);
};

$.imageLazyLoader.unbind = function() {
	$(opts.container).unbind(EVENT_NAME);
};

function bindScroll() {
	// scroll event
	$(opts.container).bind(EVENT_NAME, function(event) {
		var elements = _IMAGE_CACHE,
			container = $(opts.container),
			height = container.height(),
			scrollTop = container.scrollTop();

		// あえてのfor文
		for (var i = 0, len = elements.length; i < len; ++i)(function(i) {
			var elem = elements[i];

			// 画面表示座標でない場合
			if (!belowthefold(elem, opts, height, scrollTop) || abovethetop(elem, opts, height, scrollTop)) { return; }

			// ロードするよ！
			var self = elem;
			$("<img />")
				.bind("load", function() {
					$(self)
						.attr("src", $(self).attr("osrc"))
						.data("loaded", true);
				})
				.attr("src", $(self).attr("osrc"));
		})(i);

		// すでに画像をロードした要素は除去する
		removeAlreadyElement();
	});
}

function removeAlreadyElement() {
	var elements = _IMAGE_CACHE,
		_elements = [],
		elem = null;

	for (var i = 0, len = elements.length; i < len; ++i) {
		elem = elements[i];

		// 画像がまだロードされていない
		if (!$(elem).data("loaded")) { _elements.push(elem); };
	}

	_IMAGE_CACHE = _elements;
}

//出現位置にきた
function belowthefold(element, settings, height, scrollTop) {
	var fold = height + scrollTop;
	return fold > $(element).offset().top - settings.threshold;
}

// 画面から消えた
function abovethetop(element, settings, height, scrollTop) {
	var fold = scrollTop;
	return fold >= $(element).offset().top + settings.threshold  + $(element).height();
}
})(jQuery);
