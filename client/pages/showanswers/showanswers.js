// client/pages/showanswers/showanswers.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    turl:'../image/right1.png',
    furl: '../image/wrong1.png',
    nurl: '../image/none1.png',
    ques_show: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      var ques = wx.getStorageSync('questions');
      console.log(ques);
    } catch (e) {
      console.log(e);
    }

    var that = this;
    let ques_show = this.data.ques_show;
    //循环赋值给obj
    for (var i = 0; i < ques.length; i++) {
      var obj = {};
      var y = parseInt(ques[i][6]) - 1;
      var c = ques[i][7] -1;
      obj.quesid = i;
      obj.question = ques[i][1];  
      obj.collectStatus = false;     //是否收藏
      //处理selection
      let se = new Array();
      for(var j=0; j<4; j++){
        var sobj = {};
        sobj.name = 'answ'+j; 
        if(j == y){      //分类设置图标路径
          sobj.type = that.data.turl; 
        } else if (j == c && y == c) {
          sobj.type = that.data.turl;
        } else if (j == c && y != c){
          sobj.type = that.data.furl; 
        } else if (j != y && j != c){
          sobj.type = that.data.nurl; 
        }
        if(j==0){
          sobj.count = 'A.';
        } else if(j==1){
          sobj.count = 'B.';
        } else if(j==2){
          sobj.count = 'C.';
        } else if(j==3){
          sobj.count = 'D.';
        }  else{
          console.log('count设置出错');
        }                 
        sobj.value = ques[i][j+2];
        se.push(sobj);
      }
      obj.selection = se;
      ques_show.push(obj);  //一个一个obj放入
    }  
    that.setData({
      ques_show: ques_show   //取名一致
    })
    console.log(that.data.ques_show);
    this.faultStorage();
  } ,

  /**
   * 收藏功能
   */
  onCollectTap: function (e) {
    var that = this;
    var card = e.currentTarget.id;
    var stringSet = 'ques_show[' + card + '].collectStatus';
    //取消收藏
    if (this.data.ques_show[card].collectStatus) {
      that.setData({
        [stringSet]: false
      });      
    }
    //添加为收藏
    else {
      that.setData({
        [stringSet]: true
      })
    }    
    wx.showToast({
      title: this.data.ques_show[card].collectStatus ? "收藏成功" : "收藏取消",
      duration: 1000,
      icon: "sucess",
      make: true
    })
    console.log('card' +card+':'+this.data.ques_show[card].collectStatus);
    this.collectStorage(card);
    
  },

  /**
   * 收藏放入缓存
   */
  collectStorage: function (card) {
    try{
      var ques = wx.getStorageSync('questions');
      var arr = wx.getStorageSync('collection');
    }catch (e){
      console.log(e);
    }
   var sta = new Array();
   if(arr){
     sta = arr;
   }
   console.log(sta);
    if(card>=0 && card<ques.length){
      var id = ques[card][0];
      if(this.data.ques_show[card].collectStatus){          //增加收藏时
        if (sta.length>0){
          for(var i=0; i<sta.length; i++){
            if(id == sta[i][0]){
              console.log('收藏已有该题');
              return;
            }
          }
          sta.push(ques[card]); 
        }else{
          sta.push(ques[card]); 
          console.log(ques[card]);
        }                 
      }else{                       //取消收藏时
        for (var i = 0; i < sta.length; i++) {
          if (id == sta[i][0]) {
            sta.splice(i,1);      //删除第i个元素
            console.log('删除该题');
            break;
          }
        }
      }
      console.log(sta);
      wx.setStorageSync('collection', sta);
    }    
  },

  /**
   * 错题放入缓存
   */
  faultStorage:function(){
    try{
      var ques = wx.getStorageSync('questions');
    }catch(e){
      console.log(e);
    }
    var fa = new Array();
    for(var i=0; i<ques.length; i++){
      var y = parseInt(ques[i][6]);
      var c = ques[i][7];
      if(y != c){
        fa.push(ques[i]);
      }
      console.log('错题集生成');
    }
    wx.setStorageSync('faultCollection', fa);    
  },

  /**
   * 跳转页面
   */
  gotoCollection:function(){
    wx.redirectTo({
      url: '../collect/collect',
    })
  }




  
})