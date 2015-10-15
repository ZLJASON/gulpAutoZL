/*
 * options:{
 *     url:
 *     method:
 *     data://请求数据
 *     beforeSend:请求前方法
 *     success:成功回调方法
 *     error:失败方法
 *     dataMethod:json,xml。默认为json
 * }
 */
function soapGetData(options) {
    if (options.dataMethod && options.dataMethod == "xml") {
        /*XML交互方式*/
        $.soap({
            url: options.url || '',
            method: options.methodName,
            data: options.data,
            prefix: false,
            namespaceQualifier: '',
            namespaceURL: 'http://mtest.xudc.com:8080/house',
            beforeSend: function (SOAPEnvelope) {
                options.beforeSend && options.beforeSend();
            },
            success: function (soapResponse) {
                var _data = soapResponse.toJSON();
                options.success && options.success(_data);
            },
            error: function (SOAPResponse) {
                options.error && options.error();
            }
        });
    } else {
        $.ajax({
            url: options.url || '',
            type: options.type,
            dataType: 'json',
            beforeSend: function () {
                options.beforeSend && options.beforeSend();
            },
            success: function (data) {
                options.success && options.success(data);
            },
            error: function (SOAPResponse) {
                options.error && options.error();
            }
        });
    }
}


/*
  显示消息
  opt{
    timeOutClose // 延迟关闭
    msg: 消息
    show: 显示还是隐藏
  }
 */
function showMsg(opt) {
    var msgDom = $("#msgDom");
    if (opt.show) {
        msgDom.removeClass("flipOutX").addClass("flipInX").show().html('<div class="msgCont">' + opt.msg + '</div>');
    } else {
        msgDom.removeClass("flipInX").addClass("flipOutX")
        setTimeout(function () {
            msgDom.hide();
        }, 200);
    }


    if (opt.timeOutClose) {
        opt.show = false,
            opt.timeOutClose = null;
        showMsg(opt);
    }
}

/*
  模板渲染
  id:模板的id
  data:模板的数据
 */
function tempFn(opt) {
    var _source = $("#" + opt.id).html();
    var _template = Handlebars.compile(_source);
    var _result = "";
    _result = _template(opt.data);
    return _result;
}

/*初始化Tab*/
function initTab(tabText) {
    var swiper = new Swiper('.tab-container', {
        pagination: '.lf-tab-indexCont',
        paginationClickable: true,
        paginationBulletRender: function (index, className) {
            return '<span class="' + className + ' lf-tab-indexItem">' + tabText[index] + '</span>';
        }
    });
    return swiper;
}

/*开发环境使用回去用户sessionid*/
//TODO 在正式环境中去掉
var JSESSIONID;
function requestSessionId() {

    var deferred = $.Deferred();
    soapGetData({
        dataMethod: "xml",
        url: 'http://mtest.xudc.com:8080/house/ws/organizationservice?wsdl',
        methodName: 'newMemberLogin',
        data: {
            username: 'lbg',
            password: '',
            uuid: '123321123321213',
            token: '',
            deviceType: ''
        },
        namespaceURL: 'http://mtest.xudc.com:8080/house',
        beforeSend: function () {

        },
        success: function (data) {
            // console.log("data", data);
            JSESSIONID = data.Body.newMemberLoginResponse.result.data.sessionId;
            deferred.resolve(JSESSIONID,data.Body.newMemberLoginResponse.result.data);
        },
        error: function () {

        }
    });
    return deferred.promise();
}

/*从URL上取参数*/
function QueryString(val){
    var uri = window.location.search;
    var re = new RegExp("" +val+ "=([^&?]*)", "ig");
    return ((uri.match(re))?decodeURIComponent(uri.match(re)[0].substr(val.length+1)):null);
}


/*跳转到内容页*/
function jumpPage(id,isText,linkUrl,type){
    console.log(id,isText,linkUrl,type)
    if(linkUrl!=""){
          changeIframSrc(1,linkUrl);
    }else{
      if(isText==1){            
          window.location.href="articleDetail.html?id="+id+"&isText="+isText+"&type="+type+"&sessionId="+_sessionId;
      }else{
          var _url="/house/backcontrol/information/article/html/"+id;
          changeIframSrc(1,_url);
      }
    }
}


/*修改ifram内容 type 1: URL地址*/
function changeIframSrc(type,src){
    var getIframeDocument = function(element) {
        return  element.contentDocument || element.contentWindow.document;
    };
    var _$iframePD=$("#iframeCont");
    var param={
      width:_$iframePD.width(),
      height:_$iframePD.height()
    };

    var iframeDom=document.getElementById("framecont");
    // 加载成功事件
    iframeDom.onload = function() {
        _$iframePD.show();
        iframeDom.width=param.width+"px";
        iframeDom.height=param.height+"px";
        iframeDom.style.overflow="auto";
    };
    var iframeDocument=getIframeDocument(iframeDom);
    if(type==1){
        iframeDom.src=src;
    }
}