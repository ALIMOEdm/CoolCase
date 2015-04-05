var compositeTypes = [
  'source-over', 'source-in', 'source-out', 'source-atop',
  'destination-over', 'destination-in', 'destination-out', 'destination-atop',
  'lighter', 'darker', 'copy', 'xor'
];
var _eventHandlers = {};
var path = "images/models/";
var path_back = "images/background/bg_full.png";
var path_back_logo = "images/background/logo2.png";
var prints = [
 'images/textures/1.jpg',
 'images/textures/candy.jpg'
];

var back_image_obj = {
    'back' : null,
    'logo' : null,
    'load' : function(){
        var that = this
        var i1 = new Image();
        i1.src = path_back;
        i1.onload = function(){
            that.back = i1;
        }
        
        var i2 = new Image();
        i2.src = path_back_logo;
        i2.onload = function(){
            that.logo = i2;
        }
    }
};

var template = {
    "tpl_main": "images/models/iPhone5c/iPhone5c.png",
    "tpl_outer": "images/models/iPhone5c/iPhone5ccam.png"
}

var kowff_proporc = 1;

function forEach(arr, action) {
    for (var i = 0, n = arr.length; i < n; i++) {
        action(arr[i]);
    }
}

var ImagesList = function (canvas) {
    this.tpl_main = null; //объект темплейта
    this.isTplMain = false;
    this.tpl_outer = null;
    this.isTplOuter = false;
    this.prints = []; //объект принта
    this.curPrint = -1;
    this.canva = canvas;
    this.tpl_shadow = null;
}


ImagesList.prototype.addImage = function (type, img_ob, action) {
    var that = this;
    switch (type) {
    case 'tpl_main':
        img_ob.load(function () {
            that.tpl_main = img_ob;
            that.tpl_main.src = getBase64Image(that.tpl_main.img);
            that.canva.setWidth(that.tpl_main.width);
            that.canva.setHeight(that.tpl_main.height);
            that.canva.drawImage(that.tpl_main);
            that.tpl_main.crossOrigin = 'Anonymous';
            //that.canva.context.globalCompositeOperation = compositeTypes[3];
            that.canva.setSourceAtopDisplayMode();
            //that.canva.context.globalCompositeOperation = "multiply";
            if (action) {
                action();
            }
        });
        break;
    case 'tpl_shadow':
        img_ob.load(function () {
            that.tpl_shadow = img_ob;
            that.tpl_shadow.src = getBase64Image(that.tpl_shadow.img);
            if (action) {
                action();
            }
        });
        break;
    case 'tpl_outer':
        img_ob.load(function () {
            that.tpl_outer = img_ob;
            //that.canva.context.globalCompositeOperation = compositeTypes[3];
            that.canva.setSourceAtopDisplayMode();
            that.canva.drawImage(that.tpl_outer);
        });
        break;
    case 'print':
        this.curPrint = this.prints.length;
        var action_2 = action;
        img_ob.load(function () {
            that.addNewPrint(img_ob);
            
            var tpl_h = that.getMainTemplateHeight();
            var tpl_w = that.getMainTemplateWidth();
            var ob_h = img_ob.height;
            var ob_w = img_ob.width;
            
            //пробуем центрировать относительно центра
            var curprint = that.getCurrentPrint();
            var res_h = (ob_h - tpl_h) / 2;
            curprint.y_pos = -res_h;
            var res_w = (ob_w - tpl_w) / 2;
            curprint.x_pos = -res_w;
            
            that.canva.drawImage(img_ob);
            //that.canva.context.globalCompositeOperation = compositeTypes[3];
            that.canva.setSourceAtopDisplayMode();
            if (that.tpl_outer) {
                that.canva.drawImage(that.tpl_outer);
            } else {
                var out_tpl = new Template();
                out_tpl.configure(template["tpl_outer"]);
                that.addImage("tpl_outer", out_tpl);
            } 
            if (action_2)
                action_2();
        });
        break;
    }
}

ImagesList.prototype.getCurrentPrint = function () {
	if(!this.curPrint){
		if(this.prints.length){
			this.curPrint = 0;
		}
	}
    return this.prints[this.curPrint];
}
ImagesList.prototype.getPrintByIndex = function (index) {
    return this.prints[index];
}
ImagesList.prototype.addNewPrint = function (img_ob) {
    this.prints.push(img_ob);
}

ImagesList.prototype.getCurPrintPointer = function(){
	return this.curPrint;
}
ImagesList.prototype.setCurPrintPointer = function(pointer){
	this.curPrint = pointer;
}

ImagesList.prototype.setCurPrintPointerDefault = function(pointer){
	this.curPrint = -1;
}

ImagesList.prototype.crearPrints = function(){
	this.prints = [];
}

ImagesList.prototype.crearTplOuter = function(){
	this.tpl_outer = null;
}

ImagesList.prototype.getMainTemplateWidth = function(){
	return this.tpl_main.getWidth();
}

ImagesList.prototype.getMainTemplateHeight = function(){
	return this.tpl_main.getHeight();
}

ImagesList.prototype.hasTemplate = function(){
	if(this.tpl_main)
		return true;
	return false;
}

ImagesList.prototype.getCanvasData = function(){
	return this.canva.canvas.toDataURL("image/png");
}



ImagesList.prototype.removeImages = function(){
	if(this.prints.length){
		for(var i = 0, n = this.prints.length; i < n; i++){
			var src = jQuery("img[img_num="+i+"]");
            jQuery(src).parents(".image_print_list").remove();
		}
	}
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
}

//в чем тут суть
/*
	создаем фиктивный канвас
	устанавливаем на него режим  наложения такой, что при отрисовке поверх бекграунда картинка обрезается
	рисуем основной шаблон
	отрисовываем все остальные изображения
	сохраняем все это дело в новое изображенгие
	заново отрисовываем главный шаблон
	устанавливаем новый режим наложения
	отрисовываем поверх шаблона нашу временную картинку
	результат отрисовываем в канвасе
*/
ImagesList.prototype.refreshImg = function (move_with) {
	if(this.tpl_outer){
            this.refreshImgReal(move_with);
	}
	else{
            var that = this;
            var interval = setInterval(function(){				
                if(that.tpl_outer){
                    that.refreshImgReal(move_with);
                    clearInterval(interval);
                }
            },25);
	}
}
	
