// client/pages/searchdetail/searchdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    turl: '../image/right1.png',
    furl: '../image/wrong1.png',
    nurl: '../image/none1.png',
    ques_show: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var qid = options.id;
    try {
      var result = wx.getStorageSync('searchResult');
      var ques = new Array();
      ques = result[qid];
      console.log('结果缓存输出'+ques);
    } catch (e) {
      console.log(e);
    }    
    
    var that = this;
    let ques_show = this.data.ques_show;
    //循环赋值给obj
      var obj = {};
      var y = parseInt(ques[6]) - 1;
      var c = ques[7] - 1;
      obj.quesid = 1;
      obj.question = ques[1];
      obj.collectStatus = false;     //是否收藏
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
        sobj.value = ques[j + 2];
        se.push(sobj);
      }
      obj.selection = se;
      ques_show.push(obj);  //一个一个obj放入
    
    that.setData({
      ques_show: ques_show   //取名一致
    })
    console.log(that.data.ques_show);
  }

 
})