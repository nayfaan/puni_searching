function check_color_range(puni_stats) {
    let fit_color = [];
    let const_, luster, mood;

    for (color in puni_colors) {
        const_ = luster = mood = false;
        if (puni_stats[0] >= puni_colors[color][0] && puni_stats[0] <= puni_colors[color][1]) const_ = true;
        if (puni_stats[1] >= puni_colors[color][2] && puni_stats[1] <= puni_colors[color][3]) luster = true;
        if (puni_stats[2] >= puni_colors[color][4] && puni_stats[2] <= puni_colors[color][5]) mood = true;

        if (const_ && luster && mood) fit_color.push(color);
    }

    return fit_color;
}

function last_color(fit_color) {
    let puni_colors = fit_color[0];

    for (const color of fit_color) {
        const colorIndex = puni_order.indexOf(color);

        if (colorIndex === -1) continue;
        if (colorIndex < puni_order.indexOf(puni_colors)) puni_colors = color;
    }

    return puni_colors;
}

function update_puni_colors() {
    let const_val = parseInt($("#const_").val());
    let luster_val = parseInt($("#luster").val());
    let mood_val = parseInt($("#mood").val());

    let const_val_min = parseInt($("#const_min").val());
    let luster_val_min = parseInt($("#luster_min").val());
    let mood_val_min = parseInt($("#mood_min").val());

    let puni_stats = [const_val, luster_val, mood_val];
    let puni_stats_min = [const_val_min, luster_val_min, mood_val_min];

    let fit_color = check_color_range(puni_stats);
    let color = last_color(fit_color);

    let fit_color_min = check_color_range(puni_stats_min);
    let color_min = last_color(fit_color_min);

    if ($("#puni-color").html() != color) {
        $("#puni-color").html(color);
        $("#puni-img").attr("src", "web/static/images/punis/" + color.toLowerCase() + ".webp");
    }

    if ($("#puni-color-min").html() != color_min) {
        $("#puni-color-min").html(color_min);
        $("#puni-img-min").attr("src", "web/static/images/punis/" + color_min.toLowerCase() + ".webp");
    }
}

const puni_colors = {
    Shining: [95, 100, 95, 100, 95, 100],
    Abyss: [0, 1, 0, 1, 0, 1],
    Big: [80, 100, 30, 100, 30, 100],
    Flare: [40, 100, 40, 100, 80, 100],
    Moon: [40, 100, 80, 100, 40, 100],
    Gold: [20, 100, 75, 100, 20, 100],
    Silver: [0, 100, 40, 100, 0, 100],
    Stone: [30, 100, 0, 20, 30, 100],
    Black: [0, 15, 0, 15, 0, 15],
    Red: [40, 100, 0, 100, 0, 100],
    Green: [0, 100, 0, 100, 40, 100],
    Blue: [0, 100, 0, 100, 0, 100]
};

const puni_order = ["Shining", "Abyss", "Big", "Flare", "Moon", "Gold", "Silver", "Stone", "Black", "Red", "Green", "Blue"];

// Restricts input for the set of matched elements to the given inputFilter function.
(function ($) {
    $.fn.inputFilter = function (callback) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop focusout", function (e) {
            let callback_value = callback(this.value);

            // Capping min/max values
            let check_min = true;
            if (parseInt($("#const_").val()) < parseInt($("#const_min").val()) || parseInt($("#luster").val()) < parseInt($("#luster_min").val()) || parseInt($("#mood").val()) < parseInt($("#mood_min").val())) {
                check_min = false;
            }

            // Processing value 
            if (callback_value && check_min) {
                // Accepted value
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                // Rejected value - restore the previous one
                this.reportValidity();
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                // Rejected value - nothing to restore
                this.value = "";
            }

            if (e.type == "keydown" && e.which === 38) this.value = parseInt(this.value) + 1;
            if (e.type == "keydown" && e.which === 40) this.value = parseInt(this.value) - 1;

            if (this.value == "") this.value = 0;
            else {
                let stat_val = parseInt(this.value);
                if (stat_val > 100) this.value = 100;
                if (stat_val < 0) this.value = 0;
            }

            this.value = parseInt(this.value);

            update_puni_colors();
        });
    };
}(jQuery));

$(document).ready(function () {
    update_puni_colors();

    $("#puni-stats-table input").inputFilter(function (value) {
        let regex_test = /^\d*$/.test(value);
        return regex_test;    // Allowing digits only
    });
});

$("#puni-stats-table input").on('keydown', function (e) {
    if (e.which === 38 || e.which === 40) {
        e.preventDefault();
    }
});