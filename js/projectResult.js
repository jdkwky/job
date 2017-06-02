
var FLAG = "3";
var SIZE = "10";
var PAGENUMBER = "1";
var PAGE = 5;
$(document).ready(function () {
//    spam.showMessageBox("1233455","34252345235235");
    hidediv();
    $(".loading").hide();
    $(".content_nav").children("ul").children("li").first().children("a").css({"background": "#0A4C8E"});
    //屏蔽a标签  表单提交
    $(".linka").bind("click", function () {
        //待构造对象
        var formContent = {
            action: "../caseplatform/packages",
            method: "post",
            inputParams: [{
                inputName: "projectPath",
                inputValue: $(this).attr("path")
            }, {
                inputName: "projectAtfVersion",
                inputValue: $(this).attr("projectName")
            }, {
                inputName: "projectName",
                inputValue: $(this).attr("name")
            }, {
                inputName: "userName",
                inputValue: $(this).attr("userName")
            }]
        };
        var linkaForm = aChangeFormObj.aChangeForm(formContent);
        linkaForm.submit();
    });
    //切换html
    //默認xml展示页面在最开始展示 要先请求数据
    FLAG = $("#xmlflag").val();
    showxml(FLAG, SIZE, PAGENUMBER);
    $(".content_nav").children("ul").children("li").children("a").click(function () {

        var id = $(this).parent("li").attr("title");
        $(this).css({
            "text-decoration": "none",
            "background": "#0A4C8E"
        });
        $(this).parent("li").siblings("li").children("a").css({
            "text-decoration": "none",
            "background": "#2773C0"
        });
        if (id == "xml") {
            FLAG = $("#xmlflag").val();
            showxml(FLAG, SIZE, PAGENUMBER);
        } else if (id == "report") {
            FLAG = $("#reportflag").val();
            showreport(FLAG, SIZE, PAGENUMBER);
        }
        $("#" + id).removeClass("content_contentdis").addClass("content_content").siblings().addClass("content_contentdis").removeClass("content_content");
    });

    $(".updateBtn").click(function () {
        $(".loading").show();
        $.ajax({
            url: "../caseplatform/svnUpdate",
            data: $.param({
                "projectPath": $(this).attr("title"),
                "userName": username
            }),
            dataType: "text",
            type: "post",
            timeout: "200000",
            success: function (data) {
                  var jsonData=JSON.parse(data);
                  var flag=jsonData.flag;
                  var result=jsonData.result;
                  var reg=/\\n/g;
                  result.replace(reg,"<br/>");
                  var title=(flag=="success"?"工程已更新至svn的最新版本":"svn更新超时，请重试");
                  spam.showMessageBox(title,result);
            },
            complete: function (request, status) {
                if (status == "timeout") {
                    alert("svn更新超时，请重试");
                    window.location.reload();
                }
            }
        });
    });
    //svn
    $(".svnbtn").click(function () {
        urlPra = $("#text").val();
        if (urlPra == "" || urlPra == null) {
            alert("请输入svn地址");
        } else if ($("#desText").val() == "" || $("#desText").val() == null) {
            alert("请输入描述信息");
        } else {
            $.ajax({
                url: "../caseplatform/svnCheckout",
                type: "post",
                dataType: "text",
                data: $.param({
                    "svnPath": urlPra,
                    "businessBelong": $("#belongs").val(),
                    "describtion": $("#desText").val(),
                    "userName": username
                }),
                timeout: 100000,
                success: function (msg) {
                    if (msg == "success") {
                        window.location.reload();
                    } else if (msg == "xiangmuhuifu") {
                        window.location.reload();
                        alert("项目已经恢复");
                    } else if (msg == "xiangmuyicunzai") {
                        window.location.reload();
                        alert("项目已经存在");
                    } else {
                        window.location.reload();
                        alert("项目检出失败");
                    }
                },
                error: function (msg) {
                    alert(msg);
                }
            });
        }

    });
    //start 删除svncheckout出来的项目
    $(".delSvnBtn").on("click", function () {
        $.ajax({
            url: "../caseplatform/delProject",
            data: $.param({
                "projectPath": $(this).attr("title"),
                "userName": username
            }),
            dataType: "text",
            type: "post",
            success: function (msg) {
                if (msg == "success") {
                    alert("删除成功");
                    window.location.href = "";
                }
            }
        });
    });
    //end svndelete
    //start getreport
    $("#reportflag").on("change", function () {
        showreport($("#reportflag").val(), SIZE, PAGENUMBER);
    });
    //end getreport

    //start getxml
    $("#xmlflag").on("change", function () {
        showxml($("#xmlflag").val(), SIZE, PAGENUMBER);
    });
    //end getxml
});
//start getsavexml name function
var showxml = function (flag, size, pageNumber) {
    // var flag=$("#xmlflag").val();

    if (flag != -1) {
        $.ajax({
            url: "../caseplatform/getXmlList",
            type: "post",
            dataType: "text",
            data: $.param({
                "flag": flag,
                "userName": username,
                "size": size,
                "pageNumber": pageNumber
            }),
            success: function (data) {
                if (data != "" && data != null && data != undefined) {
                    $(".showxml").html("");
                    var lists = $.parseJSON(data);
                    var table = $("<table style='table-layout:fixed;word-wrap:break-word;width:980px'></table>");
                    $(".showxml").append(table);
                    var tableth = $("<tr><th style='width:25%;height:30px'>描述</th><th style='width:10%;height:30px'>xmlName</th><th style='width:10%;height:30px'>工程</th><th  style='width:10%;height:30px'>创建人</th><th  style='width:10%;height:30px'>创建时间</th><th  style='width:15%;height:30px'>选择服务器</th><th  style='width:10%;height:30px'>接口邮件</th><th  style='width:10%;height:30px'>操作</th></tr>");
                    table.append(tableth);
                    for (var i = 0; i < lists.xmltableInfoList.length; i++) {
                        var tabletr = $("<tr></tr>");
                        table.append(tabletr);
                        tabletr.append("<td   title='description' style='font-weight:bold; width:25%'>" + lists.xmltableInfoList[i].description + "</td>");
                        tabletr.append("<td   title='xmlName' style='width:10%' >" + lists.xmltableInfoList[i].xmlName + "</td>");
                        tabletr.append("<td title='projectBelong' style='width:10%'>" + lists.xmltableInfoList[i].projectBelong + "</td>");
                        tabletr.append("<td title='userName' style='width:10%'>" + lists.xmltableInfoList[i].userName + "</td>");
                        tabletr.append("<td title='time' style='width:10%'>" + lists.xmltableInfoList[i].createTime + "</td>");
                        tabletr.append("<td  style='width:15%' xmlPath=" + lists.xmltableInfoList[i].projectBelong + "><select class='newIp'><option value='请选择ip地址'>请选择ip地址</option><option value='192.168.183.79'>192.168.183.79</option><option value='192.168.183.78'>192.168.183.78</option><option value='192.168.183.76'>192.168.183.76</option><option value='192.168.183.80'>192.168.183.80</option><option value='192.168.183.148'>192.168.183.148</option><option value='192.168.183.71'>192.168.183.71</option><option value='192.168.183.72'>192.168.183.80</option></select></td>");
                        tabletr.append("<td  style='width:10%' ><select class='isSendMail'><option value='false'>不发送</option><option value='true'>发送</option></select></td>");
                        tabletr.append("<td  style='width:10%' xmlName=" + lists.xmltableInfoList[i].xmlName + "  userName=" + username + "  belongproject=" + lists.xmltableInfoList[i].projectBelong + ">" + "<a  title='dele' href='javascript:void(0)'>删除</a>" + "<a title='excute' href='javascript:void(0)'>执行</a>" + "</td>");

                        tabletr.css({
                            "text-align": "center",
                            "padding": "0",
                            "margin": "0",
                            "border": "1px solid #CCC",
                            "border-width": "1px"
                        });
                        tabletr.children("td").css({
                            "border": "1px solid #CCC",
                            "border-width": "1px",
                            "padding": "5px 5px"
                        });

                        tabletr.find("a").last().on("click",
                            function () {
//                              console.log($(this).parent("td").parent("tr").find("select").val().toString().indexOf("."));
                                var newIp = $(this).parent("td").parent("tr").find(".newIp").val().toString();
                                var isSendMail = $(this).parent("td").parent("tr").find(".isSendMail").val().toString();
                                if (newIp.indexOf(".") > 0) {
                                    timestamp = new Date().getTime();
                                    runXml("", $(this).parent("td").attr("xmlName"), newIp, timestamp);
                                    $("#showxmlproject").text($(this).parent("td").attr("belongproject"));
                                    $("#showxmlname").text($(this).parent("td").attr("xmlName"));
                                    //start deletexml
                                    var xmltime = setInterval(function () {
                                            deletexml(xmltime, "/opt/soft/casePlatform/caseRepertory/" + $("#showxmlproject").text() + "/" + $("#showxmlname").text(), $("#path").text(), newIp, isSendMail, timestamp);
                                        },
                                        500);
                                    //end deletexml
                                } else {
                                    alert("请选择IP地址");
                                }
                            });
                        if (username != lists.xmltableInfoList[i].userName) {
                            tabletr.find("a").first().css({
                                "color": "#CCC",
                                "cursor": "default"
                            });
                            tabletr.find("a").first().removeAttr("href");
                            tabletr.find("a").first().removeAttr("click");
                        } else {
                            tabletr.find("a").on("click",
                                function () {
                                    if ($(this).attr("title") == "dele") {
                                        var _this = $(this);
                                        $.ajax({
                                            url: "../caseplatform/logicdeleteXml",
                                            data: $.param({
                                                "xmlName": $(this).parent("td").attr("xmlName"),
                                                "userName": username
                                            }),
                                            dataType: "text",
                                            type: "post",
                                            success: function (data) {
                                                if (data == "true") {
                                                    _this.parent("td").parent("tr").remove();
                                                } else {
                                                    alert("请重新删除");
                                                }
                                            }
                                        });
                                    }
                                });
                        }

                    }
                    table.css({
                        "border-collapse": "collapse",
                        "width": "980px",
                        "font-size": "14px",
                        "border": "1px solid #CCC",
                        "border-width": "1px"
                    });
                    table.find("a").css({
                        "margin-right": "10px"
                    });
                    var pageDiv = $("<div class='pagediv'></div>");
                    pageDiv.css({
                        "width": "980px",
                        "height": "30px"
                    });
                    // var pageDiv=initPage();
                    pageDiv.append("<a class='nextPage' href='javascript:;' title='nextPage'>下一页</a>");
                    for (var i = lists.maxPageNumber > PAGE ? PAGE : lists.maxPageNumber; i >= 1; i--) {
                        pageDiv.append("<a class='pagediva' href='javascript:;' page=" + i + ">" + i + "</a>");
                    }

                    if (pageNumber && pageNumber >= 1) {
                        pageDiv.append("<a class='prePage' href='javascript:;' title='prePage'>上一页</a>");
                    }
                    $(".showxml").append(pageDiv);
                    changeNum($(".showxml"), pageNumber);

                    $(".showxml").find(".pagediv").find(".prePage").on("click", function () {
                        // var alength = $(".showxml").find(".pagediv").find(".pagediva").length;
                        var currentNum=$(".showxml").find(".pagediv").find(".pagediva").eq(0);
                        changePageNum(pageDiv, currentNum.attr("page"), lists.maxPageNumber, 0);
                        $(".showxml").find(".pagediv").find(".pagediva").on("click", function () {
                            showxml(flag, size, $(this).attr("page"));
                        });
                    });
                    $(".showxml").find(".pagediv").find(".nextPage").on("click", function () {
                        var alength=$(".showxml").find(".pagediv").find(".pagediva").length;
                        var currentNum=$(".showxml").find(".pagediv").find(".pagediva").eq(alength-1);
                        changePageNum($(".showxml").find(".pagediv"), currentNum.attr("page"), lists.maxPageNumber, 1);
                        $(".showxml").find(".pagediv").find(".pagediva").on("click", function () {
                            showxml(flag, size, $(this).attr("page"));
                        });
                    });
                    $(".showxml").find(".pagediv").find(".pagediva").on("click", function () {
                        showxml(flag, size, $(this).attr("page"));
                    });
                }
            }
        });
    }
}

