
var app = getApp()
var api = require('../../requests/api.js')
var utils = require('../../utils/util.js')
var requests = require('../../requests/request.js')
let currentId,newInfo
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    result:'',
    showMsg:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    currentId = options.id
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  bindTapList(){
    wx.navigateTo({
      url: '../index/index',
    })
  },
  saomiao(){
    var _this = this;
    wx.scanCode({
      success: (res) => {
        var result = res.result;
        _this.setData({
          result: result
        })
        newInfo=result
        getOrderDetail.call(_this)
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },
  logistics_Input(e){
    newInfo = e.detail.value
  },
  sousuo(){
    getOrderDetail.call(this)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
/**
 * 
 * 获取物流列表
 */
function getOrderDetail(){
  console.log(newInfo)
  if(newInfo==''||newInfo==undefined){
    wx.showToast({
      title: '请填写单号',
      icon: 'none',
      duration: 1500
    })
    return
  }
  wx.showLoading({
    title:'正在查询'
  })
  console.log('查询')
  console.log(newInfo,currentId)
  var url = api.API_GET_Detail;
  var params = {
    logistics_id:currentId,
    logistics_no:newInfo
  }
  requests.getRequest(url,params).then(res=>{
    console.log(res)
    console.log(res.data.data)
    if (res.data.code == 1){
      wx.hideLoading()
      this.setData({
        list: res.data.data.data.reverse().map((item,index)=>{
          item.index = index
          item.date = item.time.substring(11,16)
          item.gTime = getDate(item.time)
          return item 
        }),
        showMsg:false
      })
    }else{
      this.setData({
        showMsg:true,
        list:[]
      })
      wx.hideLoading()
    }
  }).catch(error => {
    wx.hideLoading()
    console.log(error)
  })
}
function getDate(dateTimeStamp){
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var month = day * 30;
  if(dateTimeStamp==undefined){
    
    return false;
  }else{
    dateTimeStamp = dateTimeStamp.replace(/\-/g, "/");
    
    var sTime = new Date(dateTimeStamp).getTime();//把时间pretime的值转为时间戳
    
    var now = new Date().getTime();//获取当前时间的时间戳
    
    var diffValue = now - sTime;
    
    if(diffValue < 0){
      console.log("结束日期不能小于开始日期！");
    }
    
    var monthC =diffValue/month;
    var weekC =diffValue/(7*day);
    var dayC =diffValue/day;
    var hourC =diffValue/hour;
    var minC =diffValue/minute;
    var result ;
    
    if(monthC>=1){
      result = parseInt(monthC) + "个月前"
     
    }
    else if(weekC>=1){
      result=parseInt(weekC) + "周前"
    }
    else if(dayC>=1){
      result=parseInt(dayC) +"天前"
    }
    else if(hourC>=1){
      result=parseInt(hourC) +"个小时前"
    }
    else if(minC>=1){
      result=parseInt(minC) +"分钟前"
    }else{
      result='刚刚'
    }
    return result
  }
}