// client/pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    turl: '../image/right1.png',
    furl: '../image/wrong1.png',
    nurl: '../image/none1.png',
    nav: [ { title: "收藏", id: 0 },
           { title: "错题", id: 1 } ],
    curNav: 0,
    curIndex: 0,
    swipeCard:[
      { cardid: 0, ques_show:[] },     //收藏
      { cardid: 1, ques_show:[] }      //错题
    ],
    vertical: false,
    autoplay: false,
    currentSwiper: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageSetting(0);
    this.pageSetting(1);
    console.log('现data：\n' + this.data.swipeCard[1]);
  },
  
  /**
   * 页面渲染
   */
  pageSetting:function(ca){    
    try {
      var carr = wx.getStorageSync('collection');
      var farr = wx.getStorageSync('faultCollection');
    } catch (e) {
      console.log(e);
    }
    console.log(ca);
    var ques = new Array();
    var checked = false;
    var that = this;
    let ques_show = this.data.swipeCard[ca].ques_show;

    if(ca == 0){
      ques = carr;
      checked = true;
    }else if(ca == 1){
      ques = farr;
      checked = false;
    }
    
    //循环赋值给obj
    for (var i = 0; i < ques.length; i++) {
      var obj = {};
      var y = parseInt(ques[i][6]) - 1;
      var c = ques[i][7] - 1;
      obj.quesid = i;
      obj.question = ques[i][1];
      obj.collectionStatus = checked;     //是否收藏
      //处理selection
      let se = new Array();
      for (var j = 0; j < 4; j++) {
        var sobj = {};
        sobj.name = 'answ' + j;
        if (j == y) {      //分类设置图标路径
          sobj.type = that.data.turl;
        } else if (j == c && y == c) {
          sobj.type = that.data.turl;
        } else if (j == c && y != c) {
          sobj.type = that.data.furl;
        } else if (j != y && j != c) {
          sobj.type = that.data.nurl;
        }
        if (j == 0) {
          sobj.count = 'A.';
        } else if (j == 1) {
          sobj.count = 'B.';
        } else if (j == 2) {
          sobj.count = 'C.';
        } else if (j == 3) {
          sobj.count = 'D.';
        } else {
          console.log('count设置出错');
        }
        sobj.value = ques[i][j + 2];
        se.push(sobj);
      }
      obj.selection = se;
      ques_show.push(obj);  //一个一个obj放入
    }
    var s = 'swipeCard['+ca+'].ques_show';
    that.setData({
      [s]: ques_show  
    })
    console.log(that.data.swipeCard[ca]);
  },
  
  /**
   * 顶部tab
   */
  navTap(e) {
    let id = e.currentTarget.dataset.id;
    console.log(id);
    this.setData({
      curNav: id,
      curIndex: id,
      currentSwiper:0
    })
  },
  /**
   * 收藏功能
   */
  onCollectionTap:function(e){
    var that = this;
    var change = false;
    var card = e.currentTarget.id;
    var stringSet = 'swipeCard['+card+'].collectionStatus';
    //取消收藏
    if(this.data.swipeCard[card].collectionStatus){
      that.setData({
        [stringSet]: change
      });
    }
    //添加为收藏
    else{
      change = !change;
      that.setData({
        [stringSet]: change
      })
    }
    wx.showToast({
      title: this.data.swipeCard[card].collectionStatus ? "收藏成功" : "收藏取消",
      duration: 1000,
      icon: "sucess",
      make: true
    })
    console.log(this.data.swipeCard[card].collectionStatus);
    console.log(card)
  },

  /**
   * 滑块
   */
  swiperChange: function (e) {
    var that = this;
    that.setData({
      currentSwiper: e.detail.current
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    try {
      var carr = wx.getStorageSync('collection');
      var farr = wx.getStorageSync('faultCollection');
    } catch (e) {
      console.log(e);
    }
    console.log(carr + "\n" + farr);
    wx.request({
      url: 'http://localhost:8080/WeChatLink/WXservlet',  //本地服务器地址
      method: 'GET',
      header: {
        'content-type': 'application/json' //默认值
      },
      data: {
        facollect:farr,
        collect:carr,
        methodname: 'WXcollect'
      },      
      success: function (res) {
        console.log("---收藏结果---");
        console.log(res.data);
      },
      fail: function (res) {
        console.log("失败");
      }
    })
  }
})