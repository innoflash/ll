// Handlebars extensions
define(['handlebars', function (Handlebars) {
    Handlebars.registerHelper('toLowerCase', function (str) {
        return str.toLowerCase();
    });
    Handlebars.registerHelper('toTitleCase', function (str) {
        if (str.length > 0) {
            return str.toLowerCase().split(' ').map(function (word) {
                return (word.charAt(0).toUpperCase() + word.slice(1));
            }).join(' ');
        } else {
            return str;
        }

    });
    Handlebars.registerHelper('initialLastname', function (str) {
        return str.substring(0, 1);
    });
    Handlebars.registerHelper('toFixed', function (str, decimals) {
        return str.toFixed(decimals);
    });
    Handlebars.registerHelper('substr', function (startIndex, endIndex, context, options) {
        context.replace(/<br>/, ' ');
        return context.toString().substring(startIndex, endIndex);
    });
    Handlebars.registerHelper("log", function (something) {
        console.log(something);
    });
    Handlebars.registerHelper('urlfix', function (mediaurl) {
        var result = "";
        if (mediaurl.toLowerCase().indexOf("youtube") >= 0) {
            result = mediaurl.replace(/&index[^\?\/]*/, '');
            result = result.replace(/&list[^\?\/]*/, '');
            result = result.replace("watch?v=", "embed/");
        }

        return result;
    });
    Handlebars.registerHelper('referrer', function () {
        return encodeURIComponent(window.location.href);
    });
    Handlebars.registerHelper('numFormat', function (value) {
        var result = 0;
        if (value) {
            if (value >= 1000000000) {
                result = (value / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
            }
            if (value >= 1000000) {
                result = (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            }
            if (value >= 1000) {
                result = (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
            }
            if (value >= 0 && value < 1000) {
                result = value.toFixed(1).replace(/\.0$/, '');
            }
        }

        return result;
    });
    Handlebars.registerHelper('buildLayout', function (modulus, index, layout_non_mod, layout_mod) {
        var result = layout_non_mod;
        var remainder = index % modulus;
        if (index > 0 && remainder === 0) {
            result = layout_mod;
        }

        return result;
    });
    Handlebars.registerHelper("moduloIf", function (index, mod, block) {
        var remainder = index % mod;
        if (index > 0 && remainder === 0) {
            return block.fn(this);
        }
    });
    Handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {

        var operators, result;

        if (arguments.length < 3) {
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        }

        if (options === undefined) {
            options = rvalue;
            rvalue = operator;
            operator = "===";
        }

        operators = {
            '==': function (l, r) {
                return l === r;
            },
            '===': function (l, r) {
                return l === r;
            },
            '!=': function (l, r) {
                return l !== r;
            },
            '!==': function (l, r) {
                return l !== r;
            },
            '<': function (l, r) {
                return l < r;
            },
            '>': function (l, r) {
                return l > r;
            },
            '<=': function (l, r) {
                return l <= r;
            },
            '>=': function (l, r) {
                return l >= r;
            },
            '%': function (l, r) {
                return (l % r) === 0;
            },
            'typeof': function (l, r) {
                return typeof l === r;
            }
        };

        if (!operators[operator]) {
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
        }

        result = operators[operator](lvalue, rvalue);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }

    });
    Handlebars.registerHelper('percentile', function (value, scope) {
        var result = Math.floor((value / scope) * 100);
        return result;
    });
    Handlebars.registerHelper('rating_colour', function (value) {

        if (value === 0 || value === undefined) {
            return 0;
        } else if (value > 0 && value < 1.8) {
            return 1;
        } else if (value >= 1.8 && value < 2.6) {
            return 2;
        } else if (value >= 2.6 && value < 3.4) {
            return 3;
        } else if (value >= 3.4 && value < 4.2) {
            return 4;
        } else if (value >= 4.2) {
            return 5;
        }
    });
    Handlebars.registerHelper('if_even', function (conditional, options) {
        if ((conditional % 2) === 0) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    Handlebars.registerHelper('you_img', function (url) {
        var new_url = url.replace(/www/, "img");
        new_url = new_url.replace(/&.*/, "");
        new_url = new_url.replace(/watch\?v=/, "vi/");
        new_url = new_url + "/0.jpg";
        return new_url;
    });
    Handlebars.registerHelper("poll_active", function (endtime, options) {
        var offset = (-(new Date()).getTimezoneOffset() / 60);
        var now = (new Date).getTime() + offset * 1000 * 60 * 60;
        var t = endtime - now;
        if (t > 0) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    Handlebars.registerHelper("author", function (author) {
        var srcArray = null;
        if (author == "Prophet Emmanuel Makandiwa") {
            srcArray = papa;
        } else {
            srcArray = mhamha;
        }
        var img = srcArray[Math.floor(Math.random() * (srcArray.length + 1))];
        console.log(img);
        return img;
    });
}]);
