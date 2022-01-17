"ui";
ui.layout(
    <scroll>
        <vertical>
            <appbar>
                <toolbar title="得物截图助手" />
            </appbar>
            <vertical h="auto" w="*">
                <card w="*" margin="10 5" h="50" cardCornerRadius="2dp" cardElevation="1dp" gravity="center_vertical">
                    <radiogroup mariginTop="16" paddingLeft="20" >
                        <horizontal>
                            <Switch id="autoService" text="无障碍服务" checked="{{auto.service != null}}" />
                            <text textSize="16sp" textColor="black" text="     " />
                            <Switch id="overlayService" text="悬浮窗权限" checked="{{auto.service != null}}" w="auto" textStyle="bold" />
                        </horizontal>
                    </radiogroup>
                    <View bg="#f44336" h="auto" w="10" />
                </card>
                {/* <card w="*" margin="10 5" h="*" cardCornerRadius="2dp" cardElevation="1dp" gravity="center_vertical">
                    <radiogroup mariginTop="16" paddingLeft="20" >
                        <horizontal>
                            <text textSize="16sp" textColor="black" text="关键词" />
                            <input id="spk1" text="" hint="请输入索引关键词" />
                            <text textSize="16sp" textColor="black" text="      " />
                        </horizontal>
                    </radiogroup>
                    <View bg="#98FB98" h="auto" w="10" />
                </card> */}
                <button id="bt" text="开始运行" />
            </vertical>
        </vertical>
    </scroll>
);




var search_goal = ""
const targetUrl="http://192.168.0.104:3000";
var 本地存储 = storages.create("qwqiweu121")
// var speak_1 = 本地存储.get("speak_1")
// if (speak_1) {
//     ui.spk1.setText(speak_1)
//     speak_1 = ui.spk1.text()
// } else {
//     speak_1 = ui.spk1.text()
// }


//无障碍跳转
ui.autoService.on("check", function (checked) {
    // 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
    if (checked && auto.service == null) {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    }
    if (!checked && auto.service != null) {
        auto.service.disableSelf();
    }
});


//悬浮窗跳转
ui.overlayService.on("check", function (checked) {
    // 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
    if (checked) {
        try {
            int = app.startActivity({
                packageName: "com.android.settings",
                className: "com.android.settings.Settings$AppDrawOverlaySettingsActivity",
                data: "package:" + context.getPackageName().toString()
            });
        } catch (err) {
            app.openAppSetting(currentPackage() + "");
        }
        toast("请打开悬浮窗开关");
    }

    if (!checked && auto.service != null) {
        //auto.service.disableSelf();
        toast("已关闭悬浮窗权限");
    }
});



threads.start(function () {
    //在新线程执行的代码
    //请求截图
    if (!requestScreenCapture()) {
        toastLog("请求截图失败");
        exit();
    } else {
        toastLog("请求截图成功");
    }
});





ui.bt.click(function () {
    if (auto.service == null) {
        toast("请开启无障碍服务")
        return;
    } else {
        // speak_1 = ui.spk1.getText() + ""
        // var speak_11 = speak_1 + ""
        // 本地存储.put("speak_1", speak_11)
        // arr_word = speak_1.split("\n")

        threads.start(主程序2);
    }
})






function 主程序2(){
    console.show()
    app.launchPackage("com.shizhuang.duapp")
    let arr_word = [];
    let i=0;
    let count=0;
    while(true){
      if(i > arr_word.length-1){
        console.log("尝试获取新的产品序列...");
        arr_word = http.get(targetUrl+"?count="+count).body.json();
        if(arr_word.length===0){
          console.log("已经全部截取完毕，脚本停止");
          exit();
        }
        console.log("获取到新的"+arr_word.length+"条数据，开始执行～");
        i=0;
        count++;
      } 
      search_goal = arr_word[i]
      i++
      search_word()
      check_msg()
      toast(search_goal +"处理完毕")
      back_toserch()
        
    }
}




function search_word(){
    var ch = id("etSearch").findOne()
    Click(ch)
    setText(search_goal)
    console.log(search_goal);
    sleep(500)
    click(1050, 2180)
    // log(device.width,device.height)
}


function back_toserch(){
    var cl = id("closeIcon").findOne()
    console.log("开始返回");
    Click(cl)
    var bk = id('homeAsUpBtn').findOne()
    console.log("返回搜索");
    Click(bk)
    var it  = id("searchTextView").findOne()
    Click(it)

}



function check_msg() {
    var shop = id("itemTitle").findOne()
    Click(shop)
    id("shareButton").findOne()
    console.log("到达分享页面");
    var bu = id("buyButton").clickable(true).findOne()
    Click(bu)
    console.log("点击购买");
    // id("tvPrice").textContains("¥").findOne()
    console.log("等待0.5s，开始截图");
    console.hide()

    sleep(300)
    var img = captureScreen();
      http.post(targetUrl+"/saveImg", {
        name:search_goal,
        img:images.toBase64(img,"jpg",30)
      });
    console.show()
    console.warn("截图完毕");


}



function Click(node) {
    try {
        if (node) {
            if (node.click()) {
                return true
            } else if (node.parent().click()) {
                return true
            } else if (node.parent().parent().click()) {
                return true
            } else if (node.parent().parent().parent().click()) {
                return true
            } else if (node.parent().parent().parent().parent().click()) {
                return true
            } else if (node.parent().parent().parent().parent().parent().click()) {
                return true
            } else if (node.parent().parent().parent().parent().parent().parent().click()) {
                return true
            }
        }
    } catch (e) { }
    return false
}
