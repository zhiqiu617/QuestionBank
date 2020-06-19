// client/pages/coursedetail/coursedetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     // 接收搜索的结果
    resultLists: [],             
    resulttick:false,
    inputValue: '',       // 输入的值
    course_name:'数据结构'
  },

  onLoad: function (options) {
    var id = options.course_id;
    try {
      var name = wx.getStorageSync('course');
      if(name){
        this.setData({
          course_name: name[id]
        })
      }
    } catch (e) {
      console.log(e);
    }
    
  },
  /**
   * 搜索框
   */
  searchInput: function (e) {
    var that = this;
    console.log(e);
      that.setData({
        inputValue: e.detail.value,
        resultLists: [],
        resulttick: true
      });
      console.log('bindInput---'+that.data.inputValue);
  },

  searchSubmit:function(){
    var that = this;
    if (that.data.inputValue.length > 0) {
      wx.request({
        url: 'http://localhost:8080/WeChatLink/WXservlet',
        data: {
          value: that.data.inputValue,   //用户输入的关键词
          methodname:'WXsearch'
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' //默认值
          //GET方式对应application/json;POST对应application/x-www-form-urlencoded
        },
        success: function (res) {
          var data = that.data.resultLists;  
          console.log('搜索返回值'+res.data)        
          if(res.data.length>0){
            for (let i = 0; i < res.data.length; i++) {
              data.push(res.data[i][1]);
            }
            that.setData({
              resultLists: data,
              resulttick: true
            })
            wx.setStorageSync('searchResult', res.data);
          }else{
            wx.showToast({
              title: '题库没有相关题目，请输入其他关键词查询！',
              icon:'none'
            })
          }                    
        },
        fail: function (res) {
          console.log('数据请求失败！');
        }
      })
    }
    //this.valueShow();
  },
  
  /**
   * 返回搜索内容后渲染页面显示
   */
  // valueShow:function(){
  //   try {
  //     var result = wx.getStorageSync('questions');
  //     var list = new Array();
  //     for (var i = 0; i < result.length; i++) {
  //       list.push(result[i][1]);
  //     }
  //     if (result) {
  //       this.setData({
  //         resultLists: list,
  //         resulttick: true
  //       })
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }

  // },

  /**
   * 前往问题详情页面
   */
  gotoDetail:function(e){
    wx.navigateTo({
      url: '../searchdetail/searchdetail?id='+e.currentTarget.id,
    })  
  },

  /**
   * 监听软键盘确认键
   */
  wxSearchConfirm: function (e) {

  }
})