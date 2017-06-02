/**
 * @author:wky
 * @time:2016/11/24
 * 主要作用就是将get请求转换成post请求
 * formObj={
 *   action:"",form需要的action标签内容
 *   method:"",form提交方式
 *   inputParams:[{
 *       inputName:"",
 *       inputValue:""
 *   }] 必须以数组的形式存储
 * }
 * return form
 */

function BaseMethod() {
}
//表单提交转换
//简化
BaseMethod.prototype = {
    aChangeForm:function (formObj) {
        var formn = $("<form></form>");
        formn.attr("action", formObj.action);
        formn.attr("method", formObj.method);
        if (formObj.inputParams.length > 0) {
            for (var i = 0; i < formObj.inputParams.length; i++) {
                var input = $("<input type='hidden' name='" + formObj.inputParams[i].inputName + "' />");
                input.attr("value", formObj.inputParams[i].inputValue);
                formn.append(input);
            }
        } else {
            throw new Error("没有实际给出模拟表单的元素值");
        }
        formn.appendTo("body");
        formn.css('display', 'none');
        return formn;
    },
    //隐藏xmldiv
    hideXmlBacDiv: function () {
        $("#resultDiv").hide();
    }
    //定义弹窗

}
var aChangeFormObj = new BaseMethod();
$(document).ready(function () {
    //start show report
    $("#resultDiv").children("a").bind("click", function () {
        var successFlag = $("#sucessFlag");
        if (successFlag.text() == "ok") {
            var fromObj = {
                action: "../caseplatform/report",
                method: "post",
                inputParams: [
                    {
                        inputName: "xmlPath",
                        inputValue: $("#wfPath").text() + "/" + $("#wfName").text()
                    }, {
                        inputName: "txtPath",
                        inputValue: $("#path").text()
                    }, {
                        inputName: "userName",
                        inputValue: username
                    }
                ]
            };
            var form = aChangeFormObj.aChangeForm(fromObj);
            form.submit();

        } else if (successFlag.text() == "error") {
            $("#result").scrollTop();
            alert("没有成功生成报告，请检查");
        } else {
            alert("用例还没有执行成功,please hold on");
        }
    });
    //end show report
});
