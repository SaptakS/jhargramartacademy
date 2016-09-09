$('.menu-toggle').click(function(){
	if($('.navigation').hasClass('opened')) {
        $(this).find('.fa').removeClass('fa-times').addClass('fa-bars');
        $('.navigation').removeClass('opened').addClass('closed');
    } else {
        $(this).find('.fa').removeClass('fa-bars').addClass('fa-times');
        $('.navigation').removeClass('closed').addClass('opened');
    }
});

var menu= 0	
$(function(){
	
	//$('.contacts').hide();
	//$('.about').hide();
        
	$('.closeme, .btn_close, .close_about_resp').click(function(e) {
		if($('.about')){
		$('.popup, .about').fadeOut(300);}
		if($('.contacts')){
		$('.popup, .contacts').fadeOut(300);}
		$('.contenido_popup').removeClass('popup_abierto');
		$('#header').fadeIn(300);
		$('#container').fadeIn(300);
		$('#footer').fadeIn(300);
		
	});

	
});


function toAbout(){
	$('#header').fadeOut(300);
	$('#container').fadeOut(300);
	$('#footer').fadeOut(300);
	$('.about').fadeIn(300);
	$('.menu_resp').fadeOut(300)
}


function toContact(){
	$('#header').fadeOut(300);
	$('#container').fadeOut(300);
	$('#footer').fadeOut(300);
	$('.contacts').fadeIn(300);
	$('.menu_resp').fadeOut(300)
}