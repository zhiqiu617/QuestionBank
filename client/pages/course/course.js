// client/pages/course/course.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myCourse: [
      '数据结构',
      '数据库',
      '马克思主义基本原理概论',
      'Java程序设计'
    ],
    icon: [
      'like.png',
      'fault.png',
      'add.png',
      'check.png',
      'email.png',
      'main.png',
      'menu.png',
      'menu.png',
      'share.png',
      'sub.png'
    ],
    bookIcon: [
      'book1.png',
      'book2.png',
      'book3.png',
      'book4.png',
      'book5.png',
      'book6.png',
      'book7.png',
      'book8.png',
      'book9.png',
    ],
    src: '../image/'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo);
              console.log('course获取信息');
              //插入缓存
              wx.setStorage({
                key: 'username',
                data: res.userInfo.nickName
              })
            }
          })
        }
      }
    })
  },

  gotoExercise:function(e){
    var id = e.currentTarget.id;
    var pattern = 'exer';
    var qid = 0;   //注明第几题
    console.log(id);
    wx.navigateTo({
      url: '../test/test?id=' + id + '&pattern=' + pattern + '&qid=' + qid,
    })
  },
  gotoExam:function(e) {
    var id = e.currentTarget.id;
    var pattern = 'exam';
    var qid = 0;   //注明第几题
    wx.navigateTo({
      url: '../test/test?id=' + id + '&pattern=' + pattern + '&qid=' + qid,
    })
  },
  gotoSearch: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../coursedetail/coursedetail?id='+id,
    })
  },
  collect:function(e){
    wx.navigateTo({
      url: '../collect/collect',
    })
  },
  wrongList:function(e){
    wx.navigateTo({
      url: '../collect/collect',
    })
  }
  
})