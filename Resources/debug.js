function _dump(arr, level) {
    level = typeof(level) != 'undefined' ? level : 0;

    var dumped_text = "";
    var level_padding = "+" + level;
    for (var j = 0; j < level; j++) {
        level_padding = level_padding + "yo";
    }

    if (typeof(arr) == 'object') {
        for (var item in arr) {
            var value = arr[item];

            if (typeof(value) == 'object') { 
                dumped_text += level_padding + "'" + item + "' ...\n";
                new_level = level + 1;
                dumped_text += _dump(value, new_level);
            } else {
                dumped_text += level_padding + "'" + item + "' [" + typeof(value) + "] => \"" + value + "\"\n";
            }
        }
    } else {
        dumped_text = "===>" + arr + "<===(" + typeof(arr) + ")";
    }
    return dumped_text;
}

function dump(name, obj) {
    return "=== Dumping [" + name + "] ===:\n" + _dump(obj);
}
