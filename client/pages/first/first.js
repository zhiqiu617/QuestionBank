// client/pages/first/first.js
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseShow: [
      '数据结构',
      '数据库',
      '马克思主义基本原理概论',
      'Java程序设计'
    ]
    
  },

  //生命周期函数--监听页面加载
   
  onLoad: function (options) {
    var coursename = ['数据结构','数据库','马克思主义基本原理概论','Java程序设计'];
    wx.setStorage({
      key: 'course',
      data: coursename,
    })
     
  },

  /**
   * 查看课程详情
   */
  courseChoice:function(event){
    var course_id = event.currentTarget.id;
    wx.navigateTo({
      url: '../../pages/coursedetail/coursedetail?course_id='+course_id,
    })
  }
})