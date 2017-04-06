$(document).ready(function () {
	document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
		WeixinJSBridge.call('hideOptionMenu');
	});
//	推荐商品
//	$('.menu .ccbg dd').each(function(){
//		if( $(this).attr("menu") == '1' ){
//			$(this).show();
//		}else{
//			$(this).hide();
//		}
//	});
	
	// 下单页面 选择地区后 触发查询自提点
	$("#s_county, #s_city, #s_province").on('change', function() {
		var zt_province = $("#s_province").val();
		var zt_city = $("#s_city").val();
		var zt_county = $("#s_county").val();
		if(zt_county && zt_county != 'undefined' && zt_county != '' && zt_county != 0) {
			$.ajax({
				url:appurl+'/App/Index/get_ziti',
				type:'POST',
				data:'province='+zt_province+'&city='+zt_city+'&county='+zt_county,
				success: function(res) {
					
					if(res['status'] == 1){
						$(".ziti").empty();

						if(Object.prototype.toString.call(res['info']).slice(8, -1) == 'Object') {
							var ziti = '<div class="mui-sku ziti">';
							$.each(res['info'], function(id, info) {

								ziti += '<input id="ziti_'+id+'" onclick="check_ziti(this);" style="width:14px;height:14px;" type="checkbox" name="ziti" value="'+id+'"><label for="ziti_'+id+'">'+info.address+'&nbsp;('+info.contact_name+'：'+info.phone+')&nbsp;</label>';
							});
							ziti += '</div>';

							$("#address").after(ziti);
						}		

					}

				}
			});
		}
	});

	$('#cart').on('click' , function (){
		if(click_type==1){
			$('#menu-container').hide();
			$('#cart-container').show();
			$('#user-container').hide();
			
			$(".footermenu ul li a").each(function(){
				$(this).attr("class","");
			});
			$(this).children("a").attr("class","active");
			
			$(".footermenu").hide();
			click_type=0;
		}
	});
	$('#home').on('click' , function (){
		$('#menu-container').show();
		$('#cart-container').hide();
		$('#user-container').hide();
		
		$(".footermenu ul li a").each(function(){
			$(this).attr("class","");
		});
		$(this).children("a").attr("class","active");
	});
	
	
	$('#ticket').on('click' , function (){
		$('#tx-container').hide();
		$('#member-container').hide();
		$('#user-container').hide();
		$('#ticket-container').show();
		$(".footermenu ul li a").each(function(){
			$(this).attr("class","");
		});
		$(this).children("a").attr("class","active");
	})
	
	$('#member').on('click' , function (){
		$('#tx-container').hide();
		$('#ticket-container').hide();
		$('#user-container').hide();
		$('#member-container').show();
		
		$(".footermenu ul li a").each(function(){
			$(this).attr("class","");
		});
		$(this).children("a").attr("class","active");
	})
	
	$('#tx').on('click' , function (){
		$('#ticket-container').hide();
		$('#member-container').hide();
		$('#user-container').hide();
		$('#tx-container').show();
		
		$(".footermenu ul li a").each(function(){
			$(this).attr("class","");
		});
		$(this).children("a").attr("class","active");
	})
	
	$('#user').on('click' , function (){
		$('#menu-container').hide();
		$('#cart-container').hide();
		$('#ticket-container').hide();
		$('#member-container').hide();
		$('#tx-container').hide();
		$('#user-container').show();

		$(".footermenu ul li a").each(function(){
			$(this).attr("class","");
		});
		$(this).children("a").attr("class","active");
        
		$.ajax({
			type : 'POST',
			url : appurl+'/App/Index/getorders',
			data : {
				uid : $_GET['uid']
			},
			success : function (response , status , xhr){
				if(response){
					var json = eval(response); 
					var html = '';
					var order_status = '';
					var host='http://'+window.location.host+appurl+'?g=App&m=Index&a=member&page_type=order';
					host=host.replace(/\&/g, "%26");
					$.each(json, function (index, value) {
						var pay = '';
						var order = '';
						var url = '?g=App&m=Index&a=del_order&id='+value.id;
						var url2 ='?g=App&m=RefundOrder&a=index&oid='+value.id;
						var regoodurl = '/App/Index/refund_good';//退换货
						if (value.order_status == '0'){
							order_status = 'no';
							order = '未发货';
						}else if ( value.order_status == '1'){
							order_status = 'no';
							var confirm_url = appurl+'?g=App&m=Index&a=confirm_order&id='+value.orderid+'&uid='+$_GET['uid'];
							order = '<a href="'+confirm_url+'" style="color:red">确认收货</a>';
						}else if ( value.order_status == '4'){
							order_status = 'no';
							order = '已退货';
						}else{
							order_status = 'ok';
							order = '已完成';
						}
						
						if (value.pay_status == '0'){
							pay_status = 'no';
							pay = '<a href="'+value.pay_url+'">去支付</a>';
							$('.regood').hide();
						}else if ( value.pay_status == '1'){
							pay_status = 'ok';
							pay = '已支付';
						}
						//html += '<tr><td>'+value.orderid+'</td><td class="cc">'+value.totalprice+'元</td><td class="cc"><em class="'+pay_status+'">'+pay+'</em></td><td class="cc"><em class="'+order_status+'">'+order+'</em></td></tr>';
						
						html += '<li style="border: 1px solid #d0d0d0;border-radius: 10px;margin-bottom:10px;background-color:#FFF;"><table style="width:100%;"><tr><td style="border-bottom:0px">订单编号:'+value.orderid+'</td></tr>';
						html += '<td style="border-bottom:0px">订单金额:'+value.totalprice+'元</td></tr>';
						html += '<td style="border-bottom:0px">订单时间:'+value.time+'</td></tr>';
						html += '<td style="border-bottom:0px">支付状态:<em class="'+pay_status+'">'+pay+'</em>';
						if (value.pay_status == '0')
						{
							html += '<a href="'+value.pay_url+'">(已经支付?)</a>';
						}
						html += '</td></tr>';
						if(value.order_status == '1')
						{
							html += '<td style="border-bottom:0px">订单状态:<em class="'+order_status+'" style="background-color:#FFFF00;">'+order+'</em></td></tr>';
						}
						else
						{
							html += '<td style="border-bottom:0px">订单状态:<em class="'+order_status+'">'+order+'</em></td></tr>';
						}
						
						html += '<td style="border-bottom:0px">商品名称:'+value.cart_name+'</td></tr>';
						html += '<td style="border-bottom:0px">订单详情:'+value.note+'</td></tr>';
						
						html += '<td style="border-bottom:0px">快递公司:'+value.order_info_name+'</em></td></tr>';
						html += '<td style="border-bottom:0px">快递单号:'+value.order_info_num+'</em></td></tr>';
						if(value.cancel_time >= 0) {
							html += "<td style='border-bottom:0px' class='cancel_time' data-time='"+value.cancel_time+"'>剩余支付时间：<span class='m' style='display:inline;padding:0px;'>00</span>:<span class='s' style='display:inline;padding:0px;'>00</span></td></tr>";
						}
						if (value.ziti_id > 0 && value.pay_status == '1') {
							if(value.order_status < 2) {
								html += '<td style="border-bottom:0px">自提码:'+value.ziti_code+'</em></td></tr>';
								html += '<td style="border-bottom:0px">自提点:'+value.ziti_address+'&nbsp;（'+value.ziti_contact_name+'&nbsp;'+value.ziti_phone+'）</em></td></tr>';
							}							
						}
						
						html+='<tr><td>';
						if(window.location.host=='bcs.winbz.com'){
							html += '取消订单，请联系DDY客服：4000755867</td></tr><tr><td>';
						}else if(value.pay_status==0){
							html += '<a href='+appurl+url+' onclick = "return func_('+value.order_status+','+value.pay_status+')"><div class="del_order">取消订单</div></a>';
						}
						
						if(value.ziti_id > 0 && value.order_status > 1) {
							html += '<a href="javascript:;" ><div class="del_order">已核销</div></a>';
						}
						
						if(value.order_status == '1'){
							html+='<a href="http://m.kuaidi100.com/index_all.html?type='+value.order_info_name+'&postid='+value.order_info_num+'&callbackurl='+host+'"><div class="see_order">查看物流</div></a>';
						}
						
						if(value.pay_status=='1' && value.order_status<2 && value.show==1){
							
							html+='<a href="'+appurl+url2+'"><div class="qc_order">退/换货</div></a>';						
						}
						html+='</td></tr>';
						html += '</table></li>';
					});
					
					$('#orderlistinsert').empty();
					$('#orderlistinsert').append( html );					
				}

			},
			beforeSend : function(){
    			$('#page_tag_load').show();
	    	},
	    	complete : function(){
	    		$('#page_tag_load').hide();
	    		edit_time();
	    	}
		});
	});
});

