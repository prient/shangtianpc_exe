/**
 * Created by Administrator on 2018/6/22 0022.
 */
var isShowWindow = true;
var gui = require('nw.gui');
var win = gui.Window.get();
var tray = new gui.Tray({
    title:'My Application',
    icon:'/img/history.png'
});
tray.tooltip = "点击打开测试测试";
win.on('close',function(){
    this.hide();
    isShowWindow = false;
})
//添加菜单
var menu = new gui.Menu();
menu.append(new gui.MenuItem({
    type:'normal',
    label:'显示/隐藏',
    click:function(){
        if(isShowWindow){
            win.hide();
            isShowWindow = false;
        }else{
            win.show();
            isShowWindow = true;
        }
    }
}));
menu.append(new gui.MenuItem({
    type:'normal',
    label:'退出',
    click:function(){
        win.close(true);
    }
}));
tray.menu = menu;
tray.on('click',function(){
    if(isShowWindow){
        win.hide();
        isShowWindow = false;
    }else{
        win.show();
        isShowWindow = true;
    }
})