ImagesList.prototype.refreshImgReal = function (move_with) {
	var that = this;

        var cnt = 0;
		
	var TO_RADIANS = Math.PI / 180;
        function refreshPrints(cntx) {
            if (cnt < that.prints.length) {
                var pr = that.getPrintByIndex(cnt);
				
                //реализуем поворот вокруг своей оси на угол, индивидуальный для каждого принта
                cntx.save();
                cntx.translate(pr.x_pos, pr.y_pos );
                cntx.translate(pr.width / 2, pr.height / 2 );
                var angle = pr.getRotateUngle();
                cntx.rotate(angle * TO_RADIANS);
                cntx.drawImage(pr.img, -(pr.width / 2), -(pr.height / 2));
                cntx.restore();				
                cnt++;
                refreshPrints(cntx);
            } 
            else {
                if(that.tpl_outer){
                    cntx.drawImage(that.tpl_outer.img, 0, 0);
                    return;
                }
            }
        }
        if (move_with) {
            if(!that.tpl_main)
                    return;			
			
            var canvas = document.createElement("canvas");
            canvas.width = that.tpl_main.width;
            canvas.height = that.tpl_main.height;
            var cntx = canvas.getContext("2d");
			
            cntx.drawImage(that.tpl_main.img, 0, 0);

            that.canva.setSourceAtopDisplayMode();
            cntx.globalCompositeOperation = compositeTypes[3];

            refreshPrints(cntx);

            var tmp = new Image();
            var quality = 0.1;
            tmp.src = canvas.toDataURL("image/png", quality);
            tmp.onload = function () {
                that.canva.context.drawImage(that.tpl_main.img, 0, 0);
                that.canva.context.drawImage(tmp, 0, 0);
		that.canva.setSourceAtopDisplayMode();
                that.canva.drawImage(that.tpl_outer);

                tmp = null;
                delete tmp;
                canvas.width = 1;
                canvas.height = 1;
                canvas = null;
            }
        } else {
            that.canva.drawImage(that.tpl_main);
            that.canva.setSourceAtopDisplayMode();
            refreshPrints(that.canva.context);
        }
}
    //функция удаления принта, удаляем информацию о принте из массива и изменяем атрибуты img_num у остальных притов, которые шли после удаленного
ImagesList.prototype.removePrint = function (printIndex) {
        if (printIndex == this.curPrint) {
            this.curPrint = 0;
        }
        var temp = [];
        var k = 0;
        for (var i = 0, n = this.prints.length; i < n; i++) {
            if (i != printIndex) {
                temp.push(this.prints[i]);
                console.log(i, "[img_num='" + i + "']", printIndex, n);
                document.querySelector("[img_num='" + i + "']").setAttribute("img_num", k);
                if (i == this.curPrint) {
                    this.curPrint = k;
                }
                k++;
            }
        }
        this.prints = temp;
        delete temp;
    }
    //функция копирования принта
ImagesList.prototype.copyPrint = function (printIndex, img_ob) {
    var copy = clone(this.prints[printIndex]);
    copy.x_pos = 0;
    copy.y_pos = 0;
    this.addImage("print", copy);
    this.refreshImg();

}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = new obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}


var Parent = function (src) {

}
Parent.prototype.configure = function (src) {
    this.x_pos = 0;
    this.y_pos = 0;
    this.src = src;
    this.cache_l_1 = src;
    this.zoom_coef = 1;
    this.rotate_ungle = 0;
    this.img = null;
    this.img_cache = null;
    this.img_cache_back = null;
    this.width;
    this.height;
    this.isLoad = false;
    this.isLoadAction = true;
    return this;
}
Parent.prototype.load = function (load_action) {
    this.img = new Image();
    this.img_cache = new Image();
    this.img_cache_back = new Image();
    this.img.src = this.src;
    this.img_cache.src = this.src;
    this.img_cache_back.src = this.src;
    var that = this;
    this.img.onload = function () {
        that.width = that.img.width;
        that.height = that.img.height;
        that.isLoad = true;
        if (that.isLoadAction) {
            load_action();
        }
    }
    return this;
}

Parent.prototype.setRotateUngle = function (newUngle) {
    this.rotate_ungle = newUngle;
    if (this.rotate_ungle > 360) {
        this.rotate_ungle = this.rotate_ungle % 360;
    }
}
Parent.prototype.getRotateUngle = function () {
    return this.rotate_ungle;
}

Parent.prototype.getZoomCoef = function () {
    return this.zoom_coef;
}

Parent.prototype.setZoomCoef = function (coef) {
    this.zoom_coef = coef;
}

Parent.prototype.getWidth = function () {
    return this.img.width;
}

Parent.prototype.getHeight = function () {
    return this.img.height;
}

var Template = function () {}
Template.prototype = new Parent();

var Print = function () {
    this.pos_move_x = 0;
    this.pos_move_y = 0;
}
Print.prototype = new Parent();


var Canva = function (id) {
    this.id = id;
    this.context = null;
    this.canvas = null
}
Canva.prototype.setContext = function () {
    this.canvas = document.getElementById(this.id);
    this.context = this.canvas.getContext("2d");
    return this;
}
Canva.prototype.drawImage = function (img_obj) {
    this.context.drawImage(img_obj.img, img_obj.x_pos, img_obj.y_pos);
}
Canva.prototype.setWidth = function (width) {
    this.canvas.width = width;
}
Canva.prototype.setHeight = function (height) {
    this.canvas.height = height;
}

Canva.prototype.getContext = function(){
	return this.canvas.getContext("2d");
}

Canva.prototype.setSourceAtopDisplayMode = function(){
	this.context.globalCompositeOperation = compositeTypes[3];
}

Canva.prototype.setMultiplyDissplayMode = function(){
	this.context.globalCompositeOperation = "multiply";
}
var canvas = new Canva("test");
canvas.setContext();
var img_list = new ImagesList(canvas);

function initialTemplate() {
    var full_tpl = new Template();
    full_tpl.configure(template["tpl_main"]);
    
    var shadow_tpl = new Template();
    shadow_tpl.configure(template["tpl_shadow"]);
    
    var back_tpl = new Template();
    back_tpl.configure(template["tpl_outer"]);
    img_list.crearTplOuter();
    img_list.addImage('tpl_main', full_tpl, function () {img_list.refreshImg(true);});
    img_list.addImage('tpl_shadow', shadow_tpl, function () {});
    img_list.addImage('tpl_outer', back_tpl, function () {});
    
}