/* 取消订单 */
function func_(order_status,pay_status){

	if(order_status == 1){
		
		alert('商品已发货！');
		
		return false;
		
	}else if(pay_status == 1){
		
		alert('商品已付款!');
		
		return false;
		
	}else if(!confirm("确认要取消订单？")){
			
        event.returnValue = false;

	}
				
}
/* END 取消订单 */

//退货
function regood(order_status,pay_status){
	if (pay_status == 0 ) {
		alert('商品未付款');
		return false;
	}else if(order_status==4){
		alert('商品已退货');
		return false;
	}
}

function user() {
	$('#user').click();
}
function home() {
	$('#home').click();
}
function clearCache(){
	$('#ullist').find('li').remove();

	$('#home').click();

	$('.reduce').each(function () {
		$(this).children().css('background','');
	});
	$('#totalNum').html(0);
	$('#cartN2').html(0);
	$('#totalPrice').html(0);
}
function addProductN (wemallId){
	var jqueryid = wemallId.split('_')[0]+'_'+wemallId.split('_')[1];
	var price = parseFloat( wemallId.split('_')[2] );
	var productN = parseFloat( $('#'+jqueryid).find('.count').html() );
	$('#'+jqueryid).find('.count').html( productN + 1);

	var cartMenuN = parseFloat($('#cartN2').html())+1;
	$('#totalNum').html( cartMenuN );
	$('#cartN2').html( cartMenuN );
	
	var totalPrice = parseFloat($('#totalPrice').html())+ parseFloat(good_price);
	$('#totalPrice').html( totalPrice.toFixed(2) );
}
function reduceProductN ( wemallId ){
	var price = parseFloat( wemallId.split('_')[2] );
	var jqueryid = wemallId.split('_')[0]+'_'+wemallId.split('_')[1];
	var reduceProductN = parseFloat( $('#'+jqueryid).find('.count').html() );
	if ( reduceProductN == 1) {
		return false;
	}
	
	$('#'+jqueryid).find('.count').html( reduceProductN - 1);
	
	var cartMenuN = parseFloat($('#cartN2').html())-1;
	$('#totalNum').html( cartMenuN );
	$('#cartN2').html( cartMenuN );

	var totalPrice = parseFloat($('#totalPrice').html())- parseFloat(good_price);
	$('#totalPrice').html( totalPrice.toFixed(2) );
}
function doProduct (id , name , price,img) {
	var bgcolor = $('#'+id).children().css('background-color').colorHex().toUpperCase();
	if (bgcolor == '#FFFFFF') {
		$('#'+id).children().css('background-color','#D00A0A');

		var cartMenuN = parseFloat($('#cartN2').html())+1;
		$('#totalNum').html( cartMenuN );
		$('#cartN2').html( cartMenuN );

		var totalPrice = parseFloat($('#totalPrice').html())+ parseFloat(price);
		$('#totalPrice').html( totalPrice.toFixed(2) );

		var wemallId = 'wemall_'+id;
		var html = '<li class="ccbg2" id="'+wemallId+'"><div class="orderdish"><span class="idss"  style="display:none;">'+id+'</span><span name="title">'+name+'</span><span class="price" id="v_0" style="display:none;">'+price+'</span><span style="display:none; class="price">元</span></div><div class="orderchange"><a href=javascript:addProductN("'+wemallId+'_'+price+'") class="increase"><b class="ico_increase">加一份</b></a><span class="count" id="num_1_499">1</span><a href=javascript:reduceProductN("'+wemallId+'_'+price+'") class="reduce"><b class="ico_reduce">减一份</b></a></div></li>';
	
		$('#ullist').append(html);
		
		$('#good_pic').attr('src',img)
	}else{
		$('#'+id).children().css('background-color','');

		var cartMenuN = parseFloat($('#cartN2').html())-1;
		$('#totalNum').html( cartMenuN );
		$('#cartN2').html( cartMenuN );

		var totalPrice = parseFloat($('#totalPrice').html())- parseFloat(price);
		$('#totalPrice').html( totalPrice.toFixed(2) );

		var wemallId = 'wemall_'+id;
		$('#'+wemallId).remove();
	}
}

