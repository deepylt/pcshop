// pages/product_bargain/product_bargain.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    bargainlist_id:0,//如果大于0，代表给别人砍价
    show_login:false,
    time2end:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thiss=this;
    var id=options.id;
    console.log(id);
    this.setData(
      {
        id:id,
      }
    );
    setInterval(
      function()
      {
        thiss.check_time_to_end();
      },
      1000
    )
  },
  check_time_to_end:function()
  {
    var thiss=this;
    if(thiss.data.row_bargain!=null)
    {
      console.log(thiss.data.row_bargain.edate);
      var edate=new Date(thiss.data.row_bargain.edate).getTime()/1000;
      var now=new Date().getTime()/1000;
      var day=parseInt((edate-now)/86400);
      var hour=parseInt((edate-now)%86400/3600);
      var minute=parseInt((edate-now)%86400/60);
      var second=parseInt((edate-now)%86400%60);
      var time2end="";
      if(day>0)
      {
        time2end+=(day+"天");
      }
      if(hour>0)
      {
        time2end+=(day+"时");
      }
      if(minute>0)
      {
        time2end+=(minute+"分");
      }
      if(second>0)
      {
        time2end+=(second+"秒");
      }
      thiss.setData(
        {
          time2end:time2end,
        }
      );
    }
  },
  //获取用户信息权限
  do_login:function(res)
  {
    var thiss=this;
    this.setData(
      {
        show_login:false,
      }
    );
    console.log(res);
    wx.login({
      success:function(res)
      {
        console.log(res.code);
        pcapi.do_login(res.code,
            function(res)
            {
              console.log(res);
              if(res.data.code==1)
              {
                app.globalData.row_member=res.data.data;
                app.save_data();
                this.setData(
                  {
                    row_member:app.globalData.row_member,
                  }
                );
                //重新获取商品详情
                thiss.get_bargain_detail();
              }
              else{
                util.show_model_and_back(res.data.msg);
              }
            }
          );
      },
      fail:function(res)
      {
        util.show_model_and_back('登录失败');
      }
    })
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
    if(app.globalData.row_member==null)
    {
      this.setData(
        {
          show_login:true,
        }
      );
    }
    else
    {
      this.setData(
        {
          row_member:app.globalData.row_member,
        }
      );
      //获取砍价详情
      this.get_bargain_detail();
    }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  get_bargain_detail:function()
  {
    var thiss=this;
    pcapi.get_bargain_detail(
      thiss.data.id,
      app.globalData.row_member.id,
      thiss.data.bargainlist_id,
      function(res)
      {
        if(res.data.code==1)
        {
          thiss.setData(
            {
              row_bargain:res.data.data,
            }
          );
        }
        else
        {
          util.show_model_and_back(res.data.msg);
        }
      }
    );
  },
  create_bargainlist:function()
  {
    var thiss=this;
    pcapi.create_bargainlist(
      app.globalData.row_member.id,
      thiss.data.id,
      function(res)
      {
        if(res.data.code==1)
        {
          thiss.setData(
            {
              bargainlist_id:res.data.bargainlist_id,
            }
          );
          thiss.get_bargain_detail();
        }
        else
        {
          util.show_model_and_back(res.data.msg);
        }
      }
    );
  },
})