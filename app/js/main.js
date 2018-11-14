$(document).ready(function () {
    $("body").on('click', 'label', function(){

        var check = $(this).parent();

        if(!check.hasClass('check_active'))
        {
            check.addClass('check_active');

        }
        else
        {
            check.removeClass('check_active');


        }
//находим все чекнутые инпуты
    });
    $(".check input").each(function(){
        var check = $(this).parent();

        if($(this).prop( "checked" ))
        {

            check.addClass('check_active');

        }
        else
        {
            check.removeClass('check_active');
        }
    });
    $("body").on('click', '.sorting button', function(){
        var parbut = $(this).parent();
        parbut.toggleClass('descending');
    });
    $("#wr-tabs").on("click", ".tab", function(){

        var tabs = $("#wr-tabs .tab"),
            cont = $("#wr-tabs .tab-cont");

        // Удаляем классы active
        tabs.removeClass("active");
        cont.removeClass("active");
        // Добавляем классы active
        $(this).addClass("active");
        cont.eq($(this).index()).addClass("active");

        return false;
    });
});
