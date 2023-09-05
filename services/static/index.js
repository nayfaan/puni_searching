$(document).ready(function () {
    let submit = document.getElementById("submit");
    let const_, luster, mood, cratable_only, best_only, ordered;
    let result_area = $("#results");
    submit.onclick = function () { 
        const_ = $('#const_').val();
        luster = $('#luster').val();
        mood = $('#mood').val();
        cratable_only = $('#cratable_only').prop('checked');
        best_only = $('#best_only').prop('checked');
        ordered = $('#ordered').prop('checked');
        
        result_area.html("");
     };
});