$(document).ready(function () {
    let submit = document.getElementById("submit");
    let const_, luster, mood, cratable_only, best_only, ordered;
    let result_area = $("#results");
    submit.onclick = function () { 
        const_ = parseInt($('#const_').val());
        luster = parseInt($('#luster').val());
        mood = parseInt($('#mood').val());
        cratable_only = $('#cratable_only').prop('checked');
        best_only = $('#best_only').prop('checked');
        ordered = $('#ordered').prop('checked');
        
        console.log(const_, luster, mood, cratable_only, best_only, ordered);
        result_area.html("");
     };
});