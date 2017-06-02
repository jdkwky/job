//start hide div
function hidediv() {
    $("#resultDiv").hide();
}
//end hide div
//start execute function
var flag="";
function runXml(xmlpath, xmlname,newIp,timestamp) {
    $.ajax({
        url: "../caseplatform/executeTest",
        data: $.param({
            "path": xmlpath,
            "name": xmlname,
            "userName": username,
            "newIp":newIp,
            "flagTime":timestamp
        }),
        type: "post",
        dataType:"text",
        scriptCharset: "utf-8",
        cache: false,
        success: function (data) {
            console.log(data);
            $("#path").text(data);
            if (data != "false") {
                var timeout = setInterval(function () {
                        $.ajax({
                            url: "../caseplatform/executeTestText",
                            type: "post",
                            dataType:"text",
                            data: $.param({
                                "path":data,
                                "userName": username,
                                "lastContentSize":(flag==""?"0":flag)
                            }),
                            scriptCharset: "utf-8",
                            cache: false,
                            success: function (text) {
//                                console.log("text"+text);
                                var textJson=$.parseJSON(text);
//                                console.log("json"+textJson);
                                var docHeight = $(document).height();
                                if (textJson != null) {
                                    flag=textJson.lastContentSize;
                                    console.log(textJson.lastContentSize);
                                    $("#resultDiv").height(docHeight).css({
                                        'position': 'absolute',
                                        'background-color': '#CCC',
                                        'top': '0',
                                        'left': '0',
                                        'width': '100%',
                                        'z-index': 5000
                                    }).show();
                                    $("#result").height(docHeight * 0.6).css({
                                        'position': 'absolute',
                                        'top': '10%',
                                        'left': '10%',
                                        'background-color': '#000',
                                        'width': '78%',
                                        'border-radius': '5px',
                                        'resize': 'none',
                                        'z-index': 5001
                                    });
                                    console.log(textJson.result);
                                    var textContent=$("#result").text()+textJson.result;
                                    $("#result").text(textContent);
                                    $("#result").scrollTop($("#result")[0].scrollHeight);
                                    $("#resultDiv").children("span").on("click", function () {
                                        clearInterval(timeout);
                                        $("#resultDiv").hide();
                                    });
                                    if (textContent.indexOf("BUILD SUCCESS") > 0) {
                                        $("#sucessFlag").text("ok");
                                        clearInterval(timeout);
                                        $("#result").scrollTop();
                                    } else if (textContent.indexOf("[ERROR] [Help") > 0) {
                                        $("#sucessFlag").text("error");
                                        clearInterval(timeout);
                                        $("#result").scrollTop();
                                    }
                                } else {
                                    $("#resultDiv").height(docHeight).css({
                                        'opacity': 1,
                                        'position': 'absolute',
                                        'background-color': '#CCC',
                                        'top': '0',
                                        'left': '0',
                                        'width': '100%',
                                        'z-index': 5000
                                    }).show();
                                    $("#result").height(docHeight * 0.7).css({
                                        'position': 'absolute',
                                        'top': '10%',
                                        'left': '10%',
                                        'background-color': '#000',
                                        'width': '78%',
                                        'border-radius': '5px',
                                        'resize': 'none',
                                        'z-index': 5001
                                    });
                                    $("#result").text("The Result Is Creating,Please Hold On.....");
                                }
                            },
                            error: function (data) {
                                alert(data);
                                clearInterval(timeout);
                            }
                        });
                    },
                    500);

            } else {
                alert("没有相应的xml文件,请重新生成");
            }
        },
        error: function (data) {
            console.log(data);
        }

    });
}
//end execute function
//send deletexml start
function deletexml(timeout, xmlpath, txtpath,newIp,isSendMail,timestamp) {
    if ($("#result").text().indexOf("BUILD SUCCESS") > 0 || $("#result").text().indexOf("[ERROR] [Help") > 0) {
        $.ajax({
            url: "../caseplatform/deleteXml",
            type: "post",
            timeout: 20000,
            dataType:"text",
            data: $.param({
                "xmlPath": xmlpath/*$("#wfPath").text() + "/" + $("#wfName").text()*/,
                "txtPath": txtpath/*$("#path").text()*/,
                "newIp":newIp,
                "isSendMail":isSendMail,
                "userName": username,
                "flagTime":timestamp
            }),
            success: function (data) {
                if (data != "") {
                    $("#resultDiv").children("a").removeAttr("click");
                    $("#resultDiv").children("a").removeAttr("href");
                    $("#sucessFlag").text("error");

                }
            }
        });
        clearInterval(timeout);
    }
}
//send deletexml end


