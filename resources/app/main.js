//引入依赖
const {app, BrowserWindow,ipcMain,Menu,Tray,globalShortcut} = require('electron');
const path = require('path');
//热更新
require('update-electron-app')({});
//
let mainWindow,homeWindow;//注册路由
let tray = null;//注册托盘菜单
var isShow = 1;
function createWindow () {
  mainWindow = new BrowserWindow({width: 430, height: 340,frame: false});
  mainWindow.webContents.openDevTools();//debug调试
  mainWindow.loadFile('src/index.html');
  //界面退出触发
  mainWindow.on('closed', function () {
    mainWindow = null
  });
}
//创建系统托盘
function createtray(){
  //系统托盘
  var trayMenuTemplate = [
    {
      label: '显示/隐藏',
      click: function () {
        if(isShow == 0){
          homeWindow.show();
          isShow = 1
        }else{
          homeWindow.hide();
          isShow = 0
        }
      }
    },
    {
      label: '退出程序',
      click: function () {
        homeWindow.close()
      }
    }
  ];
  //系统托盘图标目录
  var trayIcon = path.join(__dirname, 'img');
  tray = new Tray(path.join(trayIcon, 'history.png'));
  //tray = new Tray('/img/history.png');
  //图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
  //设置此托盘图标的悬停提示内容
  tray.setToolTip('This is my application.');
  //设置此图标的上下文菜单
  tray.setContextMenu(contextMenu);
}
//界面加载
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});
//////////////////////////////////////////////ipcMain 通信用于操作界面动作
//关闭登录窗口
ipcMain.on('close',function(){
  mainWindow.close()
});
//最大化
ipcMain.on('window-max',function(){
  if(mainWindow.isMaximized()){
    mainWindow.restore();
  }else{
    mainWindow.maximize();
  }
});
//最小化
ipcMain.on('window-min',function(){
  mainWindow.minimize();
});
//切换主界面
ipcMain.on('locahref',function(){
  //创建新窗口
  homeWindow = new BrowserWindow({width: 640, height: 580,frame: false});
  homeWindow.webContents.openDevTools();//debug调试
  homeWindow.loadFile('src/home.html');
  createtray();
  //关闭旧窗口
  mainWindow.close();
  //mainWindow.hide();
});
//注销
ipcMain.on('reload',function(){
  mainWindow = new BrowserWindow({width: 430, height: 340,frame: false});
  mainWindow.webContents.openDevTools();//debug调试
  mainWindow.loadFile('src/index.html');
  //mainWindow.show();
  tray.destroy();
  homeWindow.close();
});
//主界面退出
ipcMain.on('homeclose',function(){
  homeWindow.close()
});
//主界面隐藏
ipcMain.on('homehide',function(){
  if(isShow == 0){
    homeWindow.show();
    isShow = 1
  }else{
    homeWindow.hide();
    isShow = 0
  }
});
//初始化快捷键
ipcMain.on('loadShortcut',function(e,data){
  //收款
  globalShortcut.register(data[0],function(){
    homeWindow.webContents.send('main-kuajie',0);
  });
  //流水交易
  globalShortcut.register(data[1],function(){
    homeWindow.webContents.send('main-kuajie',1);
  });
  //设置功能
  globalShortcut.register(data[2],function(){
    homeWindow.webContents.send('main-kuajie',2);
  });
  //快捷功能
  globalShortcut.register(data[3],function(){
    homeWindow.webContents.send('main-kuajie',3);
  });
});