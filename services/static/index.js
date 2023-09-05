$(document).ready(function () {
    // var submit = document.getElementById("submit");
    var const_, luster, mood, cratable_only, best_only, ordered;
    var result_area = $("#results");
    
    // $('#submit').on({
    //     mousedown: function () {
    //         $.ajax({
    //             type: "PUT",
    //             url: "/",
    //             data: { position: "test_value" },
    //             dataType: "json",
    //             error: function (xhr, status, error) {
    //                 alert("ERROR: " + xhr.status + ": " + xhr.statusText + "\n" + status + "\n" + error);
    //             },
    //             success: function (result, status, xhr) {
    //                 console.log(result);
    //                 $('#results').html("DEBUG?");
    //             }
    //         });
    //     },
    // });

    
    
    
    
    // submit.onclick = function () { 
    //     const_ = parseInt($('#const_').val());
    //     luster = parseInt($('#luster').val());
    //     mood = parseInt($('#mood').val());
    //     cratable_only = $('#cratable_only').prop('checked');
    //     best_only = $('#best_only').prop('checked');
    //     ordered = $('#ordered').prop('checked');
        
    //     // console.log(const_, luster, mood, cratable_only, best_only, ordered);

    //     $.ajax({
    //         type: "PUT",
    //         url: "/",
    //         data: { position: "(const_, luster, mood, cratable_only, best_only, ordered)" },
    //         dataType: "json",
    //         error: function (xhr, status, error) {
    //             alert("ERROR: " + xhr.status + ": " + xhr.statusText + "\n" + status + "\n" + error);
    //         },
    //         success: function (result, status, xhr) {//WIP
    //             console.log(result);
    //             $('#test').html(data);
    //         }
    //     });
    //  };
});