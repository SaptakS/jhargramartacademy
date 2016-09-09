var menu= 0	
$(function(){
	$('.art').hide();
	$('.dance').hide();
	$('.puppet').hide();
    $('.closeme, .btn_close, .close_about_resp').click(function(e) {
	//	ion.sound.play("close");
		if($('.art')){
		$('.popup, .art').fadeOut(300);}
		if($('.dance')){
		$('.popup, .dance').fadeOut(300);}
		if($('.puppet')){
		$('.popup, .puppet').fadeOut(300);}
		$('.contenido_popup').removeClass('popup_abierto');
		$('.ch-grid').fadeIn(300);
		$('#footer, #ddmenu').fadeIn(300);
		
	});	
});


function toArt(){
	$('#footer, #ddmenu').hide();
	$('.ch-grid').fadeOut(300);
	$('.art').fadeIn(300);
	$('.menu_resp').fadeOut(300)
}

function toDance(){

	$('#footer, #ddmenu').hide();
	$('.ch-grid').fadeOut(300);
	$('.dance').fadeIn(300);
	$('.menu_resp').fadeOut(300)
}

function toPuppet(){
	$('#footer, #ddmenu').hide();
	$('.ch-grid').fadeOut(300);
	$('.puppet').fadeIn(300);
	$('.menu_resp').fadeOut(300)
}