$(document).ready(function () {
    back_image_obj.load();
    document.querySelector("#phone-models").addEventListener("click", function (event) {
        event = event || window.event;
        event = normaliseEvent(event);
        var src = event.target;
        if (src.nodeName.toLowerCase() == "div") {
            var model = src.getAttribute("model");
        } else {
            var model = jQuery(src).parents("div[model]").attr("model");
        }
        template = {
            "tpl_main": path + "" + model + "/" + model + ".png",
            "tpl_outer": path + "" + model + "/" + model + "cam.png",
            "tpl_shadow": path + "" + model + "/" + model + "shadow.png"
        }
        initialTemplate();
    });

    var isMove = false;
    var old_x = 0,
        old_y = 0;

    var isMouseUp = false;

    document.querySelector(".preview-block").addEventListener("click", function (event) {
        event = event || window.event;
        event = normaliseEvent(event);
        var src = event.target;
        var src_name = src.nodeName;
        if (src_name.toLowerCase() == "canvas") {
            jQuery(".background").toggleClass("");
        }
    });

    document.querySelector(".background-close").addEventListener("click", function (event) {
        jQuery(".background").toggleClass("");
    });

    document.querySelector(".background").addEventListener("mousedown", function (event) {
        isMouseUp = false;
        event = event || window.event;
        event = normaliseEvent(event);
		if(event.button && event.button != 0){
			return;
		}
        var src = event.target;
        var move_action = src.getAttribute("move_action");
        var step = 1;
        var k = 1;
        var max_k = 5;
        var max_step = 8;

        function movies(move_with) {
            console.log(move_with, isMouseUp);
            if(move_with){
                    img_list.refreshImg(move_with);
                    return;
            }
            var print = img_list.getCurrentPrint();
            switch (move_action) {
                case "close":
                        break;
                case "top":
                        print.y_pos -= step;
                        break;
                case "bottom":
                        print.y_pos += step;
                        break;
                case "left":
                        print.x_pos -= step
                        break;
                case "right":
                        print.x_pos += step;
                        break;
                case "rotate-right":
                        var TO_RADIANS = Math.PI / 180;
                        angle = print.getRotateUngle() + step;
                        print.setRotateUngle(angle);
                        break;
                case "rotate-left":
                        var TO_RADIANS = Math.PI / 180;
                        angle = print.getRotateUngle() - step;
                        print.setRotateUngle(angle);
                        break;
            }
            img_list.refreshImg(move_with);
        }

        var time_move = setInterval(function () {
            if (isMouseUp) {
                movies(true);
                clearInterval(time_move);
                return;
            }
            k++;
            if (k % max_k == 0) {
                k = 1;
                if (step < max_step) {
                    step += 2;
                }
            }
            movies();
        }, 50);

    });
    document.querySelector(".background").addEventListener("mouseup", function (event) {
		if(event.button && event.button != 0){
			return;
		}
        isMouseUp = true;
    });

    document.querySelector(".test_images").addEventListener("click", function (event) {
        event = event || window.event;
        event = normaliseEvent(event);
        var src = event.target;

        if (src.nodeName.toLowerCase() == 'i') {
            var action = src.getAttribute("action");
            switch (action) {
            case "delete":
                img_index = jQuery(src).parents(".image_print_list").find("img[img_num]").attr("img_num");
                jQuery(src).parents(".image_print_list").remove();
                img_list.removePrint(img_index);
                img_list.refreshImg(true);
                break;
            case "copy":
                var need = jQuery(src).parents(".test_images")[0];
                var need2 = jQuery(src).parents(".image_print_list")[0];
                //найдем индекс копируемого изображения
                img_index = jQuery(need2).find("img[img_num]").attr("img_num");
                //далее надо провести манипуляции с данными
                img_list.copyPrint(img_index);
                //копируем изображение
                jQuery(need).append(jQuery(need2).clone().find("img[img_num]").attr("img_num", img_list.curPrint).parents(".image_print_list"));
                img_list.refreshImg(true);
                //startDrag("print_images_list");
                break;
            }
        } else {
            if (src.nodeName.toLowerCase() == 'a') {
                src = src.querySelector('img[img_num]');
            }
            var current = src.getAttribute("img_num");
            img_list.curPrint = current;
        }
    });
	
	document.querySelector(".clearState").addEventListener("click", function(event){
		event = event || window.event;
        event = normaliseEvent(event);
        var src = event.target;
		if (src.nodeName.toLowerCase() == 'i') {
			var clear = src.getAttribute("c_action");
			if(clear == "clear"){
				if(confirm("Вы действительно хотите сбросить результаты работы?")){
					img_list.removeImages();
					img_list.crearPrints();
					img_list.setCurPrintPointerDefault();
					img_list.refreshImg();
										
				}
			}
		}
	});

    document.getElementById('files').addEventListener('change', handleFileSelect, false);

//    $("#draggable").draggable();

    function handleFileSelect(evt) {
        var files = evt.target.files;
        var f = files[0];
        var reader = new FileReader();
        reader.onload = (function (theFile) {
            return function (e) {
                clearFileInputField("files");
                var print = new Print();
                print.configure(e.target.result);

                if(!img_list.hasTemplate()){
                        return;
                }
                img_list.addImage('print', print);
                setTimeout(function () {
                    var print = img_list.getCurrentPrint();
                    print.pos_move_x = print.img.width / 2;
                    print.pos_move_y = print.img.height / 2;
                    var new_print = '<div class="col-xs-6 col-md-3 image_print_list" draggable="true">';
                    new_print += '<div class="image_print_actions">';
                    new_print += '<div class="image_print_actions-wrapper">';
                    new_print += '<div class="action-btn image_print_actions_delete image_print_actions_act"><i action="delete" class="fa fa-fw fa-times fa-lg"></i></div>';
                    new_print += '<div class="action-btn image_print_actions_copy image_print_actions_act"><i action="copy" class="fa fa-fw fa-files-o fa-lg"></i></div>';
                    //new_print += '<div class="action-btn image_print_actions_move image_print_actions_act"><i class="fa fa-fw fa-arrows fa-lg"></i></div>';
                    new_print += '</div></div>';
                    new_print += '<a href="" onclick="return false;" class="thumbnail">';
                    new_print += '<img img_num=' + img_list.getCurPrintPointer() + ' src="' + e.target.result + '" alt="">';
                    new_print += '</a></div>';
                    jQuery(".test_images").append(new_print);
                    //startDrag("print_images_list");
                    new_print = null;
                    //накладываем загруженное изображение в санвасе виртуальном, затем накладываем его на модельку со специальным режимом наложэения
                    img_list.refreshImg(true);
                    /*var cntx = img_list.canva.canvas.getContext("2d");
                    var tmp = new Image();
                    tmp.src = img_list.canva.canvas.toDataURL("image/png");
                    tmp.onload = function () {
                        img_list.tpl_main.load(function () {
                            img_list.canva.drawImage(img_list.tpl_main);
                            //cntx.globalCompositeOperation = "multiply";
							img_list.canva.setMultiplyDissplayMode();// = "multiply";
                            cntx.drawImage(tmp, 0, 0);
                        });
                    }
					*/
                }, 100);



            }
        })(f);
        //сброасываем наш инпут, что бы люди могли несколько раз подряд выбирать одно и тоже изображение
        resetFormElement(jQuery("#files"));
        reader.readAsDataURL(f);
    }

    function resetFormElement(e) {
        e.wrap('<form>').closest('form').get(0).reset();
        e.unwrap();
    }

    document.querySelector(".resizeAct").addEventListener("click", function (event) {
        event = event || window.event;
        event = normaliseEvent(event);
        var src = event.target;
        var effects = src.getAttribute("effects");
        var cur_print = img_list.getCurrentPrint();
        var cnv2 = document.createElement("canvas");
        var cntx = cnv2.getContext("2d");
        cnv2.setAttribute('width', cur_print.img.width);
        cnv2.setAttribute('height', cur_print.img.height);
        cur_print.crossOrigin = "Anonymous";
        cntx.drawImage(cur_print.img, 0, 0);
        var w_old = cur_print.getWidth();
        var h_old = cur_print.getHeight();
        switch (effects) {
        case "resize_pl":
            var coeff = 0.05;
            ZoomPlusMinus(coeff, cur_print, cnv2, cntx)
            isResize = true;
            break;
        case "resize_min":
            var coeff = -0.05;
            ZoomPlusMinus(coeff, cur_print, cnv2, cntx)
            isResize = true;
            break;
        }
        cur_print.isLoadAction = false;
        cur_print.img.src = cnv2.toDataURL("image/png");
        cur_print.img.onload = function(){
            var w_new = cur_print.getWidth();
            var h_new = cur_print.getHeight();
            
            var w_d = (w_old - w_new) / 2;
            var h_d = (h_old - h_new) / 2;
            
            cur_print.x_pos += w_d;
            cur_print.y_pos += h_d;
            
            img_list.refreshImg(true);
            cur_print.img.onload = function(){};
        }
    });
	
	document.querySelector(".showAct").addEventListener("click", showPreviu);
	
	document.querySelector(".reflectionAct").addEventListener("click", function (event) {
        event = event || window.event;
        event = normaliseEvent(event);
        var src = event.target;
        var effects = src.getAttribute("reflection");
        var cur_print = img_list.getCurrentPrint();

        var img = cur_print.img;
        var img_cache = cur_print.img_cache;

        switch (effects) {
            case "reflection-v": 
                cur_print.img.src = reflectY(img);
                cur_print.img_cache.src = reflectY(img_cache);
                break;
            case "reflection-h": 
                cur_print.img.src = reflectX(img);
                cur_print.img_cache.src = reflectX(img_cache);
                break;
        }
        cur_print.isLoadAction = false;
        img_list.refreshImg(true);
    });

    document.querySelector(".effects").addEventListener("click", function (event) {
        event = event || window.event;
        event = normaliseEvent(event);
        var src = event.target;
        var effects = src.getAttribute("effects");

        var cur_print = img_list.getCurrentPrint();
        var isResize = false;
        var cnv2 = document.createElement("canvas");
        var cntx = cnv2.getContext("2d");
        cnv2.setAttribute('width', cur_print.img.width);
        cnv2.setAttribute('height', cur_print.img.height);
        cur_print.crossOrigin = "Anonymous";
        cntx.drawImage(cur_print.img, 0, 0);
        var imageData = cntx.getImageData(0, 0, cnv2.width, cnv2.height);

        var cnv3 = document.createElement("canvas");
        var cntx_3 = cnv3.getContext("2d");
        cnv3.setAttribute('width', cur_print.img_cache.width);
        cnv3.setAttribute('height', cur_print.img_cache.height);
        cntx.drawImage(cur_print.img_cache, 0, 0);
        var imageData_3 = cntx.getImageData(0, 0, cnv3.width, cnv3.height);

        switch (effects) {
        case "black_wh":
            blackWhiteImage(imageData);
            cntx.putImageData(imageData, 0, 0);

            blackWhiteImage(imageData_3);
            cntx_3.putImageData(imageData_3, 0, 0);
            break;
        case "grayscale":
            grayscale(imageData);
            cntx.putImageData(imageData, 0, 0);

            grayscale(imageData_3);
            cntx_3.putImageData(imageData_3, 0, 0);
            break;
        case "falx":
            falx(imageData);
            cntx.putImageData(imageData, 0, 0);

            falx(imageData_3);
            cntx_3.putImageData(imageData_3, 0, 0);
            break;
        case "negativ":
            negativ(imageData);
            cntx.putImageData(imageData, 0, 0);

            negativ(imageData_3);
            cntx_3.putImageData(imageData_3, 0, 0);
            break;
        case "rezkost":
            rezkost_2(imageData, cur_print.img.width);
            cntx.putImageData(imageData, 0, 0);

            rezkost_2(imageData_3, cur_print.img_cache.width);
            cntx_3.putImageData(imageData_3, 0, 0);
            break;
        case "razmitie":
            razmitie_2(imageData, cur_print.img.width);
            cntx.putImageData(imageData, 0, 0);

            razmitie_2(imageData_3, cur_print.img_cache.width);
            cntx_3.putImageData(imageData_3, 0, 0);
            break;
        }
        cur_print.isLoadAction = false;
        cur_print.img.src = cnv2.toDataURL("image/png");
        cur_print.img.onload = function(){
        cnv2.width = 1;
        cnv2.height = 1;
        cnv3.width = 1;
        cnv3.height = 1;
        img_list.refreshImg(true);
        }
        cur_print.img_cache.src = cnv3.toDataURL("image/png");       
    });


    function ZoomPlusMinus(coeff, cur_print, cnv2, cntx) {
        cur_print.setZoomCoef(cur_print.getZoomCoef() + coeff);
        var coff = cur_print.getZoomCoef();
        cnv2.width = cur_print.img_cache.width * coff;
        cnv2.height = cur_print.img_cache.height * coff;
        cntx.drawImage(cur_print.img_cache, 0, 0, cnv2.width, cnv2.height);
        cur_print.width = cnv2.width;
        cur_print.height = cnv2.height;
    }

    // Almost final example
    var startDrag = function (wraper) {
        var id_ = wraper;
        var cols_ = document.querySelectorAll('#' + id_ + ' .image_print_list');
        var dragSrcEl_ = null;

        function handleDragStart(e) {
            e = e || window.event;
            e = normaliseEvent(e);
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);

            dragSrcEl_ = this;
            this.style.opacity = '0.4';
            this.classList.remove('moving');
        };

        function handleDragOver(e) {
            e = e || window.event;
            e = normaliseEvent(e);
            if (e.preventDefault) {
                e.preventDefault(); // Allows us to drop.
            }

            e.dataTransfer.dropEffect = 'move';
            return false;
        };

        function handleDragEnter(e) {
            this.classList.add('over');
        };

        function handleDragLeave(e) {
            // this/e.target is previous target element.
            this.classList.remove('over');
        };

        function handleDrop(e) {
            e = e || window.event;
            e = normaliseEvent(e);
            // this/e.target is current target element.
            if (e.stopPropagation) {
                e.stopPropagation(); // stops the browser from redirecting.
            }

            // Don't do anything if we're dropping on the same column we're dragging.
            if (dragSrcEl_ != this && dragSrcEl_ != null) {
                //dragSrcEl_.innerHTML = this.innerHTML;
                //this.innerHTML = e.dataTransfer.getData('text/html');
                var img_from = jQuery(dragSrcEl_).find("img[img_num]").attr("src");
                var img_to = jQuery(this).find("img[img_num]").attr("src");

                console.log(dragSrcEl_, this);
                console.log(img_from, img_to)
                jQuery(dragSrcEl_).find("img[img_num]").attr("src", img_to);
                jQuery(this).find("img[img_num]").attr("src", img_from);

                img_from = null;
                img_to = null;

                var index_from = jQuery(dragSrcEl_).find("img[img_num]").attr("img_num");
                var index_to = jQuery(this).find("img[img_num]").attr("img_num");

                var copy_from = clone(img_list.prints[index_from]);
                var copy_to = clone(img_list.prints[index_to]);


                img_list.prints[index_from] = copy_to;
                img_list.prints[index_to] = copy_from;

                img_list.curPrint = index_from;

                img_list.refreshImg();
            }

            return false;
        };

        function handleDragEnd(e) {
            // this/e.target is the source node.
            this.style.opacity = '1';

   [].forEach.call(cols_, function (col) {
                col.classList.remove('over');
                col.classList.remove('moving');
            });
        };

  [].forEach.call(cols_, function (col) {
            col.setAttribute('draggable', 'true'); // Enable columns to be draggable.
            //col.removeEventListener('dragstart', handleDragStart, false)
            removeAllEvents(col, 'dragstart');
            removeAllEvents(col, 'dragenter');
            removeAllEvents(col, 'dragover');
            removeAllEvents(col, 'dragleave');
            removeAllEvents(col, 'drop');
            removeAllEvents(col, 'dragend');

            addEvent(col, 'dragstart', handleDragStart, false);
            addEvent(col, 'dragenter', handleDragEnter, false);
            addEvent(col, 'dragover', handleDragOver, false);
            addEvent(col, 'dragleave', handleDragLeave, false);
            addEvent(col, 'drop', handleDrop, false);
            addEvent(col, 'dragend', handleDragEnd, false);
        });

        function addEvent(node, event, handler, capture) {
            if (!(node in _eventHandlers)) {
                // _eventHandlers stores references to nodes
                _eventHandlers[node] = {};
            }
            if (!(event in _eventHandlers[node])) {
                // each entry contains another entry for each event type
                _eventHandlers[node][event] = [];
            }
            // capture reference
            _eventHandlers[node][event].push([handler, capture]);
            node.addEventListener(event, handler, capture);
        }

        function removeAllEvents(node, event) {
            if (node in _eventHandlers) {
                var handlers = _eventHandlers[node];
                if (event in handlers) {
                    var eventHandlers = handlers[event];
                    for (var i = eventHandlers.length; i--;) {
                        var handler = eventHandlers[i];
                        node.removeEventListener(event, handler[0], handler[1]);
                    }
                }
            }
        }
    }
});