function submitTxOrder () {

	if(!confirm("您确认需要提现吗？"))
	{
		return false;
	}

	$.ajax({
		type : 'POST',
		url : appurl+'/App/Index/addtxorder',
		data : {
			uid : $_GET['uid'],
			userData : $('form').serializeArray()
		},
		success : function (response , status , xhr) {
			if(response.error==true || response.error==false)
			{
				alert(response.msg);
				if(response.error==false){
					//window.location.reload();
				}
				return false;
			}
			else
			{
				alert("系统繁忙，请稍候再试");
				return false;
			}
		},
		beforeSend : function(){
			$('#tx-menu-shadow').show();
			$('#txshowcard').hide();
		},
		complete : function(){
			$('#tx-menu-shadow').hide();
			$('#txshowcard').show();
		}
	});
}

function submitOrder () {
	//获取订单信息
	var json = '';
	$('#ullist li').each(function () {
		var name = $(this).find('span[name=title]').html();		//用户名称
		var num = $(this).find('span[class=count]').html();		//商品数量
		var price = $(this).find('span[class=price]').html();	//商品单价
		var id = $(this).find('span[class=idss]').html();		//产品id
		json += '{"name":"'+name+'","num":"'+num+'","price":"'+price+'","id":"'+id+'"},';	
		
	});
	json = json.substring(0 , json.length-1);
	json = '['+json+']';
	if($('#totalPrice').html()<=0)
	{
		alert('请选择商品');
		return false;
	}
	var name = $('#name').val();
	var ziti = $("input[name='ziti']:checked").val();
	var phone = $('#phone').val();
	var weixin = $('#weixin').val();
	var address = $('#address').val();
	var s_province = $('#s_province').val();
	var s_city = $('#s_city').val();
	var s_county = $('#s_county').val();
	var coin =$('#coin').val();	//折扣金额
	var maxcoin=$('#maxcoin').val();
	var reg=/^\d+(\.)?(\d{1,2})?$/;
	if(typeof(coin)!='undefined' && coin!='')
	{
		coin=parseFloat(coin);
		maxcoin=parseFloat(maxcoin);
		if(coin<0){
			alert('抱歉，余额使用不能为负数');
			return false;
		}else if(reg.test(coin)==''){
			alert('抱歉，余额使用最多为小数点后两位');
			return false;
		}else if(coin>maxcoin){
			alert('抱歉，您最多只能使用'+maxcoin+'元');
			return false;
		}
	}

	host = window.location.host;
	if(province_check)
	{
		if(s_province=='')
		{
			alert('请选择省份');
			return false;
		}
		
		if(s_city=='城市')
		{
			//alert('请选择城市');
			//return false;
		}
		if(host == 'zzh.winbz.com') {
			if(s_city=='杭州市') {
				alert('杭州地区不能购买');
				return false;
			}
		}
		
		var user_address = s_province+','+s_city+','+s_county+','+address;
	}
	else
	{
		var user_address = address;
	}

	if(host != 'qbt.winbz.com') {
		if(address.length<=0)
		{
			alert('请输入地址');
			return false;
		}
	}	
	
	if(s_county=='区域')
	{
		s_county = '';
	}
	
	if(name.length<=0)
	{
		alert('请输入名称');
		return false;
	}
	
	if(phone.length<=0)
	{
		alert('请填写手机号！');
		return false;
	}
	/*2016-1-11 下单信息校验优化*/
	var pattern = /^1[34578]\d{9}$/; 
	if(!pattern.test(phone)){
		alert('请填写正确格式的手机号码！');
		return false;
	}
	/*/下单信息校验优化*/	

	$.ajax({
		type : 'POST',
		url : appurl+'/App/Index/addorder',
		data : {
			uid : $_GET['uid'],
			cartData : json,
			userData : $('form').serializeArray(),			
			totalPrice : $('#totalPrice').html(),
			coin:coin,
			user_address:user_address,
			good_num_cnt:good_num_cnt,
			good_num_id:good_num_id,
			ziti:ziti,
		},
		success : function (response , status , xhr) {
			
			if (response.msg) {
				alert(response.msg);return false;
			}
			
			$('#user').click();
			$('#ullist').find('li').remove();
			$('.reduce').each(function () {
				$(this).children().css('background','');
			});
			$('#totalNum').html(0);
			$('#cartN2').html( 0 );
			$('#totalPrice').html(0);
			
			if (response) {
				window.location.href=response;return false;
			}
			
			$.ajax({
				type : 'POST',
				url : appurl+'/App/Index/getorders',
				data : {
					uid : $_GET['uid']
				},
				success : function (response , status , xhr){
					if(response){
						var json = eval(response); 
						var html = '';
						var order_status = '';
						
						$.each(json, function (index, value) {
							var pay = '';
							var order = '';
							if (value.order_status == '0'){
								order_status = 'no';
								order = '未发货';
							}else if ( value.order_status == '1'){
								order_status = 'no';
								var confirm_url = appurl+'/App/Index/confirm_order?id='+value.orderid+'&uid='+$_GET['uid'];
								order = '<a href="'+confirm_url+'" style="color:red">确认收货</a>';
							}else if ( value.order_status == '4'){
								order_status = 'no';
								order = '已退货';
							}else{
								order_status = 'ok';
								order = '已完成';
							}
							
							if (value.pay_status == '0'){
								pay_status = 'no';
								pay = '<a href="'+value.pay_url+'">去支付</a>';
							}else if ( value.pay_status == '1'){
								pay_status = 'ok';
								pay = '已支付';
							}
							//html += '<tr><td>'+value.orderid+'</td><td class="cc">'+value.totalprice+'元</td><td class="cc"><em class="'+pay_status+'">'+pay+'</em></td><td class="cc"><em class="'+order_status+'">'+order+'</em></td></tr>';
						
							html += '<li style="border: 1px solid #d0d0d0;border-radius: 10px;margin-bottom:10px;background-color:#FFF;"><table><tr><td style="border-bottom:0px">订单编号:'+value.orderid+'</td></tr>';
							html += '<td style="border-bottom:0px">订单金额:'+value.totalprice+'元</td></tr>';
							html += '<td style="border-bottom:0px">订单时间:'+value.time+'</td></tr>';
							html += '<td style="border-bottom:0px">支付状态:<em class="'+pay_status+'">'+pay+'</em>';
							if (value.pay_status == '0')
							{
								html += '<a href="'+value.pay_url+'">(已经支付?)</a>';
							}
							html += '</td></tr>';
							if(value.order_status == '1')
							{
								html += '<td style="border-bottom:0px">订单状态:<em class="'+order_status+'" style="background-color:#FFFF00;">'+order+'</em></td></tr>';
							}
							else
							{
								html += '<td style="border-bottom:0px">订单状态:<em class="'+order_status+'">'+order+'</em></td></tr>';
							}
						
							
							html += '<td style="border-bottom:0px">商品名称:'+value.cart_name+'</td></tr>';
							html += '<td style="border-bottom:0px">订单详情:'+value.note+'</td></tr>';
							
							html += '<td style="border-bottom:0px">快递公司:'+value.order_info_name+'</em></td></tr>';
							html += '<td style="border-bottom:0px">快递单号:'+value.order_info_num+'</em></td></tr>';
							if (value.ziti_id > 0 && value.pay_status == '1') {
								if(value.order_status < 2) {
									html += '<td style="border-bottom:0px">自提码:'+value.ziti_code+'</em></td></tr>';
									html += '<td style="border-bottom:0px">自提点:'+value.ziti_address+'&nbsp;（'+value.ziti_contact_name+'&nbsp;'+value.ziti_phone+'）</em></td></tr>';
								}
							}
							
							html += '</table></li>';
						
						});
						$('#orderlistinsert').empty();
						$('#orderlistinsert').append( html );
					}
				},
				beforeSend : function(){
	    			$('#page_tag_load').show();
		    	},
		    	complete : function(){
		    		$('#page_tag_load').hide();
		    		edit_time();
		    	}
			});
		},
		beforeSend : function(){
			$('#menu-shadow').show();
			$('#showcard').hide();
		},
		complete : function(){
			$('#menu-shadow').hide();
			$('#showcard').show();
		}
	});
	

}
var $_GET = (function(){
	var url = window.document.location.href.toString();
	var u = url.split("?");
	if(typeof(u[1]) == "string"){
		u = u[1].split("&");
		var get = {};
		for(var i in u){
			var j = u[i].split("=");
			get[j[0]] = j[1];
		}
		return get;
	} else {
		return {};
	}
})();
String.prototype.colorHex = function(){
	var that = this;
	if(/^(rgb|RGB)/.test(that)){
		var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
		var strHex = "#";
		for(var i=0; i<aColor.length; i++){
			var hex = Number(aColor[i]).toString(16);
			if(hex === "0"){
				hex += hex;	
			}
			strHex += hex;
		}
		if(strHex.length !== 7){
			strHex = that;	
		}
		return strHex;
	}else if(reg.test(that)){
		var aNum = that.replace(/#/,"").split("");
		if(aNum.length === 6){
			return that;	
		}else if(aNum.length === 3){
			var numHex = "#";
			for(var i=0; i<aNum.length; i+=1){
				numHex += (aNum[i]+aNum[i]);
			}
			return numHex;
		}
	}else{
		return that;	
	}
};

var good_num_cnt = 'null';
var good_num_id = 0;
var good_price_key = '';
var good_price = 0;
var good_old_price = 0;
var jfgood=0;
function showDetail(id , name , price,img,flag){

	window.shareData = {
		"imgUrl": shareData_url+"/Public"+img,
		"sendFriendLink": shareData_sendFriendLink,
		"tTitle": name,
		"tContent": shareData_tTitle
	};
	
	good_old_price = price;

	$.ajax({
		type : 'post',
		url : appurl+'/App/Index/fetchgooddetail',
		data : {
			id : id,
		},
		success : function(response , status , xhr){
			$('body').show();
			$('.disgood').each(function(){
				$(this).hide();
			});
			$('#mcover').show();
			var json = eval(response);
			$('#detailpic').attr('src',rooturl+'/Public/Uploads/'+json.image);
			$('#detailtitle').html(json.title);
			$('#detailinfo').html(json.detail);
			
			if(json.jfgood == 1){
				jfgood=1;
				$("#jfjfgood").html("积分");
			}
			good_num_key = json.good_num;
			good_num_id = id;
			
			if(typeof(json.guigename1) != "object" && typeof(json.guigevalue1) != "object")
			{
				if(json.guigename1.length>0 && json.guigevalue1.length>0)
				{
					$('#guigename1').html(json.guigename1+'：');
					$('#guigevalue1').html(json.guigevalue1);
					
					$('#type_siz1').attr('show',1);
					$('#type_siz1').show();
				}
			}
			
			if(typeof(json.guigename2) != "object" && typeof(json.guigevalue2) != "object")
			{
				if(json.guigename2.length>0 && json.guigevalue2.length>0)
				{
					$('#guigename2').html(json.guigename2+'：');
					$('#guigevalue2').html(json.guigevalue2);
					
					$('#type_siz2').attr('show',1);
					$('#type_siz2').show();
				}
			}
			
			good_price = good_old_price;
			
			check_shengyu();
			
			$('#detailinfo img').click(function(){
				img=$(this).attr('src');
				show1(img);	
			});
			function show1(img) {
			var arr = []
			  $("#detailinfo img").each(function () {
			  arr.push($(this).attr("src"));
			  })
				wx.previewImage({
				  current: img,
				  urls: arr
				});
			}
			
			$('#add_cart').click(function(){
				if(click_type==1){
					doProductNew (id , name , good_price,json.img);
				}
				
				//$('#cart').click();
			});		
			if(flag==1){
				doProductNew (id , name , good_price,json.img);
			}
		}
	});
}
function check_shengyu()
{
	var type1 = $('#type_siz1').attr('show');
	var type2 = $('#type_siz2').attr('show');

	if(type1==1 && type2==1)
	{
		var type1_value = $("input[name='type_size1']:checked").attr('id');
		var type2_value = $("input[name='type_size2']:checked").attr('id');
		
		var name = type1_value+'|'+type2_value;
	}
	else
	{
		var type1_value = $("input[name='type_size1']:checked").attr('id');
		
		var name = type1_value+'|gz2_0';
	}
	
	if(typeof(good_num_key[name])!='object')
	{
		return false;
	}
	var good_num = good_num_key[name]['num'];
	good_num_cnt = good_num_key[name]['key'];
	good_price = good_num_key[name]['price'];

	if(typeof(good_price)!="string" || good_price<=0)
	{
		good_price = good_old_price;
	}
	$('#ullist li').find('span[class=price]').html(good_price);  //更换商品规格时商品的单价
	
	var totalNum = parseFloat($('#totalNum').html()); 
	var totalPrice = parseFloat(good_price)*totalNum;
	$('#totalPrice').html(totalPrice);
	
	if(typeof(good_num)=='object')
	{
		good_num = 0;
	}
	
	if(typeof(good_num_cnt)=='object')
	{
		good_num_cnt = 'null';
	}
	
	$('#last_cnt').html(good_num);
	
	if(good_num<=0)
	{
		$('#showcard').css("background-color","#E0E0E0");
		$('#showcard').css("border","#E0E0E0");
		if(window.location.host=='bcs.winbz.com'){
			$('#showcard').attr("href","javascript:alert('请选择尺码规格！');");
		}
		else{
			$('#showcard').attr("href","javascript:alert('该规格的产品已经卖完了！');");
		}
		
	}
	else
	{
		$('#showcard').css("background-color","");
		$('#showcard').css("border","");
		$('#showcard').attr("href","javascript:submitOrder();");
	}
}

var order_list = new Array();


function in_array(search,array){
    for(var i in array){
        if(array[i]==search){
            return true;
        }
    }
    return false;
}
var click_type =0;
function now_buy(){
	click_type=1;
	$('#add_cart').click();
	$('#cart').click();

	// 自提点查询
	var zt_province = $("#s_province").val();
	var zt_city = $("#s_city").val();
	var zt_county = $("#s_county").val();
	if(zt_county && zt_county != 'undefined' && zt_county != '' && zt_county != 0) {
		$.ajax({
			url:appurl+'/App/Index/get_ziti',
			type:'POST',
			data:'province='+zt_province+'&city='+zt_city+'&county='+zt_county,
			success: function(res) {

				if(res['status'] == 1){
					if(Object.prototype.toString.call(res['info']).slice(8, -1) == 'Object') {
						var ziti = '<div class="mui-sku ziti">';
						$.each(res['info'], function(id, info) {

							ziti += '<input id="ziti_'+id+'" onclick="check_ziti(this);" style="width:14px;height:14px;" type="checkbox" name="ziti" value="'+id+'"><label for="ziti_'+id+'">'+info.address+'&nbsp;('+info.contact_name+'：'+info.phone+')&nbsp;</label>';
						});
						ziti += '</div>';

						$("#address").after(ziti);
					}				
				}

			}
		});
	}

}

function check_ziti(flag) {
	var is_check = flag.checked;
	var ziti_val = flag.value;
	if(is_check) {
		$("[value!="+ziti_val+"]:checkbox").removeAttr("checked");
	}
}

function doProductNew (id , name , price,img) {
	$(".footermenu ul li a").each(function(){
		$(this).attr("class","");
	});
	$('#add_cart').children("a").attr("class","active");
	
	if (!in_array(id,order_list)) {
		order_list[id]= id;
		var cartMenuN = parseFloat($('#cartN2').html())+1;
		$('#totalNum').html( cartMenuN );
		$('#cartN2').html( cartMenuN );
		$('#cartN3').html( cartMenuN );

		var totalPrice = parseFloat($('#totalPrice').html())+ parseFloat(good_price);
		$('#totalPrice').html( totalPrice.toFixed(2) );

		var wemallId = 'wemall_'+id;
		var html= '<li class="ccbg2" id="'+wemallId+'"><div class="orderdish">';
		html+='<span class="idss" style="display:none;">'+id+'</span>';
		html+='<span name="title">'+name+'</span><span class="price" id="v_0" style="display:none;">'+price+'</span>';
		html+='<span style="display:none; class="price">元</span></div><div class="orderchange">';
		html+='<a href=javascript:addProductN("'+wemallId+'_'+price+'") class="increase">';
		html+='<b class="ico_increase">加一份</b></a><span class="count" id="num_1_499">1</span>';
		html+='<a href=javascript:reduceProductN("'+wemallId+'_'+price+'") class="reduce">';
		html+='<b class="ico_reduce">减一份</b></a></div></li>';
		$('#ullist').append(html);
		$('#good_pic').attr('src',img);
		
		check_shengyu();
	}
	return false;
}

function showMenu(){
	$("#menu").find("ul").toggle();
}
function toggleBar(){
	$(".footermenu ul li a").each(function(){
		$(this).attr("class","");
	});
	$(this).children("a").attr("class","active");
}
function showProducts(id) {
	$('#menu_id li').each(function(){
		if( $(this).attr("menu") == id ){
			$(this).show();
		}else{
			$(this).hide();
		}
	});
	$('#menu ul').hide();
}
function showAll() {
	$('#menu_id li').each(function(){
		$(this).show();
	});
	$('#menu ul').hide();
}

// 倒计时
function edit_time(){
	$('.cancel_time').each(function(n,e){
		var obj=$(e);
		var num=obj.data('time');
		if(num>0){
			clock(obj,num);
			var k=setInterval(function(){
				clock(obj,num,k);
				num--;
			},1000);	
		}
	});
}
function clock(obj,num,k){
	if(num>=0){
		var m=Math.floor(num/60);
		var s=num%60;
		obj.find('.m').text(reg(m));
		obj.find('.s').text(reg(s));
	}else{
		clearInterval(k);
	}
}	
function reg(num){
	return num<10?'0'+num:num;
}
