//Корзина
//@author wiz <wiz@kerpc.ru>
//@version 2.6
//
//В куке 'cart' хранится строка с текущим заказом в виде "id=quantity=price|id=quantity=price"
//tr с элементами относящимися к одному товару должна иметь name равный id товара, либо другому уникальному полю товара.
//В той же tr находится span с классом price, содержащий цену товара,
//а так же input с классом quantity для ввода количества товара для заказа.
//нажатие на .order - добавление в корзину (альтернативно - при изменении значения в поле количества, строка 36). Если есть класс rettrue - вернёт true.
//.cart_calc - принудительно пересчитывает корзину (пробегается по всем количествам в таблице) и удаляет строки с input.chdel:checked
//.cart_clear - элемент управления, очищающий корзину
// span.carttotal - общая цена корзины
// span.cartnumtotal - общая цена корзины


function setCookie (name, value, expires, path, domain, secure)
{
	if (path  == undefined)
	{
		path = '/'
	}
	document.cookie = name + "=" + escape(value) +
	((expires) ? "; expires=" + expires : "") +
	((path) ? "; path=" + path : "") +
	((domain) ? "; domain=" + domain : "") +
	((secure) ? "; secure" : "");
}

function getCookie(name)
{
	var cookie = " " + document.cookie;
	var search = " " + name + "=";
	var setStr = null;
	var offset = 0;
	var end = 0;
	if (cookie.length > 0)
	{
		offset = cookie.indexOf(search);
		if (offset != -1)
		{
			offset += search.length;
			end = cookie.indexOf(";", offset)
				if (end == -1)
			{
				end = cookie.length;
			}
			setStr = unescape(cookie.substring(offset, end));
		}
	}

	return(setStr);
}

function deleteCookie(name)
{
	setCookie(name, '', "Mon, 01-Jan-2001 00:00:00 GMT");
}
var CART = {
	//переменные
	total: getCookie('total'),//общая цена
	totalnum: getCookie('totalnum'),// общее количество заказанных товаров
	getItems: function()
	{
		var result = {};
		var bCart = getCookie('cart');
		if (bCart != null) {
			$.each(bCart.split('|'), function(i, e) {
				if (e) {
					var cartItem = e.split('=');
					result[cartItem[0]] = cartItem;
				}
			});
		}
		return result;
	} ,
	getLine: function(cart) {
		var lines = [];
		for (var i in cart) {
			lines.push(cart[i].join('='));
		}
		return lines.join('|');
	} ,
	iteminfo: '',//массив даных о текущем предмете 0 - id; 1 - количество; 2 - цена 3 = ограничение;
	//Общие методы
	additem: function (id, quantity, price)
	{
		//alert('Добавление' + id + ' : ' + quantity + ' : ' + price);
		cart = CART.getItems();
		if (typeof price == "undefined") price = "0";
		price = price.replace(/,/g, '.');//запятые на точки
		price = price.replace(/[^0-9]/g, ''); //убираем всяку хрень
		price = price.replace(/\.$/g, ''); //убираем точку с конца
		if (price == "") price = "0";

		if (cart[id]) {
			cart[id][1] += quantity;
		} else {
			cart[id] = [id, quantity, price];
		}
		var s = CART.getLine(cart);
		setCookie('cart', CART.getLine(cart));
	} ,
	deleteItem: function(id)
	{
		cart = CART.getItems();
		if (cart[id]) {
			delete cart[id];
		}
		setCookie('cart', CART.getLine(cart));
	}
	,
	changeQuantity: function (quantity, id)  //alert("l");
	{
		cart = CART.getItems();
		if (cart[id]) {
			cart[id][1] = quantity;
		}
		setCookie('cart', CART.getLine(cart));
		CART.recalc();
	},
	//спецефичные методы
	recalc: function ()
	{
		cart = CART.getItems();// Обновляем инфу о предметах в каталоге.
		//переменные
		var total = 0;
		var totalnum = 0;
		var sn = 0;
		if (!cart || cart=='') {
			setCookie('totalnum', 0);
			setCookie('total', 0);
			$("span.cart_total").html('0');
            $("span.price_total").html('0');
			$("span.cartnumtotal").html('0');
			//alert('Корзина пуста!');
			return false;
		}
		for (var i in cart) {
			sn = Math.round(cart[i][1] * cart[i][2] * 100) / 100;
			total += cart[i][1] * cart[i][2].replace(',', '.');
			$('tr#id'+cart[i][0]).children('td.sum').html(sn);
			if (parseInt(cart[i][1])>0) totalnum += parseInt(cart[i][1]);
			$('input[data-rel="'+cart[i][0]+'"]').addClass('incart');
			$('button[data-rel="'+cart[i][0]+'"]').addClass('incart').children('span').html('В корзине');
			$('input[data-name="quantity'+cart[i][0]+'"]').val(cart[i][1]);

			//console.log($('input[name="quantity'+cart[i][0]+'"]').val());
		};
		total = Math.round(total*100)/100;
		if (total <= 0 && totalnum <= 0) {
			setCookie('totalnum', 0);
			setCookie('total', 0);
			$("span.cart_total").html('0');
			$("span.price_total").html('0');
			$("span.cartnumtotal").html('0');
		} else {
			setCookie('totalnum', totalnum);
			setCookie('total', total);
			$("span.cart_total").html(total.toFixed(0));
			$("span.price_total").html(total.toFixed(0));
			$("span.cartnumtotal").html(totalnum);

		}
	} ,
	deleteAll: function()
	{
		$("input.chdel").each( function(i, n)
		{
			tr = $(this).parents("tr");
			if (tr.length > 1) tr = $(tr[0]);
			id = $(tr).attr("data-name");
			tr.css("background", "#dd6666").fadeOut('slow', function()
			{
				$(this).remove()}
			);
			CART.deleteItem(id);
		}
		);
		deleteCookie('cart');
	} , //удалить все
	deleteSelected: function()
	{
		$("input.chdel").each( function(i, n)
		{
			if (this.checked == true)
			{
				tr = $(this).parents("tr");
				if (tr.length > 1) tr = $(tr[0]);//если таблица в таблице выбираем ближайщую.
				id = $(tr).attr("data-name");
				tr.css("background", "#dd6666").fadeOut('slow', function()
				{
					$(this).remove();
					if ($('tr.goodRow').length <= 0) {
						location.reload();
					}
				}); //Анимация
				CART.deleteItem(id);
			}
		}
		);
	} ,	//удалить выбранное
    deleteOne: function(v)
	{
		$('div[data-name = ' + v + ']').remove();
		CART.deleteItem(v);
		CART.recalc();
		return false;
	}

}


