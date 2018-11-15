$(document).ready(function () {
    // функция добавления класса лэйблу чекнутого инпута
    $("body").on('click', 'label', function () {
        var check = $(this).parent();
        if (!check.hasClass('check_active')) {
            check.addClass('check_active');
        }
        else {
            check.removeClass('check_active');
        }
    });
    //при загрузке страницы чекаем все инпуты
    $('.check input').each(function () {
            var check = $(this).parent();
            $(this).prop("checked", "checked");
            check.addClass('check_active');
    });
    //меняем направление стрелки при изменении вида сортировки по цене
    $("body").on('click', '.sorting button', function () {
        var parbut = $(this).parent();
        parbut.toggleClass('descending');
    });
    // функция для вкладок
    $("#wr-tabs").on("click", ".tab", function () {
        var tabs = $("#wr-tabs .tab"),
            cont = $("#wr-tabs .tab-cont"),
            ind = $(this).parent().index();
        // Удаляем классы active
        tabs.removeClass("active");
        cont.removeClass("active");
        // Добавляем классы active
        $(this).addClass("active");
        cont.eq(ind).addClass("active");
        return false;
    });
});
