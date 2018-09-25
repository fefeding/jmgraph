const util = require('./util');

//通过CODE去后台获取登录态
exports.getLoginSession = function(wxInfo, callback) {
  if(typeof wxInfo == 'function') {
    callback = wxInfo;
    wxInfo = {};
  }
  try {
    let info = this.getSession();
    //不存在，则重新登录 //现在强制登录
    if (!info || !info.session_id) {
      util.getAuthCode(function (res) {
        util.request('user/get_session', {
          code: res.code,
          wx_name: wxInfo.nickName || '',
          wx_header: wxInfo.avatarUrl || ''
        }, function (err, data) {
          if (!err&&data) {
            wx.setStorageSync('my_session', data.data);
            callback && callback(null, data.data);
          }
          else {
            console.error && console.error(err);
            callback && callback(err, data);
          }
        });
      });      
    }
    else {
      callback && callback(null, info);
      return info;
    }
  } catch (e) {
    callback && callback(e, null);
  }  
}

//检 查登录信息，如果没有则去获取code,再从后台生成登录信息
exports.check = function (wxInfo, callback) {
  if (typeof wxInfo == 'function') {
    callback = wxInfo;
    wxInfo = {};
  }
  try {
    let info = this.getSession();
    console.log(info);
    //不存在，则重新登录 //现在强制登录
    if (!info || !info.session_id) {
      this.getLoginSession(wxInfo, callback);
    }
    else {
      //检查session是否还有效，有效直接返回
      util.checkLogin(function(res) {
        if(res === 1) {
          //更新一个用户权限
          getUserAuth(info, callback);
        }
        else {
          //删除session,重新走验证流程
          wx.removeStorageSync('my_session');
          exports.check(wxInfo, callback);
        }
      });      
      return info;
    }
  } catch (e) {
    callback && callback(e, null);
  }
}


exports.getSession = function() {
  try {
    let info = wx.getStorageSync('my_session');
    //不存在，则重新登录
    return info;
  } catch (e) {
    return null;
  }
}

//请求后台，获取用户auth
function getUserAuth(info, callback) {
  util.request('user/get_auth', {
  }, function (err, data) {
    if (!err && data.data) {
      info.auth = data.data.auth;
      if (data.data.wx_name) info.wx_name = data.data.wx_name;
      if (data.data.nickname) info.nickname = data.data.nickname;
      wx.setStorageSync('my_session', info);
      callback && callback(null, info);
    }
    else {
      console.error && console.error(err);
      callback && callback(null, info);
    }
  });
}