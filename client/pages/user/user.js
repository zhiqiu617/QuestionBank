// client/pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  gotoUserknow(){
    wx.navigateTo({
      url: '../userknow/userknow',
    })
  },
  gotoSendmail() {
    wx.navigateTo({
      url: '../suggestion/suggestion',
    })
  },
  gotoAbout() {
    wx.navigateTo({
      url: '../about/about',
    })
  }
  
  


  

  
})