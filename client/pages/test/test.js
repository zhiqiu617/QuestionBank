// client/pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    quesid:0,
    thelast:true,
    question: '问题一',
    selection: [
      { name: 'answ1', checked: false, count: 'A.', value: '选项一' },
      { name: 'answ2', checked: false, count: 'B.', value: '选项二' },
      { name: 'answ3', checked: false, count: 'C.', value: '选项三' },
      { name: 'answ4', checked: false, count: 'D.', value: '选项四' }
    ],
    select:4,
    tp:true,  //表明是考试
    countDownNum:600,  //定时器
    timer:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var testpattern = options.pattern;
    //var qid = options.qid;  //注明第几题
    var that = this;
    if(testpattern == 'exam'){
      that.setData({
        quesid: parseInt(options.qid),
        tp:true
      })
      that.countDown();
    }else{
      that.setData({
        quesid: parseInt(options.qid),
        tp:false
      })
    }
    
    try {
      var name = wx.getStorageSync('username');
    } catch (e) {
      console.log(e);
    }
    wx.request({
      url: 'http://localhost:8080/WeChatLink/WXservlet',  //本地服务器地址
      data: {
        username: name,
        courseid:id,
        pattern:testpattern,
        methodname:'WXexam'
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' //默认值
        //GET方式对应application/json;POST对应application/x-www-form-urlencoded
      },
      success: function (res) {
        console.log("获取数据成功!");
        console.log(res.data);
        //存入缓存
        that.storageSet(res.data);
        //渲染页面
        that.pageSetting(res.data);
      },
      fail: function (res) {
        console.log("失败");
      }
    })
  },

  //初次存入缓存
  storageSet:function(e){
    var arr = new Array();
    arr = e;
    wx.setStorageSync('questions', arr);
    console.log('storageSet');
  },
  
  //添加用户选择的选项进入缓存
  storageAdd:function(se){
    var i = this.data.quesid;
    var s = parseInt(se);
    try {
      var arr = wx.getStorageSync('questions');      
      if(se){
        arr[i][7] = s + 1;
      }
    } catch (e) {
      console.log(e);
    }  
    wx.setStorageSync('questions', arr);
    console.log('storageSet');
  },

  //回溯上一题
  preQues: function () {
    var that = this;
    var tick = 4;
    try{
      var ques = wx.getStorageSync('questions');      
      console.log('last,choice'+tick);      
    }catch(e){
      console.log(e);
    }    
    if (that.data.quesid > 0) {      
      if (that.data.quesid == ques.length - 1) {   //最后一题，改变按钮
        that.setData({
          thelast: true
        })
      }
      this.setData({
        quesid: that.data.quesid - 1      //将题目id减1，重新渲染页面
      });
      that.pageSetting(ques);
    }        
    console.log('pre');
  },

  //转到下一题
  nextQues: function () {
    var that = this;
    try {
      var ques = wx.getStorageSync('questions');
    } catch (e) {
      console.log(e);
    }     
    if (that.data.select == 4) {
      wx.showToast({
        title: '该题还未选择选项！',
        icon: 'none'
      })
    }
    //检查是否为最后一题
    if (that.data.quesid < ques.length) {
      if(that.data.select < 4){
        var ch = "selection[" + that.data.select + "].checked";
        that.setData({
          [ch]:true
        });
        that.storageAdd(that.data.select);
      }
      that.setData({
        quesid: that.data.quesid + 1,
        select: 4
      }) 
      if (that.data.quesid == ques.length - 1) {   //最后一题，改变按钮
        that.setData({
          thelast: false
        })
      } 
      that.pageSetting(ques);  
      
        
    }    
    
    console.log('next');
  },

  //渲染页面
  pageSetting:function(e){
    var that = this;
    var arr = new Array();
    var ans = new Array();
    arr = e;
    var j = 0;
    var s1 = '';
    var s2 = '';
    var qid = that.data.quesid;
    that.setData({
      question: arr[qid][1]
    })
    for(var i=0;i<4;i++){
      j = i + 2;
      ans[j] = arr[qid][j];
      s1 = "selection[" + i + "].value";  //把(selection[i].value)用字符串拼接起来
      that.setData({
        [s1]: ans[j]
      })
      if(!arr[qid][7]){    //若题目没选择，设置checked
        s2 = "selection[" + i + "].checked";
        that.setData({
          [s2]: false
        })
      }      
    }  
    if(arr[qid][7]){      //若缓存存有选择，则将对应选项设为已选
      var c = arr[qid][7] - 1;
      var s3 = "selection[" + c + "].checked";
      that.setData({
        [s3]:true
      })
    }  
  },

  //获取用户选取的选项
  selectAnswer:function(e){
    var se_id = e.currentTarget.id;
    console.log('select'+se_id);
    var that = this;
    that.setData({
      select:se_id
    })
  },

  //提交答案
  quesSubmit:function(){
    var that = this;
    that.storageAdd(that.data.select);
    var ch = false;
    try {
      var ques = wx.getStorageSync('questions');
    } catch (e) {
      console.log(e);
    }
          
    for (var i = 0; i < ques.length; i++) {
      if (!ques[i][7]) {    //若题目没选择
        ch = false;
      }else{
        ch = true;
      }
    } 
    if(ch){
      wx.redirectTo({
        url: '../showanswers/showanswers',
        success: function (res) { 
          console.log('跳转展示')
        },
        fail: function (res) {
          console.log('跳转失败')
        }
      })
    }else{
      wx.showToast({
        title: '请注意回看检查题目,您还未完成作答！',
        icon:'none'
      })
    }
  },

  /**
   * 考试页面倒计时
   */
  countDown: function () {
    let that = this;
    let countDownNum = that.data.countDownNum;//获取倒计时初始值
    that.setData({
      timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        //然后把countDownNum存进data
        that.setData({
          countDownNum: countDownNum
        })
        if (countDownNum == 0) {
          //时间为0，那么就要关掉定时器！
          clearInterval(that.data.timer);
          wx.showToast({
            title: '时间已到！',
            icon:'none'
          })
        }
      }, 1000)
    })
  }
      
  
})