//Нормализация событий
function normaliseEvent(event) {
    if (!event.stopPropagation) {
        event.stopPropagation = function () {
            this.cancelBubble = true;
        };
        event.preventDefault = function () {
            this.returnValue = false;
        };
    }
    if (!event.stop) {
        event.stop = function () {
            this.stopPropagation();
            this.preventDefault();
        };
    }
    if (event.srcElement && !event.target)
        event.target = event.srcElement;
    if ((event.toElement || event.fromElement) && !event.relatedTarget)
        event.relatedTarget = event.toElement || event.fromElement;
    if (event.clientX != undefined && event.pageX == undefined) {
        event.pageX = event.clientX + document.body.scrollLeft;
        event.pageY = event.clientY + document.body.scrollTop;
    }
    if (event.type == "keypress") {
        if (event.charCode === 0 || event.charCode == undefined)
            event.character = String.fromCharCode(event.keyCode);
        else
            event.character = String.fromCharCode(event.charCode);
    }
    return event;
}

function blackWhiteImage(imgd) {
    for (var i = 0; i < imgd.data.length; i += 4) {
        var y = imgd.data[i] * 0.3 + imgd.data[i + 1] * 0.59 + imgd.data[i + 2] * 0.11;
        if (y > 125) {
            imgd.data[i] = 250;
            imgd.data[i + 1] = 250;
            imgd.data[i + 2] = 250;
        } else {
            imgd.data[i] = 0;
            imgd.data[i + 1] = 0;
            imgd.data[i + 2] = 0;
        }
    }
    return imgd;
}

