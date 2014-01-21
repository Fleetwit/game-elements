(function() {
	
	
	// Utility, to create new dom elements
	var dom = function(nodeType, appendTo, raw) {
		var element = document.createElement(nodeType);
		if (appendTo != undefined) {
			$(appendTo).append($(element));
		}
		return (raw === true)?element:$(element);
	};
	
	var gameElements = {
		letterGroup:	function(container, options) {
			var output = {
				letters:	[]
			};
			
			output.build = function() {
				var i;
				var ul = dom("ul", container);
					ul.addClass("gameElements letterGroup");
				if (options.number) {
					for (i=0;i<options.number;i++) {
						(function(i) {
							var li = dom("li", ul);
								li.addClass("inset");
							output.letters.push(li);
						})(i);
					}
				} else if (options.letters) {
					if (typeof options.letters == "string") {
						options.letters = options.letters.split('');
					}
					for (i=0;i<options.letters.length;i++) {
						(function(i) {
							var li = dom("li", ul);
								li.html(options.letters[i].toUpperCase());
							output.letters.push(li);
						})(i);
					}
				}
			}
			output.set = function(pos, letter) {
				output.letters[pos].removeClass("inset").html(letter.toUpperCase());
			}
			output.wrong = function(pos) {
				output.letters[pos].removeClass("inset").addClass("wrong");
			}
			output.build();
			
			return output;
		},
		keyboard:	function(container, options) {
			options = _.extend({
				layout:		"qwerty",
				onClick:	function() {
					
				}
			},options);
			
			var output = {};
			
			var layout	= {
				qwerty:	[
					'qwertyuiop',
					'asdfghjkl',
					'zxcvbnm'
				]
			};
			
			var index	=  {};
			
			output.build = function() {
				var i,j;
				var keyboard = dom("div", container);
					keyboard.addClass("gameElements keyboard");
				
				if (_.isArray(options.layout)) {
					var keys = options.layout;
				} else {
					var keys = layout[options.layout];
				}
				
				for (i=0;i<keys.length;i++) {
					if (typeof keys[i] == "string") {
						keys[i] = keys[i].split('');
					}
					var line	= dom("ul", keyboard);
					for (j=0;j<keys[i].length;j++) {
						(function(i,j,line) {
							var key = dom("li", line);
								key.html(keys[i][j].toUpperCase());
								key.click(function() {
									if (!$(this).hasClass("disabled") && !$(this).hasClass("inset")) {
										options.onClick(keys[i][j].toLowerCase(), key);
									}
								});
							if (index[keys[i][j]]) {
								index[keys[i][j]] = index[keys[i][j]].add(key);
							} else {
								index[keys[i][j]] = key;
							}
							
						})(i,j,line);
					}
				}
			}
			output.disable = function(letters) {
				letters = letters.split('');
				_.each(letters, function(letter) {
					index[letter].removeClass("inset").removeClass("wrong").removeClass("disabled");
					index[letter].addClass("disabled");
				});
			}
			output.inset = function(letters) {
				letters = letters.split('');
				_.each(letters, function(letter) {
					index[letter].removeClass("inset").removeClass("wrong").removeClass("disabled");
					index[letter].addClass("inset");
				});
			}
			output.wrong = function(letters) {
				letters = letters.split('');
				_.each(letters, function(letter) {
					index[letter].removeClass("inset").removeClass("wrong").removeClass("disabled");
					index[letter].addClass("wrong");
				});
			}
			output.build();
			
			return output;
		}
	};
	
	// Global scope
	window.gameElements 		= gameElements;
})();