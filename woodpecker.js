"use strict";
var arg = process.argv[2];
var dir;
arg === undefined ? dir = '.' : dir = arg

var walk = require('walk');
var fs = require('fs');
var options;
var walker;
var dirsArr;

options = {
	followLinks: false,
	// directories with these keys will be skipped 
	filters: ['Temp']
};

dirsArr = [];

(function chunker(dir) {
	walker = walk.walk(dir, options);

	walker.on("file", function(root, fileStats, next) {
		dirsArr.push(root);
		next();
	});

	walker.on("errors", function(root, nodeStatsArray, next) {
		next();
	});

	walker.on("end", function() {
		var maxLen = 0;
		for (var i = 0; i < dirsArr.length; i++) {
			dirsArr[i] = dirsArr[i].split('\\');
			if (dirsArr[i].length > maxLen) {
				maxLen = dirsArr[i].length;
			}
		}
		var counter = 0;
		var output = [];
		function mapper (dirsArr) {
			if (counter == maxLen - 1) {
				return;
			} else {
				var maxLoc = 0;
				for (var i = 0; i < dirsArr.length; i++) {
					if (dirsArr[i].length > maxLoc) {
						maxLoc = dirsArr[i].length;
					}
				}
				var longest = [];
				var newArr = [];
				dirsArr.forEach(function(i) {
					if (i.length == maxLoc) {
						longest.push(i.join('\\'));
					} else {
						newArr.push(i);
					}
				});
				longest.map(function(i) {
					var count = 0;
					for (var j = 0; j < longest.length; j++) {
						if (i === longest[j]) 
							count += 1;
					}
					if (count >= 5) {
						output.push(i);
					} else {
						var push = i.split('\\');
						push.pop();
						newArr.push(push);
					}
				});
				// console.log(newArr);
				counter += 1;
				mapper(newArr);
			}
		}
		mapper(dirsArr);
		var uniqueOutputs = output.filter(function(elem, index, self) {
    		return index == self.indexOf(elem);
		});
		console.log(uniqueOutputs);
	});
})(dir);