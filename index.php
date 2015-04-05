<?php header( 'Content-Type: text/html; charset=utf-8'); ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Cool Case Constructor</title>
    <link rel="stylesheet" href="css/bootstrap.css">
    <link rel="stylesheet" href="css/font-awesome.min.css">
    <link rel="stylesheet" href="css/style.css">
</head>

<body>

    <header class="header">
        <div class="container">
            <h1 class="site-title">Cool Case Constructor</h1>
        </div>
    </header>

    <section class="block-content case-make">
        <div class="container fw">
            <div class="row">
                <div class="col-xs-4 col-sm-4">
                    <div class="buttons">
                        <a href="#phone-models" data-toggle="collapse" class=" left-button model-title spoiler-effects collapsed">Модель</a>
                        <div class="collapse" id="phone-models">
                            <div model="iphone4" class="i4 phone-model"><span class="model-title">iPhone 4/4s</span>
                            </div>
                            <div model="iphone5" class="i5 phone-model"><span class="model-title">iPhone 5/5s</span>
                            </div>
                            <div model="iphone5c" class="i5c phone-model"><span class="model-title">iPhone 5c</span>
                            </div>
                            <div model="iphone6" class="i6 phone-model"><span class="model-title">iPhone 6/6+</span>
                            </div>
                            <div model="samsungs3" class="s3 phone-model"><span class="model-title">Galaxy S3</span>
                            </div>
                            <div model="samsungs4" class="s4 phone-model"><span class="model-title">Galaxy S4</span>
                            </div>
                            <div model="samsungs5" class="s5 phone-model"><span class="model-title">Galaxy S5</span>
                            </div>
                        </div>

                        <div class="left-button">
                            <span class="model-title">Принт / лого</span>
                            <input id="files" type="file">
                        </div>

                        <a href="#spoiler-effects" data-toggle="collapse" class="left-button spoiler-effects collapsed model-title">Эффекты</a>
                        <div class="collapse" id="spoiler-effects">
                            <div class="effects">
                                <div class="effect" effects="black_wh">черно-белое</div>
                                <div class="effect" effects="grayscale">оттенки серого</div>
                                <div class="effect" effects="falx">серпия</div>
                                <div class="effect" effects="negativ">негатив</div>
                                <div class="effect" effects="rezkost">резкость</div>
                                <div class="effect" effects="razmitie">размытие</div>
                                <div class="effect" effects="resize_pl"><i class="fa fa-plus"></i>
                                </div>
                                <div class="effect" effects="resize_min"><i class="fa fa-minus"></i>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                        <div class="left-button">
                            <div class="form-group_maket_name">
                                <label for="maket_name">Название макета</label>
                                <input type="text" class="form-control maket_name" id="maket_name" value="maket" placeholder="Введите имя сохраняемого макета" ac="maket_name">
                            </div>
                        </div>
                        <div class="left-button" onclick="saveBtn()">
                            <span class="model-title">Сохранить макет</span>
                        </div>
                        
                        

                        <div class="left-button" onclick="showPreviu(event)"><span shows="show" class="model-title">Сохранить принт</span>
                        </div>

                        <div class="left-button" data-toggle="modal" data-target="#order"><span class="model-title">Заказать</span>
                        </div>

                    </div>
                </div>

                <div class="col-xs-4 col-sm-4">
                    <div class="preview-block">
                        <canvas class="phone-tmplt" id="test"></canvas>
                    </div>
                </div>
                <div class="col-xs-4 col-sm-4">
                    <div class="background buttons pull-right" id="back">
                        <i class="move_general move-btn fa fa-arrow-up fa-2x" move_action="top"></i>
                        <i class="move_general move-btn fa fa-arrow-down fa-2x" move_action="bottom"></i>
                        <i class="move_general move-btn fa fa-arrow-left fa-2x" move_action="left"></i>
                        <i class="move_general move-btn fa fa-arrow-right fa-2x" move_action="right"></i>
                        <div style="display:inline;" class="resizeAct">
                            <i class="move_general move-btn fa fa-plus fa-2x" effects="resize_pl"></i>
                            <i class="move_general move-btn fa fa-minus fa-2x" effects="resize_min"></i>
                        </div>
                        <div style="display:inline;" class="reflectionAct">
                                <i class="move_general move-btn fa fa-arrows-h fa-2x" reflection="reflection-h"></i>
                                <i class="move_general move-btn fa fa-arrows-v fa-2x" reflection="reflection-v"></i>
                        </div>
                        <i class="move_general move-btn fa fa-rotate-left fa-2x" move_action="rotate-left"></i>
                        <i class="move_general move-btn fa fa-rotate-right fa-2x" move_action="rotate-right"></i>
                        <div style="display:inline;" class="showAct">
                                <i class="background-close move_general move-btn fa fa-eye fa-2x" shows="show"></i>
                        </div>
                        <div style="display:inline;" class="clearState">
                                <i class="background-close move_general move-btn fa fa-close fa-2x" c_action="clear"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="order" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title">Заказ чехла</h4>
                    </div>
                    <div class="modal-body">
                        <p>Введите контактные данные</p>
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-fw fa-user"></i></span>
                            <input type="text" class="form-control" placeholder="Имя">
                        </div>
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-fw fa-envelope"></i></span>
                            <input type="text" class="form-control" placeholder="E-Mail">
                        </div>
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-fw fa-phone"></i></span>
                            <input type="text" class="form-control" placeholder="Телефон для связи">
                        </div>
                        <textarea class="form-control" rows="3" placeholder="Комментарий"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>
                        <button type="button" class="btn btn-primary">Сделать заказ</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="gallery">
        <div class="container test_images" id="print_images_list">
        </div>
    </section>
	
	<div class="modal fade" id="save_modal">
	  <div class="modal-dialog">
		<div class="modal-content">
		  <div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			<h4 class="modal-title">Предпросмотр</h4>
		  </div>
		  <div class="modal-body">
			<div class="modal-body_container" style="position:relative;">				
				<div class="crop_container size_crop_control_wr">
					<div style="position:relative;">
						<div class="overlay">
							<!--<div class="overlay-inner"></div>-->
						</div>
						<img />
					</div>
				</div>
			</div>
			<div class="" style="margin-top:30px;">
				<form class=" size_crop_control">
					<div class="size_crop_formcontent">
					  <div class="form-group-cst">
						<label for="width_cm">Ширина (см)</label>
						<input type="text" class="form-control" id="width_cm" placeholder="" ac="width" oninput="resizeTT(this)">
					  </div>
					  <div class="form-group-cst">
						<label for="height_cm">Высота (см)</label>
						<input type="text" class="form-control" id="height_cm" placeholder="" ac="height" oninput="resizeTT(this)">
					  </div>
                                            <div class="form-group">
						<label for="print_name">Название принта</label>
						<input type="text" class="form-control" id="print_name" value="print" placeholder="Введите имя сохраняемого принта" ac="print_name">
					  </div>
					  <button type="button" class="btn btn-default save_btn" onclick="test_cr()">Сохранить</button>
					</div>
				</form>
			</div>
		  </div>
		  <!--<div class="modal-footer">
			<button type="button" class="btn btn-default" data-dismiss="modal" >Close</button>
			<button type="button" class="btn btn-primary">Save changes</button>
		  </div>-->
		</div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
        <div class="preloader">
            <!--<div style="position: absolute;">-->
                <i class="fa fa-refresh fa-spin fa-5x"></i>
            <!--</div>-->
            
        </div>

    <script src="js/jquery-1.11.2.min.js"></script>
    <!--<script src="js/jquery-ui.js"></script>-->
    <script src="js/bootstrap.min.js"></script>
    <script src="js/scripts.js"></script>
</body>

</html>