$(document).ready(function ()
{



  $(".b_current_delete").click(function() {
      if (confirm('Вы точно хотите удалить?')) {
        CART.deleteOne($(this).attr('data-rel'));
        return false;
      }
    }
	);

	$("input.quantity").bind("keyup", function(e) {
		changeCount(this);
	} );

    /*  */
	/*$('.count_minus').each(function (i) {
        var v = $(this).siblings('.quantity');
        //if (v.val() == 1) {
        //    $(this).children('img').attr('src','images/design/count_minus2.png');
        //}else{
        //    $(this).children('img').attr('src','images/design/count_minus.png');
        //}
	});*/


	$('.count_plus').click(function() {
		var v = $(this.parentNode).children(".quantity");
		v.val(parseInt(v.val())+1);
    //if(v.val() > 1){
    //	$(this).siblings('.count_minus').children('img').attr('src','images/design/count_minus.png');
    //}
		changeCount(v[0]);
	});

	$('.count_minus').click(function() {
		var v = $(this.parentNode).children(".quantity");
        if (v.val() == 1) {
            v.val() = 1;
        }else{
            v.val(parseInt(v.val())-1);
            //if(v.val() > 1){
            //    $(this).children('img').attr('src','images/design/count_minus.png');
            //}else{
             //   $(this).children('img').attr('src','images/design/count_minus2.png');
            //}
        }
		changeCount(v[0]);
	});

	function changeCount(obj) {
		var id = parseInt(obj.name.replace(/[^0-9.]/g, ''));
		var cnt = parseInt(obj.value.replace(/[^0-9]/g, ''));
		if (cnt <= 0 || !cnt) cnt = 1;
		if ($(obj).hasClass('catalog')) {
			obj.value = cnt;
		} else {
			CART.changeQuantity(cnt, id);
		}
	}

	CART.recalc(); 
});//end ready