function grayscale(imgd) {
    for (var i = 0; i < imgd.data.length; i += 4) {
        var y = imgd.data[i] * 0.3 + imgd.data[i + 1] * 0.59 + imgd.data[i + 2] * 0.11;
        imgd.data[i] = y;
        imgd.data[i + 1] = y;
        imgd.data[i + 2] = y;
    }
    return imgd;
}

//серпия
function falx(imgd) {
    for (var i = 0; i < imgd.data.length; i += 4) {
        var y = imgd.data[i] * 0.3 + imgd.data[i + 1] * 0.59 + imgd.data[i + 2] * 0.11;
        imgd.data[i] = y + 100;
        imgd.data[i + 1] = y + 50;
        imgd.data[i + 2] = y;
    }
    return imgd;
}

function negativ(imgd) {
    for (var i = 0; i < imgd.data.length; i += 4) {
        imgd.data[i] = 255 - imgd.data[i];
        imgd.data[i + 1] = 255 - imgd.data[i + 1];
        imgd.data[i + 2] = 255 - imgd.data[i + 2];
    }
    return imgd;
}

function rezkost_2(imgd, width) {
    var st = 4;
    width = width * 4;
    var koef = 2;
    for (var i = 0; i < imgd.data.length; i += 4) {
        var top_p_r = imgd.data[i - width] ? imgd.data[i - width] : imgd.data[i];
        var top_p_g = imgd.data[i + 1 - width] ? imgd.data[i + 1 - width] : imgd.data[i + 1];
        var top_p_b = imgd.data[i + 2 - width] ? imgd.data[i + 2 - width] : imgd.data[i + 2];
        var top_p_a = imgd.data[i + 3 - width] ? imgd.data[i + 3 - width] : imgd.data[i + 3];

        var top_left_p_r = imgd.data[i - width - st] ? imgd.data[i - width - st] : imgd.data[i];
        var top_left_p_g = imgd.data[i + 1 - width - st] ? imgd.data[i + 1 - width - st] : imgd.data[i + 1];
        var top_left_p_b = imgd.data[i + 2 - width - st] ? imgd.data[i + 2 - width - st] : imgd.data[i + 2];
        var top_left_p_a = imgd.data[i + 3 - width - st] ? imgd.data[i + 3 - width - st] : imgd.data[i + 3];

        var top_right_p_r = imgd.data[i - width + st] ? imgd.data[i - width + st] : imgd.data[i];
        var top_right_p_g = imgd.data[i + 1 - width + st] ? imgd.data[i + 1 - width + st] : imgd.data[i + 1];
        var top_right_p_b = imgd.data[i + 2 - width + st] ? imgd.data[i + 2 - width + st] : imgd.data[i + 2];
        var top_right_p_a = imgd.data[i + 3 - width + st] ? imgd.data[i + 3 - width + st] : imgd.data[i + 3];

        var bottom_p_r = imgd.data[i + width] ? imgd.data[i + width] : imgd.data[i];
        var bottom_p_g = imgd.data[i + 1 + width] ? imgd.data[i + 1 + width] : imgd.data[i + 1];
        var bottom_p_b = imgd.data[i + 2 + width] ? imgd.data[i + 2 + width] : imgd.data[i + 2];
        var bottom_p_a = imgd.data[i + 3 + width] ? imgd.data[i + 3 + width] : imgd.data[i + 3];

        var bottom_left_p_r = imgd.data[i + width - st] ? imgd.data[i + width - st] : imgd.data[i];
        var bottom_left_p_g = imgd.data[i + 1 + width - st] ? imgd.data[i + 1 + width - st] : imgd.data[i + 1];
        var bottom_left_p_b = imgd.data[i + 2 + width - st] ? imgd.data[i + 2 + width - st] : imgd.data[i + 2];
        var bottom_left_p_a = imgd.data[i + 3 + width - st] ? imgd.data[i + 3 + width - st] : imgd.data[i + 3];

        var bottom_right_p_r = imgd.data[i + width + st] ? imgd.data[i + width + st] : imgd.data[i];
        var bottom_right_p_g = imgd.data[i + 1 + width + st] ? imgd.data[i + 1 + width + st] : imgd.data[i + 1];
        var bottom_right_p_b = imgd.data[i + 2 + width + st] ? imgd.data[i + 2 + width + st] : imgd.data[i + 2];
        var bottom_right_p_a = imgd.data[i + 3 + width + st] ? imgd.data[i + 3 + width + st] : imgd.data[i + 3];

        var right_p_r = imgd.data[i + st] ? imgd.data[i + st] : imgd.data[i];
        var right_p_g = imgd.data[i + 1 + st] ? imgd.data[i + 1 + st] : imgd.data[i + 1];
        var right_p_b = imgd.data[i + 2 + st] ? imgd.data[i + 2 + st] : imgd.data[i + 2];
        var right_p_a = imgd.data[i + 3 + st] ? imgd.data[i + 3 + st] : imgd.data[i + 3];

        var left_p_r = imgd.data[i - st] ? imgd.data[i - st] : imgd.data[i];
        var left_p_g = imgd.data[i + 1 - st] ? imgd.data[i + 1 - st] : imgd.data[i + 1];
        var left_p_b = imgd.data[i + 2 - st] ? imgd.data[i + 2 - st] : imgd.data[i + 2];
        var left_p_a = imgd.data[i + 3 - st] ? imgd.data[i + 3 - st] : imgd.data[i + 3];

        var window_r = [
      [top_left_p_r, top_p_r, top_right_p_r],
      [left_p_r, imgd.data[i], right_p_r],
      [bottom_left_p_r, bottom_p_r, bottom_right_p_r]
     ]
        var window_g = [
      [top_left_p_g, top_p_g, top_right_p_g],
      [left_p_g, imgd.data[i + 1], right_p_g],
      [bottom_left_p_g, bottom_p_g, bottom_right_p_g]
     ]
        var window_b = [
      [top_left_p_b, top_p_b, top_right_p_b],
      [left_p_b, imgd.data[i + 2], right_p_b],
      [bottom_left_p_b, bottom_p_b, bottom_right_p_b]
     ]

        var matr = [
      [-koef / 8, -koef / 8, -koef / 8],
      [-koef / 8, koef + 1, -koef / 8],
      [-koef / 8, -koef / 8, -koef / 8]
     ];

        var sum = 0;
        for (var j1 = 0; j1 < 3; j1++) {
            for (var j2 = 0; j2 < 3; j2++) {
                sum += window_r[j1][j2] * matr[j1][j2];
            }
        }
        imgd.data[i] = sum;

        var sum = 0;
        for (var j1 = 0; j1 < 3; j1++) {
            for (var j2 = 0; j2 < 3; j2++) {
                sum += window_g[j1][j2] * matr[j1][j2];
            }
        }
        imgd.data[i + 1] = sum;

        var sum = 0;
        for (var j1 = 0; j1 < 3; j1++) {
            for (var j2 = 0; j2 < 3; j2++) {
                sum += window_b[j1][j2] * matr[j1][j2];
            }
        }
        imgd.data[i + 2] = sum;
    }
    return imgd;
}

