function scrollshow(){
    console.log($(".stable").height());
    if($(".stable").height()>=500){
        $(".stable").css({"overflow-x":"hidden","overflow-y":"auto","height":"500px"});
    }
}
$(document).ready(function() {

   var showall=$("<div></div>");
   showall.appendTo("body");
   //div隐藏
   $(".classContent").hide();
   //生成xml文件按钮隐藏
   $("#creatXml").css({"display":"none"});
	//package交互导航
	//function show case start
	function showcase(obj,group){
        $.ajax({
        	url: "../caseplatform/class",
        	dataType:"text",
        	data: $.param({
        		"projectPath": obj.attr("pp"),
        		"packageName": obj.attr("title"),
        		"projectName": obj.attr("pn"),
        		"projectAtfVersion": projectAtfVersion,
        		"groupName": group,
        		"userName": username
        	}),
        	type: "post",
        	timeout: 3000,
        	success: function(msg) {
        		$(".classContent").html(msg).show();
        		//group click start
        		$(".classContent").find(".smokeNavi").find("ul").find("li").each(function(index,element){
        		    $(this).on("click",function(){
        		        console.log($(this).attr("title"));
        		        if($(this).attr("title")=="all"){
                           showcase(_this,"");
                        }else if($(this).attr("title")=="group"){
                           showcase(_this,"smokeTesting");
                        }
        		    });
        		});
        		//end
        		//table显色
        		$("#Table tr td").css({
        			"border": "4px solid #CCC",
        			"border-width": "4px",
        			"border-collapse": "collapse",
        			"padding": "0"
        		});
        		$("#Table").css({
        			"border": "4px solid #CCC",
        			"border-width": "4px",
        			"border-collapse": "collapse",
        			"padding": "0"
        		});
        		$("#Table").find("td").each(function() {
        			$(this).children("p").last().css({
        				"border-bottom": "none"
        			});
        		});
        		change();
        		//显示execel表格中的用例 start
        		$(".classContent").find("tr").children("td").children("p").each(function() {
        			//show all case name start
        			$(this).children("em,span").on("click",
        			function() {
        				//show all casename div start
        				showall.html("");
        				showall.text("");
        				var delem = $("<span></span>");
        				var delbtn = $("<em>X</em>");
        				var showcontent = $("<div></div>");
        				showcontent.html(contentDiv.html());
        				delem.append(delbtn);
        				showall.append(delem);
        				showall.append(showcontent);
        				delem.css({
        					"display": "block",
        					"width": "30px",
        					"height": "30px",
        					"border-radius": "20px",
        					"float": "right",
        					"margin-right": "30px",
        					"text-align": "center",
        					"background-color": "#999",
        					"color": "white",

        				});
        				delbtn.css({
        					"line-height": "30px",
        					"height": "30px",
        					"border-radius": "20px",
        					"font-size": "24px",
        					"font-weight": "bold"
        				});
        				delem.hover(function() {
        					$(this).css({
        						"background-color": "red",
        						"cursor": "pointer"
        					});

        				},
        				function() {
        					$(this).css({
        						"background-color": "#999"
        					});
        				});
        				showcontent.css({
        					"width": $(document).width() * 0.8,
        					"height": $(document).height() * 0.6,
        					"left": $(document).width() * 0.1,
        					"position": "absolute",
        					"top": $(document).height() * 0.1,
        					"background-color": "#5A5D69",
        					"overflow": "scroll"
        				});
        				//绑定点击事件
        				delbtn.on("click",
        				function() {
        					showall.hide("slow");
        				});
        				showall.css({
        					"background-color": "black",
        					"position": "absolute",
        					"width": $(document).width(),
        					"height": $(document).height(),
        					"z-index": "1001",
        					"top": "0",
        					"left": "0"
        				});
        				setTimeout(function() {
        					showall.show();
        				},
        				100);
        				//end show all casename div
        			});
        			//end show all case name
        			//设置表格的滑轮在合适的位置出现
        			scrollshow();
        			$(this).hover(function(e) {

        				//清空数据
        				//send ajax for excel content
        				$.ajax({
        					url: "/caseplatform/getcaseinstruction",
        					dataType:"text",
        					data: $.param({
        						"caseName": $(this).children("input").attr("excelname"),
        						"dataFile": $(this).children("input").attr("pp") + "/data/" + $(this).children("input").attr("classname"),
        						"userName": username
        					}),
        					type: "post",
        					timeout: 1000,
        					success: function(data) {
        						contentDiv.html("");
        						content.html("");
        						var ds = $.parseJSON(data);
        						for (i = 0; i < ds.length; i++) {
        							content.append("<li>" + ds[i] + "</li>");
        						}
        						content.children("li").css({
        							"list-style": "decimal",
        							"font-size": "14px",
        							"color": "white",
        							"margin-left": "25px"
        						});
        						contentDiv.append(content);
        					},
        					error: function(error) {}
        				});
        				//end ajax for excel content
        				timeout = setTimeout(function() {
        					if (contentDiv.children("ul").children("li").length > 0) {
        						contentDiv.css({
        							"opacity": "0.8",
        							"background-color": "black",
        							"border-left": " 5px solid #CCC",
        							"border-top": " 5px solid #CCC",
        							"border-right": " 5px solid white",
        							"border-bottom": " 5px solid white",
        							"position": "absolute",
        							"width": "300px",
        							"z-index": "1000",
        							"top": e.pageY + 10,
        							"left": e.pageX + 10
        						}).show();

        					}
        				},
        				1000);

        			},
        			function(ele) {
        				clearTimeout(timeout);
        				contentDiv.hide();
        				console.log("hide");
        			});
        		});
        	},
        	error: function(msg) {
        		alert(msg + "，请重试");
        	}

        });
	}
	//end function show case
	$(".packageNavi").children("ul").children("li").bind("click",
	function() {
	    $(this).css({
        	"color": "red"
        });
        $(this).siblings().css({
        	"color": "black"
        });
        _this=$(this);
        showcase(_this,"");


	});


	var _this;
	var timeout;
    var flag;//标记
	var contentDiv = $("<div></div>");
	var content = $("<ul></ul>");
	contentDiv.appendTo("body");

	var change = function() {
	    //显示生成xml文件按钮

		$(".classContent").find("tr").each(function(index, element) {
			var _this = this;
			$(this).children("td").first().children("input").on("change",
			function() {
			    $("#creatXml").css({"display":"block"});
				$("#inputtext").show();
				if ($(this).attr("checked")) {
					//选中了整个类
					$(_this).children("td").last().children("p").children("input").attr("checked", true);
					//将整个类中的方法写入到u'l中
					var lisi = "";
					for (var i = 0; i < $(_this).children("td").last().children("p").length; i++) {
						lisi += "<li>" + $(_this).children("td").last().children("p").eq(i).children("input").attr("name") + "</li>";
					}
					$("#inputtext").append("<ul id=" + $(_this).children("td").first().children("input").attr("name") + ">" + "<span></span>" + $(_this).children("td").first().children("input").attr("name") + lisi + "</ul>");
					inval();
				} else {
					//取消了整个类
					$(_this).children("td").last().children("p").children("input").attr("checked", false);
					//将加入的清空
					for (var i = 0; i < $("#inputtext").find("ul").length; i++) {

						if ($("#inputtext").find("ul").eq(i).attr("id") == $(_this).children("td").first().children("input").attr("name")) {

							console.log("ul ele remove ok");

							ele = $("#inputtext").find("ul").eq(i);

						}

					}
					ele.remove();
					inval();
				}
			});
			$(this).children("td").last().children("p").children("input").on("change",
			function() {
				$("#inputtext").show();
				$("#creatXml").css({"display":"block"});
				if ($(this).attr("checked")) {
					//选中了类中的方法
					$(_this).children("td").first().children("input").attr("checked", true);
					//将类中的部分方法写入到ul中
					var ele = "";
					for (var i = 0; i < $("#inputtext").find("ul").length; i++) {

						if ($("#inputtext").find("ul").eq(i).attr("id") == $(_this).children("td").first().children("input").attr("name")) {
							console.log("ul ele ok");
							ele = $("#inputtext").find("ul").eq(i);
						}
					}
					if (ele == "") {
						$("#inputtext").append("<ul id=" + $(_this).children("td").first().children("input").attr("name") + ">" + "<span></span>" + $(_this).children("td").first().children("input").attr("name") + "</ul>");
						inval();
						for (var i = 0; i < $("#inputtext").find("ul").length; i++) {
							if ($.trim($("#inputtext").find("ul").eq(i).attr("id")) == $(_this).children("td").first().children("input").attr("name")) {
								ele = $("#inputtext").find("ul").eq(i);
							}
						}
					}
					ele.append("<li>" + $(this).attr("name") + "</li>");
					inval();
				} else {
					//取消了类中的方法
					var flag = true;
					$(_this).children("td").last().children("p").each(function() {
						if ($(this).children("input").attr("checked")) {
							flag = flag && false;
						} else {
							flag = flag && true;
						}
					});
					console.log(flag);
					if (flag) {
						$(_this).children("td").first().children("input").attr("checked", false);
					}
					//将取消的方法删除
					var ele = "";

					for (var i = 0; i < $("#inputtext").find("li").length; i++) {

						if ($.trim($("#inputtext").find("li").eq(i).text()) == $.trim($(this).attr("name"))) {

							ele = $("#inputtext").find("li").eq(i);

						}

					}

					if (ele != "") {
						if (ele.siblings("li").length == 0) {
							ele.parent().remove();
							ele.remove();
						} else {
							ele.remove();
						}
						inval();

					}
				}
			});
		});
	}

	$("#creatXml").bind("click",
	function() {
		console.log("a click");
		var ro = {};

		var root = [];

		$("#inputtext").find("ul").each(function(i, ele) {
			console.log(ele);
			var classNames = {};

			var methodNames = [];

			for (var i = 0; i < $(this).find("li").length; i++) {

				methodNames.push($.trim($(this).find("li").eq(i).text()));

			}

			classNames.className = $(this).attr("id");

			classNames.methodName = methodNames;

			root.push(classNames);

		});

		ro.path = $("label").text();

		ro.root = root;
		ro.version = projectAtfVersion;
		ro.userName = $("#logOut").text();
		console.log(ro.toString());
		if (root.length > 0) {
			$.ajax({
				url: "/caseplatform/xmlcreat",
				dataType:"text",
				data: {
					"myJson": JSON.stringify(ro),
					"userName":username
				},
				type: "post",
				scriptCharset: "utf-8",
				cache: false,
				success: function(returnData) {
					console.log(returnData);
					var pathJson = $.parseJSON(returnData);
					//console.log(pathJson.name);
					if (projectAtfVersion == "-1") {
						alert("pom中未检索到atf依赖，请加上！");
					} else {
					    var formn = $("<form></form>");
                        formn.attr('action','../caseplatform/executeTestInit');
                        formn.attr('method','post');
                        var input1 = $("<input type='hidden' name='path' />");
                        input1.attr('value',pathJson.path);
                        var input2 = $("<input type='hidden' name='name' />");
                        input2.attr('value',pathJson.name);
                        var input3 = $("<input type='hidden' name='userName' />");
                        input3.attr('value',username);
                        formn.append(input1);
                        formn.append(input2);
                        formn.append(input3);
                        formn.appendTo("body");
                        formn.css('display','none');
                        formn.submit();
						//window.location.href = "/caseplatform/executeTestInit?path=" + pathJson.path + "&name=" + pathJson.name;
					}
				},
				error: function(returnData) {
					console.log(returnData);
				}
			});
		} else {
			alert("please chooese methods");
		}
	});


	//实现可拖拽
	$("#inputtext").mouseover(function() {
		this.style.cursor = "hand";
		var con = document.getElementById('inputtext');
		var lis = $("#inputtext").find("ul");
		for (var i = 0; i < lis.length; i++) {
			lis[i].draggable = true; //每个li都设置可拖拽属性
			lis[i].flag = false;
			lis[i].onmouseover = function() {
				this.style.border = "#666 1px dashed";
			}
			lis[i].onmouseout = function() {
				this.style.border = "none";
			}
			lis[i].ondragstart = function() {
				this.flag = true; //鼠标拖拽li时设置flag为true
			}
			lis[i].ondragend = function() {
				this.flag = false;
				this.style.border = "none";
				inval();
			}
		};

		con.ondragenter = function(e) {
			// e.preventDefault();
		}

		con.ondragover = function(e) {
			e.preventDefault(); //阻止默认事件，否则不会触发ondrop事件
		}

		con.ondragleave = function(e) {
			// e.preventDefault();
		}

		con.ondrop = function(e) {
			// e.preventDefault();`
			for (var i = 0; i < lis.length; i++) {
				if (lis[i].flag) {
					con.appendChild(lis[i]);
				}
			};
		}
	});
	var inval = function() {
		$('#inputtext').find("ul").each(function(i, e) {
			i = i + 1;
			$(this).find("span").text(i);
		})
	}
});