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
			options = _.extend({
				gravity:	false,
				squeeze:	false,
				onClick:	function() {
					
				}
			},options);
			
			var output = {
				letters:	[]
			};
			
			output.build = function() {
				var i;
				var ul = dom("ul", container);
					ul.addClass("gameElements letterGroup");
					
				
				ul.addClass("regular");
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
								li.click(function() {
									if (!$(this).hasClass("inset")) {
										options.onClick(i, options.letters[i].toLowerCase(), li);
										if (options.gravity) {
											output.gravityStep();
										}
									}
								});
							output.letters.push(li);
						})(i);
					}
				}
			}
			output.gravityStep = function() {
				for (i=1;i<output.letters.length;i++) {
					// If the current letter is filled and previous one is empty...
					if (!output.letters[i].hasClass("inset") && output.letters[i-1].hasClass("inset")) {
						output.set(i-1, output.letters[i].text());
						output.empty(i);
					}
				}
			}
			output.set = function(pos, letter) {
				output.letters[pos].removeClass("inset").html(letter.toUpperCase());
				return output;
			}
			output.empty = function(pos) {
				output.letters[pos].removeClass("wrong").addClass("inset").empty();
				return output;
			}
			output.wrong = function(pos) {
				output.letters[pos].removeClass("inset").addClass("wrong");
				return output;
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
								// Same size for all keys on a line
								key.css("width", (100/keys[i].length)+"%");
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
				if (!letters || letters === true) {
					var group = $();
					for (i in index) {
						group = group.add(index[i]);
					}
					if (letters === true) {
						group.removeClass("inset").addClass("disabled");
					} else {
						group.each(function(idx, element) {
							element = $(element);
							if (!element.hasClass("inset")) {
								element.addClass("disabled");
							}
						});
					}
				} else {
					letters = letters.split('');
					_.each(letters, function(letter) {
						index[letter].removeClass("inset").removeClass("wrong").removeClass("disabled");
						index[letter].addClass("disabled");
					});
				}
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
		},
		container:	function(container, options) {
			options = _.extend({
				square:	false
			},options);
			
			var output = {};
			
			output.build = function() {
				output.div = dom("div", container);
					output.div.addClass("gameElements ge-container");
			}
			output.build();
			
			output.setSquare = function() {
				var size = {
					container:	{
						width:	container.width(),
						height:	container.height()
					}
				};
				size.div = {
					width:	Math.min(size.container.width,size.container.height),
					height:	Math.min(size.container.width,size.container.height)
				};
				var ratio = {
					container:	size.container.width/size.container.height,
					div:		1
				};
				output.div.css({
					width:	size.div.width,
					height:	size.div.height
				});
			}
			
			
			if (options.square) {
				setInterval(function() {
					output.setSquare();
				}, 300);
			}
			
			return output.div;
		}
	};
	
	// Global scope
	window.gameElements 		= gameElements;
})();