function razmitie_2(imgd, width) {
    var st = 4;
    width = width * 4;
    for (var i = 0; i < imgd.data.length; i += 4) {
        var top_p_r = imgd.data[i - width] ? imgd.data[i - width] : imgd.data[i];
        var top_p_g = imgd.data[i + 1 - width] ? imgd.data[i + 1 - width] : imgd.data[i + 1];
        var top_p_b = imgd.data[i + 2 - width] ? imgd.data[i + 2 - width] : imgd.data[i + 2];
        var top_p_a = imgd.data[i + 3 - width] ? imgd.data[i + 3 - width] : imgd.data[i + 3];

        var top_left_p_r = imgd.data[i - width - st] ? imgd.data[i - width - st] : imgd.data[i];
        var top_left_p_g = imgd.data[i + 1 - width - st] ? imgd.data[i + 1 - width - st] : imgd.data[i + 1];
        var top_left_p_b = imgd.data[i + 2 - width - st] ? imgd.data[i + 2 - width - st] : imgd.data[i + 2];
        var top_left_p_a = imgd.data[i + 3 - width - st] ? imgd.data[i + 3 - width - st] : imgd.data[i + 3];

        var top_right_p_r = imgd.data[i - width + st] ? imgd.data[i - width + st] : imgd.data[i];
        var top_right_p_g = imgd.data[i + 1 - width + st] ? imgd.data[i + 1 - width + st] : imgd.data[i + 1];
        var top_right_p_b = imgd.data[i + 2 - width + st] ? imgd.data[i + 2 - width + st] : imgd.data[i + 2];
        var top_right_p_a = imgd.data[i + 3 - width + st] ? imgd.data[i + 3 - width + st] : imgd.data[i + 3];

        var bottom_p_r = imgd.data[i + width] ? imgd.data[i + width] : imgd.data[i];
        var bottom_p_g = imgd.data[i + 1 + width] ? imgd.data[i + 1 + width] : imgd.data[i + 1];
        var bottom_p_b = imgd.data[i + 2 + width] ? imgd.data[i + 2 + width] : imgd.data[i + 2];
        var bottom_p_a = imgd.data[i + 3 + width] ? imgd.data[i + 3 + width] : imgd.data[i + 3];

        var bottom_left_p_r = imgd.data[i + width - st] ? imgd.data[i + width - st] : imgd.data[i];
        var bottom_left_p_g = imgd.data[i + 1 + width - st] ? imgd.data[i + 1 + width - st] : imgd.data[i + 1];
        var bottom_left_p_b = imgd.data[i + 2 + width - st] ? imgd.data[i + 2 + width - st] : imgd.data[i + 2];
        var bottom_left_p_a = imgd.data[i + 3 + width - st] ? imgd.data[i + 3 + width - st] : imgd.data[i + 3];

        var bottom_right_p_r = imgd.data[i + width + st] ? imgd.data[i + width + st] : imgd.data[i];
        var bottom_right_p_g = imgd.data[i + 1 + width + st] ? imgd.data[i + 1 + width + st] : imgd.data[i + 1];
        var bottom_right_p_b = imgd.data[i + 2 + width + st] ? imgd.data[i + 2 + width + st] : imgd.data[i + 2];
        var bottom_right_p_a = imgd.data[i + 3 + width + st] ? imgd.data[i + 3 + width + st] : imgd.data[i + 3];

        var right_p_r = imgd.data[i + st] ? imgd.data[i + st] : imgd.data[i];
        var right_p_g = imgd.data[i + 1 + st] ? imgd.data[i + 1 + st] : imgd.data[i + 1];
        var right_p_b = imgd.data[i + 2 + st] ? imgd.data[i + 2 + st] : imgd.data[i + 2];
        var right_p_a = imgd.data[i + 3 + st] ? imgd.data[i + 3 + st] : imgd.data[i + 3];

        var left_p_r = imgd.data[i - st] ? imgd.data[i - st] : imgd.data[i];
        var left_p_g = imgd.data[i + 1 - st] ? imgd.data[i + 1 - st] : imgd.data[i + 1];
        var left_p_b = imgd.data[i + 2 - st] ? imgd.data[i + 2 - st] : imgd.data[i + 2];
        var left_p_a = imgd.data[i + 3 - st] ? imgd.data[i + 3 - st] : imgd.data[i + 3];

        var window_r = [
      [top_left_p_r, top_p_r, top_right_p_r],
      [left_p_r, imgd.data[i], right_p_r],
      [bottom_left_p_r, bottom_p_r, bottom_right_p_r]
     ]
        var window_g = [
      [top_left_p_g, top_p_g, top_right_p_g],
      [left_p_g, imgd.data[i + 1], right_p_g],
      [bottom_left_p_g, bottom_p_g, bottom_right_p_g]
     ]
        var window_b = [
      [top_left_p_b, top_p_b, top_right_p_b],
      [left_p_b, imgd.data[i + 2], right_p_b],
      [bottom_left_p_b, bottom_p_b, bottom_right_p_b]
     ]

        var matr = [
      [0.1, 0.1, 0.1],
      [0.1, 0.2, 0.1],
      [0.1, 0.1, 0.1]
     ];
        var sum = 0;
        for (var j1 = 0; j1 < 3; j1++) {
            for (var j2 = 0; j2 < 3; j2++) {
                sum += window_r[j1][j2] * matr[j1][j2];
            }
        }
        imgd.data[i] = sum;

        var sum = 0;
        for (var j1 = 0; j1 < 3; j1++) {
            for (var j2 = 0; j2 < 3; j2++) {
                sum += window_g[j1][j2] * matr[j1][j2];
            }
        }
        imgd.data[i + 1] = sum;

        var sum = 0;
        for (var j1 = 0; j1 < 3; j1++) {
            for (var j2 = 0; j2 < 3; j2++) {
                sum += window_b[j1][j2] * matr[j1][j2];
            }
        }
        imgd.data[i + 2] = sum;
    }
    return imgd;
}