$(document).ready(function ()
{

var bgModalWindow = $(".bgModalWindow"),
    windowHeight = $(window).height(),
    mwBasket = $(".modalWindowBasket"),
    mwOneClick = $(".modalWindowOneClick");

	$(".btnadd").click(function() {
        if ( !$(this).hasClass('incart') ) {

        setTimeout(function(){ 
            mwOneClick.hide();
            bgModalWindow.show();
            mwBasket.show();
            mwHeight = mwBasket.height();
            pt = (windowHeight - mwHeight) / 3;
            bgModalWindow.css("padding-top", pt);
        }, 600);

			cart = CART.getItems();
			var name = $(this).attr('data-rel');

			if (cart != null) {
				if (!cart[name])
				{
					var countVal = $("input.quantity[data-name='quantity"+name+"']");
					var val = 1;

					if (countVal.length != 0) {
						val = countVal.val();

						//console.log("val" + val);
					}
					var price = $("span.price[data-name=pri"+name+"]").html();
					CART.additem(name, val, price);
					setTimeout(function() { CART.recalc(); }, 5);
				}
			}

	        var this_rel = $(this).attr('data-rel');
			var eto = $(this);
			setTimeout(function()
			{
				var foto_id = $('img[data-foto=foto' + this_rel + ']' ).attr('src');

				var name_id = $('[data-name=name' + this_rel + ']').text();    console.log('this_rel = ' + this_rel);
		        var cost = parseInt($('[data-name=pri' + this_rel + ']').html());   console.log('cost = ' + cost);
		        var number1 = 1;
				var this_desk = '';
		        var nt;
				var total = $('.cartnumtotal').html();
				var kolvo = $(".quantity").val();
				//var kolvo_tovar = $('[data-kolvo=kolvo' + this_rel + ']').text(); 
				//console.log('kolvo_tovar = ' + kolvo_tovar);
				//number1 = eto.parents('.iteminfo').find('input.quantity').val(); 

				console.log('total = ' + total);
		        if (total == 1) {
		        	nt = '';
		        } else {
		        	if (total == 2 || total == 3 || total == 4) {
		        		nt = 'a';
		        	} else {
		        		if (total > 4) {
		                	nt = 'ов';
		        		}
		        	}
		        }     console.log('this_rel = ' + this_rel);
                if ( $('input[data-name=quantity' + this_rel + ']').length > 0 ) {
                	number1 = eto.parents('.iteminfo').find('input.quantity').val();
					console.log('number1 = ' + number1);
                }

				$(".mwBasket__amt .amt").text(kolvo);
                $('.cost').html( cost );
		        $('.tov_ok').html(nt);
				$('.basket_in-image').attr('src', foto_id);
				$('.basket_in-txt-name').html(name_id + '<br>');
				$('.basket_in-txt-number__numeral').html(number1);
				//$('.kolvo_tovar').text(kolvo_tovar);
			   //	$('.basket_in-txt-number__numeral').html(number1);
				if ( $('div[data-desk=desk' + this_rel +']').length > 0 ) {
		        	this_desk = $('div[data-desk=desk' + this_rel + ']').text();    console.log('this_desk');
		            $('.basket_in-txt-char-p').text(this_desk);
					$('.basket_in-txt-char-h').show();
				} else {
		            $('.basket_in-txt-char-p').text('');
					$('.basket_in-txt-char-h').hide();
				}
			//}
	        }, 100);
		}
		return false;
	});//end btnedd click

// Дублируем инфу в форму "Купить в 1 клик"
$(".btnOneClick").click(function(){
		var name = $("h1").text(),
			price = $(".price").text(),
 			img = $(".content .itemview .img img").attr("src"),
 			toName = $(".mwOneClick__name"),
 			toPrice = $(".mwOneClick__price .number"),
 			toImg = $(".mwOneClick__itemview img"),
 			hiddenName = $(".mwOneClick__name_name"),
 			hiddenPrice = $(".mwOneClick__price_priсe");

				toName.text(name);
				hiddenName.val(name);
				toPrice.text(price);
				hiddenPrice.val(price);
				toImg.attr("src", img);

});// end btnOneClick



  //$(".b_current_delete").click(function() {
	/*$('body').on( 'click', '.delete-button	', function() {
      if (confirm('?? ????? ?????? ????????')) {
        CART.deleteOne($(this).attr('rel'));
        return false;
      }
    }
	);



	function changeCount(obj) {
		var id = parseInt(obj.name.replace(/[^0-9.]/g, ''));
		var cnt = parseInt(obj.value.replace(/[^0-9]/g, ''));
		if (cnt <= 0 || !cnt) cnt = 1;
		if ($(obj).hasClass('catalog')) {
			obj.value = cnt;
		} else {
			CART.changeQuantity(cnt, id);
		}
	}

	CART.recalc();*/
});//end ready

