// client/pages/suggestion/suggestion.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowConfirm: false ,
    suggestion: [
      {
        wrong: "不能打开小程序"
      },
      {
        wrong: "下载速度缓慢"
      },
      {
        wrong: "小程序与手机冲突"
      },
      {
        wrong: "其他问题"
      },
      {
        wrong: "给予反馈意见或建议"
      }
    ]
  },
  
  //意见选择
  sugChoose:function(event){
    var id = event.currentTarget.id;
    var sug = this.data.suggestion[id].wrong;
    if(id != 4){
      wx.showModal({
        title: '提示',
        content: '您选择了"' + sug + '"。相关问题提交后，我们会尽快处理，感谢您的反馈！',
        success: function (res) {
          if (res.confirm) {
            wx.showToast({
              title: '提交成功！'
            }),
              console.log('点击确定')
          }
        }
      })
    }
    else{
      var that = this;
      that.setData({
        isShowConfirm:true
      })
    }
    
  },

  /*弹窗部分*/
  giveSug: function (e) {
    console.log(e.detail.value)
  },
  cancel: function () {
    var that = this
    that.setData({
      isShowConfirm: false,
    })
  },
  confirmAcceptance: function () {
    var that = this
    that.setData({
      isShowConfirm: false,
    })
  }


})