function resize_1(imgd, width, height, dx, dy) {
    var data_2 = [];

    width = width * 2;
    height = height * 2;

    var height_1 = Math.ceil(height * dy);
    var width_1 = Math.ceil(width * dx);

    //ceil = round
    //floor = trunk
    for (var y = 0; y < height_1; y++) {
        for (var x = 0; x < width_1; x += 4) {
            var xo = Math.floor(x / dx);
            var yo = Math.floor(y / dy);
            var x1 = Math.ceil(xo * dx);
            var y1 = Math.ceil(yo * dy);

            var c = {};
            var a_1 = [imgd.data[(xo + 0) + width * (yo + 0)], imgd.data[(xo + 0 + 1) + width * (yo + 0)], imgd.data[(xo + 0 + 2) + width * (yo + 0)], imgd.data[(xo + 0 + 3) + width * (yo + 0)]];

            var a_2 = [imgd.data[(xo + 1) + width * (yo + 0)], imgd.data[(xo + 1 + 1) + width * (yo + 0)], imgd.data[(xo + 1 + 2) + width * (yo + 0)], imgd.data[(xo + 1 + 3) + width * (yo + 0)]];

            var a_3 = [imgd.data[(xo + 0) + width * (yo + 1)], imgd.data[(xo + 0 + 1) + width * (yo + 1)], imgd.data[(xo + 0 + 2) + width * (yo + 1)], imgd.data[(xo + 0 + 3) + width * (yo + 1)]];

            var a_4 = [imgd.data[(xo + 1) + width * (yo + 1)], imgd.data[(xo + 1 + 1) + width * (yo + 1)], imgd.data[(xo + 1 + 2) + width * (yo + 1)], imgd.data[(xo + 1 + 3) + width * (yo + 1)]];
            var b_1 = [a_1, a_2];
            var b_2 = [a_3, a_4];
            c = [b_1, b_2];
            var res = [];
            for (var col = 0; col <= 2; col++) {
                var k1 = (c[1][0][col] - c[0][0][col]) / dx;
                var z1 = x * k1 + c[0][0][col] - x1 * k1;
                var k2 = (c[1][1][col] - c[0][1][col]) / dx;
                var z2 = x * k2 + c[0][1][col] - x1 * k2;
                var k = (z2 - z1) / dy;
                res[col] = Math.ceil(y * k + z1 - y1 * k);
            }
            var op = (c[1][0][3] + c[0][0][3] + c[1][1][3] + c[0][1][3]) / 4;
            data_2[x + 0 + width_1 * y] = res[0];
            data_2[x + 1 + width_1 * y] = res[1];
            data_2[x + 2 + width_1 * y] = res[2];
            data_2[x + 3 + width_1 * y] = op;
        }
    }
    imgd.data = data_2;
    imgd.width = width_1 / 2;
    imgd.height = height_1 / 2;
    imgd["height"] = 0;
    tess.call(imgd);
    return imgd;
}

function reflectY(img){
	var cnv2 = document.createElement("canvas");
	var cntx = cnv2.getContext("2d");
	cnv2.setAttribute('width',img.width);
	cnv2.setAttribute('height', img.height);
	reflectionHeight = img.height;
	
	cntx.save();
	cntx.translate(0, img.height-1);
	cntx.scale(1, -1);
	cntx.drawImage(img, 0, 0, img.width, img.height);
	cntx.restore();
	cntx.fill();
	return cnv2.toDataURL("image/png");
	//cntx.drawImage(img, 0, 0);
	//var imageData = cntx.getImageData(0, 0, cnv2.width, cnv2.height);
}
function reflectX(img){
	var cnv2 = document.createElement("canvas");
	var cntx = cnv2.getContext("2d");
	cnv2.setAttribute('width',img.width);
	cnv2.setAttribute('height', img.height);
	reflectionHeight = img.height;
	
	cntx.save();
	cntx.translate(img.width-1, 0);
	cntx.scale(-1, 1);
	cntx.drawImage(img, 0, 0, img.width, img.height);
	cntx.restore();
	cntx.fill();
	return cnv2.toDataURL("image/png");
}

