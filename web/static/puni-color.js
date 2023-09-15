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

function limit_stat(input) {
    var regex = /^[0-9]*$/;
    // console.log(input.val(), regex.test(input.val()))
    if (!input.val().match(regex)) {
        input.val(100);
    }

    if ((input.val() < 0) || (input.val() > 20)) {
        return false;
    }
}

function update_puni_colors() {
    let const_val = parseInt($("#const_").val());
    let luster_val = parseInt($("#luster").val());
    let mood_val = parseInt($("#mood").val());

    let puni_stats = [const_val, luster_val, mood_val];

    let fit_color = check_color_range(puni_stats);
    let color = last_color(fit_color);

    if ($("#puni-color").html() != color) {
        $("#puni-color").html(color);
        $("#puni-img").attr("src", "web/static/images/punis/" + color.toLowerCase() + ".webp");
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

function validate_stats(e) {

}

// Restricts input for the set of matched elements to the given inputFilter function.
(function ($) {
    $.fn.inputFilter = function (callback) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop focusout", function (e) {
            if (callback(this.value)) {
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
        return /^\d*$/.test(value);    // Allowing digits only
    });
});

$("#puni-stats-table input").on('keydown', function (e) {
    if (e.which === 38 || e.which === 40) {
        e.preventDefault();
    }
});