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
});
