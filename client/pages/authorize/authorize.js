// pages/authorize/authorize.js
const app = getApp();
//var qcloud = require('../../vendor/wafer2-client-sdk/index');
var util = require('../../utils/util.js');
var api = require('../../configs/api.js')

Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userName:'',
    userPic:'',
  },

  onLoad: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {                
              console.log(res.userInfo);
              console.log('获取信息'); 
              //插入缓存
              wx.setStorage({
                key:'username',
                data: res.userInfo.nickName
              });                  
              //用户已经授权过
              wx.switchTab({
                url: '/pages/course/course'
              })
            }
          });
        }
      }
    })
  },
  
  bindGetUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      app.globalData.userInfo = e.detail.userInfo;
      console.log(app.globalData.userInfo);
      that.setData({
        userName: e.detail.userInfo.nickName,
        userPic: e.detail.userInfo.avatarUrl
      });
      
      //插入缓存
      wx.setStorage({
        key: 'username',
        data: that.data.userName
      });

      // 插入登录的用户的相关信息到数据库
      // that.insertUserInfo(e);

    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '提示',
        content: '您点击了拒绝授权，将无法进入小程序，请点击授权以便我们提供更好的服务。',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  
  //保存用户信息
  insertUserInfo: function (res) {
    console.log(8888);
    var data = {
      openid: app.globalData.openid,
      nickName: res.detail.userInfo.nickName,
      avatarUrl: res.detail.userInfo.avatarUrl
    };

    util.request(api.UserAdd, data, 'POST').then(function (res) {
      if (res.code === 0) {
        console.log("小程序登录用户信息成功！");

        //授权成功后，跳转进入小程序首页(正式环境应该在这里)
        wx.switchTab({
          url: '/pages/course/course'
        })
      } else {
        that.insertUserInfo(data);
      }
    })
  },
  
  //获取用户信息接口
  queryUersInfo: function () {
    console.log(9999);
    util.request(api.AuthUserInfo, { openid: app.globalData.openid }).then(function (res) {
      if (res.code === 0) {
        app.globalData.userInfo = res.data;
      }
    })
  }

  
})