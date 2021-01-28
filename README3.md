# 说明

## 1、所需工具
Hbuilder (2.8.13)   AndroidStudio    Xcode

## 2、关于项目
### （1）项目地址
https://github.com/ThinkiumGroup/Twallet.git
### （2）项目目录
![项目目录](https://thinkium-data.s3-us-west-2.amazonaws.com/twallet-chn.png "项目目录")
## 3、启动
### （1） h5启动
- 将项目导入到Hbuilder。
- 在左侧文件目录上选中项目中的任意文件。
- 菜单栏选中 运行 -> 运行到浏览器 -> 选择电脑中安装的浏览器。
- 等待编译器编译（如果浏览器没自动打开，请在HBuilder控制台上查看 ‘App running at:’, 有标明项目启动的域名和端口)。

### （2） android/iOS启动
- 数据线连上手机，或电脑启动手机模拟器
- 菜单栏选中 运行 -> 运行到手机或模拟器->选择启动的手机或模拟器

### （3）配置请求域名和端口
#### 相关文件位置 Twallet-app/utils/host.js
#### 配置数据请求域名
- 默认： 测试环境域名+端口
- 方式1：在storage里设置 key:'baseUrl', value: 你的域名+接口，使用方法uni.getStorageSync('baseUrl', 你的域名+端口);
- 方式2：在storage里设置 key:'env', value: 'dev'/'pro',（dev:测试环境，pro:正式环境）
- 方式3：如果是h5，通过网页的域名和端口来匹配测试或者正式环境域名
- 方式4：如果是h5，并且方式3没有匹配到配置的域名，那么会自动获取网页配置的域名和端口，来进行接口的调用
#### 配置rpc域名
- 默认： 测试环境rpc
- 方式1：在storage里设置 key:'rpcUrl', value: 你的rpc，使用方法uni.getStorageSync('rpcUrl', 你的域名+端口);
- 方式2：在storage里设置 key:'env', value: 'dev'/'pro',（dev:测试环境，pro:正式环境）；
- 方式3：如果是h5，通过网页的域名和端口来匹配测试或者正式环境域名rpc

### （4）配置国际化
#### 文件位置Framework/language
- 文件夹中包含的 获取 系统语言的方法，英、日、韩三国语言
- 全局配置了$lan方法，在vue页面和组件上通过 this.$lan(text) 方法进行语言翻译的调用，模板里直接使用$lan(text) 
## 4、打包
### （1）android
- 下载 AndroidStudio
- 下载 android 打包基座   https://thinkium-data.s3-us-west-2.amazonaws.com/Twallet-android.zip
#### HBuilder中的操作
- HBuilder中获取uni-app的AppID       位置manifest.json中的基础配置，点击重新获取，获取一次之后，之后的AppID 可以不用再次获取。
- HBuilder菜单栏选中  发行-> 原生APP-本地打包 -> 生成本地打包APP资源-> 等待打包->控制台点击生成APP资源的本地链接。
#### AndroidStudio中的操作
- 导入android的打包基座。
- 更改项目中的AppID， 文件位置  app/src/main/assets/data/dcloud_control.xml ,将其中的id 更改为hbuilder中获得的appid。
-  app/src/main/assets/apps 下的文件夹替换为 在HBuilder中 打包的app资源。
- 更改包名和app名称 需在打包基座中进行设置。
- 菜单栏选中 Build->Build Bundle(s)/APK(s) -> Build APK(s)。
- 等待打包结果，点击Event  Log下的  ‘ locate’,  文件 app-debug.apk，即为打包结果，可以发到android手机进行安装。

### （2）IOS
- 下载 Xcode
- 下载 iOS 打包基座  https://thinkium-data.s3-us-west-2.amazonaws.com/Twallet-iOS.zip
#### HBuilder中的操作
- HBuilder中获取uni-app的AppID       位置manifest.json中的基础配置，点击重新获取，获取一次之后，之后的AppID 可以不用再次获取
- HBuilder菜单栏选中  发行-> 原生APP-本地打包 -> 生成本地打包APP资源-> 等待打包->控制台点击生成APP资源的本地链接
#### xCode中的操作
- 双击文件Twallet.xcodeproj ，即可在xCode中导入iOS的打包基座
- 配置Xcode 项目私钥
- 更改项目中的AppID， 文件位置HBuilder-Hello/pandora/Supporting Files/control.xml ,将其中的appid 更改为HBuilder中获得的AppID
- HBuilder-Hello/pandora/apps  下的文件夹替换为 在HBuilder中 打包的app资源
- Xcode 选中Generic IOS Device ，菜单栏选中Product->archive等待打包。
- 弹出对话框中 选中刚刚打包的文件，依次点击  Distribute APP->  Ad Hoc -> next  一直next，输入密码，即可导出ipa文件