var changePageNum = function (pageDiv, minPageNumber, maxPageNumber, flag) {
    pageDiv.html("");
    var minPageNumber=parseInt(minPageNumber);
    var maxPageNumber=parseInt(maxPageNumber);
    pageDiv.append("<a class='nextPage' href='javascript:;' title='nextPage'>下一页</a>");
    if (flag == 0) {
        var tab=PAGE > maxPageNumber-minPageNumber+1 ? maxPageNumber-minPageNumber+1 : PAGE;

        for (var i =(minPageNumber-1+tab)>maxPageNumber?maxPageNumber:(minPageNumber-1+tab); i >= (minPageNumber - 1) >= 1 ? (minPageNumber - 1) : 1; i--) {
            pageDiv.append("<a class='pagediva' href='javascript:;' page=" + i + ">" + i + "</a>");
        }
    } else {
        var tab = (maxPageNumber - minPageNumber - 1)>PAGE?PAGE:(maxPageNumber - minPageNumber - 1);
        for (var i = minPageNumber+1+tab; i >= minPageNumber + 1; i--) {
            pageDiv.append("<a class='pagediva' href='javascript:;' page=" + i + ">" + i + "</a>");
        }
    }
    if (minPageNumber >= 1) {
        pageDiv.append("<a class='prePage' href='javascript:;' title='prePage'>上一页</a>");
    }
}
//end getsavexml name function
//start make pageNum changeColor
var changeNum = function (fele, pageNumber) {
    for (var i = 0; i < fele.find(".pagediv").find("a").length; i++) {
        if (fele.find(".pagediv").find("a").eq(i).attr("page") == pageNumber) {
            var element = fele.find(".pagediv").children("a").eq(i);
            element.css({
                "background-color": "#428bca",
                "color": "white"
            });
            element.removeAttr("href");
            break;
        }
    }
}
//end make pageNum changeColor
//start getreport name function
var showreport = function (flag, size, pageNumber) {
    if (flag != -1) {
        $.ajax({
            url: "../caseplatform/getReportList",
            data: $.param({
                "flag": flag,
                "userName": username,
                "size": size,
                "pageNumber": pageNumber
            }),
            dataType: "text",
            type: "post",
            success: function (data) {
                var lists = $.parseJSON(data);
                if (data != "" && data != null && data != undefined) {
                    $(".showreport").html("");
                    var lists = $.parseJSON(data);
                    var table = $("<table style='table-layout: fixed; word-wrap: break-word;'></table>");
                    $(".showreport").append(table);
                    var tableth = $("<tr><th style='width: 25%;height:30px'>所属xml</th><th style='width: 10%;height:30px'>描述</th><th style='width:10% ;height:30px'>工程</th><th style='width:10% ;height:30px'>业务线</th><th style='width:10% ;height:30px'>生成时间</th><th style='width:10% ;height:30px'>创建人</th><th style='width:13% ;height:30px'>执行ip</th><th style='width:12% ;height:30px'>操作</th></tr>");
                    table.append(tableth);
                    for (var i = 0; i < lists.reportInfoList.length; i++) {
                        var tabletr = $("<tr></tr>");
                        table.append(tabletr);
                        //tabletr.append("<td  title='description'style='font-weight:bold'>" + lists.reportInfoList[i].reportName + "</td>");
                        tabletr.append("<td  title='description'style='font-weight:bold;width: 10%'>" + lists.reportInfoList[i].description + "</td>");
                        tabletr.append("<td title='xmlBelong' >" + lists.reportInfoList[i].xmlBelong + "</td>");

                        tabletr.append("<td title='projectBelong' >" + lists.reportInfoList[i].projectBelong + "</td>");
                        tabletr.append("<td title='businessBelong' >" + lists.reportInfoList[i].businessBelong + "</td>");
                        tabletr.append("<td title='creatTime' >" + lists.reportInfoList[i].createTime + "</td>");
                        tabletr.append("<td title='userName'>" + lists.reportInfoList[i].userName + "</td>");
                        tabletr.append("<td title='newIp' >" + lists.reportInfoList[i].newIp + "</td>");
                        tabletr.append("<td   reportName=" + lists.reportInfoList[i].reportName + "  userName=" + username + "  reportPath=" + lists.reportInfoList[i].reportPath + ">" + "<a  title='show'class='watchReport' style='font-size:9px' href='javascript:void(0)'>查看报告</a><a  title='mail' style='font-size:9px;margin-left:8px;' class='sendMail' href='javascript:void(0)'>发送邮件</a>" + "</td>");
                        tabletr.css({
                            "text-align": "center",
                            "padding": "0",
                            "margin": "0",
                            "border": "1px solid #CCC",
                            "border-width": "1px"
                        });
                        tabletr.children("td").css({
                            "border": "1px solid #CCC",
                            "border-width": "1px",
                            "padding": "5px 5px"
                        });
                        if (lists.reportInfoList[i].reportName != "") {
                            tabletr.find(".watchReport").attr("href", "../caseplatform/getreport?reportName=" + lists.reportInfoList[i].reportName);
                            tabletr.find(".sendMail").on("click", function () {
                                $.ajax({
                                    url: "../caseplatform/sendMail?reportName=" + lists.reportInfoList[i].reportName + "&userName=" + username,
                                    type: "get",
                                    dataType: "text",
                                    timeout: "60000",
                                    success: function (data) {
                                        if (data.toString() == "true") {
                                            alert("邮件发送成功");
                                        } else {
                                            alert("邮件发送失败");
                                        }
                                    },
                                    error: function () {
                                        alert("邮件发送失败");
                                    }
                                });
                            });
                            //tabletr.find(".sendMail").attr("href","../caseplatform/sendMail?reportName=" + lists.reportInfoList[i].reportName+"&userName="+username);
                        } else {
                            tabletr.find("a").removeAttr("href");
                            tabletr.find("a").css({
                                "color": "#CCC"
                            });
                        }

                    }
                    table.css({
                        "border-collapse": "collapse",
                        "width": "980px",
                        "font-size": "14px",
                        "border": "1px solid #CCC",
                        "border-width": "1px",
                        "margin-top": "10px",
                        /*"table-layout": "fixed"*/
                    });
                    var pageDiv = $("<div class='pagediv'></div>");
                    pageDiv.css({
                        "width": "980px",
                        "height": "30px"
                    });
                    for (var i = lists.maxPageNumber; i >= 1; i--) {
                        pageDiv.append("<a href='javascript:;' page=" + i + ">" + i + "</a>");
                    }
                    $(".showreport").append(pageDiv);
                    changeNum($(".showreport"), pageNumber);
                    $(".showreport").find(".pagediv").find("a").on("click",
                        function () {
                            showreport(flag, size, $(this).attr("page"));

                        });


                }
            }
        });
    }

}
var timestamp;
//end getreport name function