function tess() {
    this.height = 0;
}

function clearFileInputField(Id) {
    document.getElementById(Id).innerHTML = document.getElementById(Id).innerHTML;
}

function showPreviu(event){
    event = event || window.event;
    event = normaliseEvent(event);
    var src = event.target;
    var effects = src.getAttribute("shows");
//    var cur_print = img_list.getCurrentPrint();
    var cnv2 = document.createElement("canvas");
    var cntx = cnv2.getContext("2d");

    var prints = img_list.prints;
    var cnt = prints.length;
    var max_width = img_list.canva.canvas.width;
    var max_height = img_list.canva.canvas.height;
    for(var i = 0; i < cnt; i++ ){
        if(prints[i].img.height > max_height){
               max_height = prints[i].img.height;
        }
        if(prints[i].img.width > max_width){
               max_width = prints[i].img.width;
        }
    }

    cnv2.setAttribute('width', max_width);
    cnv2.setAttribute('height', max_height);

    //cntx.drawImage(cur_print.img, 0, 0);
    switch (effects) {
        case "show": 
            var prints = img_list.prints;
            var cnt = prints.length;
            var TO_RADIANS = Math.PI / 180;
            for(var i = 0; i < cnt; i++ ){

                cntx.save();
                cntx.translate(prints[i].x_pos, prints[i].y_pos );
                cntx.translate(prints[i].width / 2, prints[i].height / 2 );
                var angle = prints[i].getRotateUngle();
                cntx.rotate(angle * TO_RADIANS);
                cntx.drawImage(prints[i].img, -(prints[i].width / 2), -(prints[i].height / 2));
                cntx.restore();
            }				
            document.querySelector(".crop_container img").src = cnv2.toDataURL("image/png");
            document.querySelector(".crop_container img").width = cnv2.width;
            document.querySelector(".crop_container img").height = cnv2.height;

            jQuery("#save_modal").modal("show");
            $('#save_modal').on('shown.bs.modal', function (e) {
                document.querySelector(".size_crop_control_wr").style.width = cnv2.width + "px";
                document.querySelector(".size_crop_control_wr").style.margin = "0 auto";
                var overlay = document.querySelector(".overlay");
//                var img_width = document.querySelector(".crop_container img").width;
//                var img_height = document.querySelector(".crop_container img").height;
                
                var w_1 = img_list.getMainTemplateWidth();//img_list.tpl_main.img.width;
                var h_1 = img_list.getMainTemplateHeight();//img_list.tpl_main.img.height;
                
                var top = (h_1 - overlay.clientHeight) / 2;
//                var top = (img_height - overlay.clientHeight) / 2;
//                var top = h_1 / 2;
//                var left = w_1 / 2;
                var left = (w_1 - overlay.clientWidth) / 2;
//                var left = (img_width - overlay.clientWidth) / 2;
                document.querySelector(".overlay").style.top = top + "px";
                document.querySelector(".overlay").style.left = left + "px";

                document.querySelector(".overlay").style.width = "1cm";
                document.querySelector(".overlay").style.height = "1cm";

                document.querySelector("#width_cm").value = "1";
                document.querySelector("#height_cm").value = "1";
            });
            break;
    }
}

function test_cr(){
	var img = new Image();
	img.src = document.querySelector(".crop_container img").src;
	img.onload = function(){
		crop(img);
	}
	
}
//обрезка изображения
function crop(image_target){
	var crop_canvas,
            left = $('.overlay').offset().left - $(".crop_container img").offset().left,
            top =  $('.overlay').offset().top - $(".crop_container img").offset().top,
            width = $('.overlay').width(),
            height = $('.overlay').height();
		
	crop_canvas = document.createElement('canvas');
	crop_canvas.width = width;
	crop_canvas.height = height;

	console.log(left, top, width, height, 0, 0, width, height);
	crop_canvas.getContext('2d').drawImage(image_target, left, top, width, height, 0, 0, width, height);
        var print_name = jQuery("#print_name").val();
	saveImage(crop_canvas.toDataURL("image/png"), print_name);
	
}

function resizeTT(el){
	var val = parseFloat(el.value);
	var type = el.getAttribute("ac");
	if(!isNaN(val)){
		if(type == "width"){
			document.querySelector(".overlay").style.width = val + "cm";
		}
		else{
			document.querySelector(".overlay").style.height = val + "cm";
		}
		var overlay = document.querySelector(".overlay");
//		var img_width = document.querySelector(".crop_container img").width;
//		var img_height = document.querySelector(".crop_container img").height;
                
                var w_1 = img_list.getMainTemplateWidth();//img_list.tpl_main.img.width;
                var h_1 = img_list.getMainTemplateHeight();//img_list.tpl_main.img.height;
                
                var top = (h_1 - overlay.clientHeight) / 2;
                var left = (w_1 - overlay.clientWidth) / 2;
                
//		var top = (img_height - overlay.clientHeight) / 2;
//		var left = (img_width - overlay.clientWidth) / 2;
		document.querySelector(".overlay").style.top = top + "px";
		document.querySelector(".overlay").style.left = left + "px";
	}
}

function saveBtn(){
    actionPreloader(true);
    var width = img_list.canva.canvas.width;
    var height = img_list.canva.canvas.height;
    var cnv2 = document.createElement("canvas");
    var cntx = cnv2.getContext("2d");

    var im = back_image_obj.back;

    var im_logo = back_image_obj.logo;
    var koef_1 = 4;
    var koef_width = im_logo.width;
    var koef_height = im_logo.height / koef_1;

    cnv2.width = width + 2 * koef_width;
    cnv2.height = height + 2 * koef_height;                

    cntx.drawImage(im, 0, 0, cnv2.width, cnv2.height);
    var pos_logo_x = 0 + 5;
    var pos_logo_y = cnv2.height - koef_1 * koef_height - 2;
    var im2 = new Image();
    im2.src = img_list.getCanvasData();
    im2.onload = function(){
        if(img_list.tpl_shadow && img_list.tpl_shadow.img){
            cntx.drawImage(img_list.tpl_shadow.img, koef_width, koef_height);
        }
        var print_name = jQuery("#maket_name").val();
        cntx.drawImage(im2, koef_width, koef_height);
        saveImage(cnv2.toDataURL("image/png"), print_name);

    }
}

function saveImage(src, print_name){
    if(!print_name){
        print_name = "print";
    }
    jQuery.ajax({
        type: "post",
        url: "save_image.php",
        data: "print_name="+print_name+"&src="+src,
        success: function(data){
            window.open(location.pathname + "save_image.php?path="+data);
            actionPreloader(false);
        },
        error: function(){
            actionPreloader(false);
        }
    });
}

function actionPreloader(isShow){
    if(isShow){
        jQuery(".preloader").show();
        var position_top = jQuery(".preloader").height() / 2 - jQuery(".preloader i").height() / 2;
        jQuery(".preloader i").css("top", position_top+"px");
    }else{
        jQuery(".preloader").hide();
    }
}