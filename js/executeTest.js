$(document).ready(function () {
    console.log(username);
    $("#resultDiv").hide();
    $(".saveBody").hide();
    $("#saveXml").bind("click", function () {
            $(".saveBody").height($(document).height()).css({
                'position': 'absolute',
                'background-color': 'white',
                'width': '100%',
                'top': '0',
                'left': '0',
                'z-index': 4999
            }).show();
            $("#saveDiv").height($(document).height() * 0.6).css({
                'opacity': 0.8,
                'position': 'absolute',
                'border': '3px solid #CCC',
                'border-radius': '5px',
                'background-color': 'white',
                'top': '10%',
                'left': '20%',
                'width': '60%',
                'z-index': 5000
            }).show();
            executeFlag = "";
        });
    var executeFlag = "";
    $("#both").bind("click",
        function () {
        if($("#scfIpSelect").val().toString().indexOf(".")>0){
            $(".saveBody").height($(document).height()).css({
                'position': 'absolute',
                'background-color': 'white',
                'width': '100%',
                'top': '0',
                'left': '0',
                'z-index': 4999
            }).show();
            $("#saveDiv").height($(document).height() * 0.6).css({
                'opacity': 0.8,
                'position': 'absolute',
                'border': '3px solid #CCC',
                'border-radius': '5px',
                'background-color': 'white',
                'top': '10%',
                'left': '20%',
                'width': '60%',
                'z-index': 5000
            }).show();
            executeFlag = "true";
           }else{
                alert("请选择ip地址");
           }
        });
    //get rtx name && delete start
    $("#shareName").on("input", function () {
            var content = $("#shareName").val();
            content = $.trim(content);
            if (content.length > 0) {
                $.ajax({
                    url: "../caseplatform/getUserList",
                    type: "post",
                    data: $.param({
                        "userName": content
                    }),
                    dataType:"text",
                    success: function (data) {
                        $(".shareUl").html("");
                        console.log(data);
                        var json = JSON.parse(data);
                        var names = json.userInfoList;
                        if (names.length > 0) {
                            for (var i = 0; i < names.length; i++) {
                                $(".shareUl").append("<li title=" + names[i].userName + ">" + names[i].userName + "</li>");
                            }
                            $(".shareUl").css({
                                "font-size": "14px",
                                "border-bottom": "1px solid #CCC",
                                "border-left": "1px solid #CCC",
                                "border-right": "1px solid #CCC",
                                "border-radius": "4px",
                                "list-style": "none",
                                "width": "277px"
                            }).show();
                            $(".shareUl").children("li").css({
                                "cursor": "pointer"
                            });
                            //start name click
                            $(".shareUl").children("li").on("click",
                                function () {
                                    changeName($(this));
                                });
                            //end name click

                        }
                    }
                });
            } else {
            }
        });
    //end get rtx name && delete
    //start function
    var changeName = function (obj) {
        var textName = obj.text() ? obj.text() : obj.val();
        $("#shareName").before("<span title=" + textName + ">" + textName + "<em>X</em>" + "</span>");
        $(".shareDiv").find("span").css({
            "height": "20px",
            "width": "auto",
            "float": "left",
            "line-height": "20px",
            "margin-top": "3px",
            "margin-right": "10px",
            "padding-right": "5px",
            "font-size": "14px",
            "background-color": "#CCC"
        });
        $(".shareDiv").find("span").find("em").css({
            "margin-left": "5px",
            "cursor": "pointer"
        });
        $("#shareName").css({
            "border": "1px solid #CCC"
        }).attr("value", "").focus();
        $(".shareUl").hide();
        $(".shareUl").html("");
        $(".shareDiv").find("span").find("em").on("click",
            function () {
                $(this).parent("span").remove();
            });
    }
    //end function
    //start name keypress enter
    $(document).on("keydown",
        function (e) {
            var flag = 0;
            if (flag == 0) {
                flag++;
                e = e || window.event;

                var _this_self;
                for (var i = 0; i < $(".shareUl").children("li").length; i++) {
                    if ($(".shareUl").children("li").eq(i).attr("select") === "selected") {
                        _this_self = $(".shareUl").children("li").eq(i);
                    }
                }
                if (e.keyCode == 40) {
                    $("#shareName").blur();
                    if (_this_self != undefined && _this_self != null) {
                        _this_self = _this_self.next();
                        _this_self.css({
                            "background-color": "#CCC"
                        });
                        _this_self.attr("select", "selected");
                        _this_self.siblings().attr("select", "");
                        _this_self.siblings().css({
                            "background-color": "white"
                        });
                    } else {
                        _this_self = $(".shareUl").children("li").first();
                        _this_self.css({
                            "background-color": "#CCC"
                        });
                        _this_self.attr("select", "selected");
                        _this_self.siblings("select", "");
                        _this_self.siblings().css({
                            "background-color": "white"
                        });
                    }

                } else if (e.keyCode == 38) {
                    $("#shareName").blur();
                    if (_this_self != undefined && _this_self != null) {
                        _this_self = _this_self.prev();
                        _this_self.css({
                            "background-color": "#CCC"
                        });
                        _this_self.attr("select", "selected");
                        _this_self.siblings().attr("select", "");
                        _this_self.siblings().css({
                            "background-color": "white"
                        });
                    }

                } else if (e.keyCode == 13) {
                    var obj;
                    $("#shareName").blur();
                    if ($(".shareUl").children("li").length > 0) {
                        for (var i = 0; i < $(".shareUl").children("li").length; i++) {
                            if ($(".shareUl").children("li").eq(i).attr("select") === "selected") {
                                obj = $(".shareUl").children("li").eq(i);
                            }
                        }
                        changeName(obj);
                        $(".shareUl").children("li").css({
                            "background-color": "white"
                        });
                        $(".shareUl").children("li").attr("select", "");
                    } else {
                        if ($("#shareName").val() != "") {
                            changeName($("#shareName"));
                        }
                    }
                    _this_self = null;

                } else {
                    _this_self = null;
                    $(".shareUl").children("li").css({
                        "background-color": "white"
                    });
                    $(".shareUl").children("li").attr("select", "");

                }
            } else {
                console.log("why");
            }
        });
    //end name keypress enter
    $("#savebtn").bind("click",
        function () {
            if ($("#save").val() == "" || $("#save").val() == undefined || $("#save").val() == null) {
                alert("请出入一个英文名字");
            } else if ($("#description").val() == "" || $("#description").val() == undefined || $("#description").val() == null) {
                alert("请输入xml描述信息");
            } else {
                //获取名字
                var names = "";
                $(".shareDiv").find("span").each(function () {
                    console.log($(this));
                    names += "'" + $(this).attr("title") + "'" + ",";
                });
                names = names.substr(0, names.length - 1);
                console.log(names);
                $.ajax({
                    url: "/caseplatform/saveXml",
                    data: $.param({
                        "oldXmlName": $("#wfName").text(),
                        "newXmlName": $("#save").val() + ".xml",
                        "sharedName": names,
                        "description": $("#description").val(),
                        "userName": username
                    }),
                    dataType:"text",
                    type: "post",
                    scriptCharset: "utf-8",
                    cache: false,
                    success: function (data) {
                        switch (data) {
                            case "1":
                                alert("保存成功");
                                console.log(executeFlag);
                                if (executeFlag == "") {
                                    window.location.href = "/caseplatform/project";
                                } else {
                                    timestamp=new Date().getTime();
                                    runXml($("#wfPath").text(), $.trim($("#save").val() + ".xml"),$("#scfIpSelect").val(),timestamp);
//                                    var xmltime = setInterval(function () {
//                                            deletexml(xmltime, $("#wfPath").text() + "/" + $("#wfName").text(), $("#path").text(),$("#scfIpSelect").val());
//                                    }, 500);
                                }
                                break;
                            case "2":
                                alert("名字已经存在");
                                break;
                            case "3":
                                alert("保存失败");
                                break;
                            case "4":
                                alert("不该存在的xml文件");
                                break;
                            default:
                                alert("很遗憾，我也不知道这是什么原因");
                                break;
                        }
                    }
                });
            }
        });
    $("#excute").bind("click", function () {
        console.log($("#scfIpSelect").val().toString().indexOf("."));
        if($("#scfIpSelect").val().toString().indexOf(".")>=0){
            timestamp=new Date().getTime();
            runXml($("#wfPath").text(), $("#wfName").text(),$("#scfIpSelect").val(),timestamp);
            executeFlag = "";
        }else{
            alert("请选择机器IP");
        }
    });
    //delete shareBox
    $(".deleteShare").on("click",function(){
        $(".saveBody").hide();
    });
    //deletexml start
    var xmltime = setInterval(function () {
        deletexml(xmltime, $("#wfPath").text() + "/" + $("#wfName").text(), $("#path").text(),$("#scfIpSelect").val(),"false",timestamp);
    }, 500);
    //end deletexml
    //start changeScfConfigIp
//    $("#scfIpSelect").on("change",function(){
//        var matches=new Array();
//        matches=$("#wfPath").text().toString().split("/");
//        var newPath="";
//        for(var i=1;i<matches.length-1;i++){
//            newPath+="/"+matches[i];
//        }
//        newPath=newPath+"/"+username+"/"+matches[matches.length-1];
//        console.log(newPath);
//        console.log($("#wfPath").text().toString());
//
//        aChangeFormObj.changeScfConfigIp(newPath+"/config/scf-offline.config",$("#scfIpSelect").val());
//    });
});
var timestamp;