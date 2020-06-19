/**
 * README!!!
 * 为了兼容微信修改的登录逻辑
 * 这里对登录的 SDK 进行重构
 * 微信公告：https://developers.weixin.qq.com/blogdetail?action=get_post_info&lang=zh_CN&token=&docid=0000a26e1aca6012e896a517556c01
 */
var constants = require('./constants');
var Session = require('./session');
var utils = require('./utils');

/***
 * @class
 * 表示登录过程中发生的异常
 */
var LoginError = (function () {
  function LoginError(type, message) {
    Error.call(this, message);
    this.type = type;
    this.message = message;
  }

  LoginError.prototype = new Error();
  LoginError.prototype.constructor = LoginError;

  return LoginError;
})();

/**
 * 微信登录，获取 code 和 encryptData
 */
function getWxLoginResult (cb) {
    wx.login({
        success (loginResult) {
            wx.getUserInfo({
                success (userResult) {
                    cb(null, {
                        code: loginResult.code,
                        encryptedData: userResult.encryptedData,
                        iv: userResult.iv,
                        userInfo: userResult.userInfo
                    })
                },
                fail (userError) {
                  //用户拒绝授权后，打开设置，让用户进行授权
                  wx.showModal({
                    title: '登录失败!',
                    content: '请选择允许获取您的公开信息',
                    success: (res) => {
                      wx.openSetting({
                        success: (res) => {
                          if (res.authSetting['scope.userInfo']) {
                            wx.getUserInfo({
                              success: function (userResult) {
                                cb(null, {
                                  code: loginResult.code,
                                  encryptedData: userResult.encryptedData,
                                  iv: userResult.iv,
                                  userInfo: userResult.userInfo,
                                });
                              },
                            })
                          }
                        }
                      })
                    }
                  })
                }
            });
        },
        fail (loginError) {
          var error = new LoginError(constants.ERR_WX_LOGIN_FAILED, '微信登录失败，请检查网络状态');
          error.detail = loginError;
          cb(error, null);
        }
    })
}

const noop = function noop() {}
const defaultOptions = {
    method: 'GET',
    success: noop,
    fail: noop,
    loginUrl: null,
}

/**
 * @method
 * 进行服务器登录，以获得登录会话
 * 受限于微信的限制，本函数需要在 <button open-type="getUserInfo" bindgetuserinfo="bindGetUserInfo"></button> 的回调函数中调用
 * 需要先使用 <button> 弹窗，让用户接受授权，然后再安全调用 wx.getUserInfo 获取用户信息
 *
 * @param {Object}   opts           登录配置
 * @param {string}   opts.loginUrl  登录使用的 URL，服务器应该在这个 URL 上处理登录请求，建议配合服务端 SDK 使用
 * @param {string}   [opts.method]  可选。请求使用的 HTTP 方法，默认为 GET
 * @param {Function} [opts.success] 可选。登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} [opts.fail]    可选。登录失败后的回调函数，参数 error 错误信息
 */
function login (options) {
    options = utils.extend({}, defaultOptions, options);

    if (!defaultOptions.loginUrl) {
      options.fail(new LoginError(constants.ERR_INVALID_PARAMS, '登录错误：缺少登录地址，请通过 setLoginUrl() 方法设置登录地址'));
      return;
    }

    var doLogin = () => getWxLoginResult(function (wxLoginError, wxLoginResult) {
        if (wxLoginError) {
        options.fail(wxLoginError);
        return;
    }

    var userInfo = wxLoginResult.userInfo;

    // 构造请求头，包含 code、encryptedData 和 iv
    var code = wxLoginResult.code;
    var encryptedData = wxLoginResult.encryptedData;
    var iv = wxLoginResult.iv;
    var header = {};

    header[constants.WX_HEADER_CODE] = code;
    header[constants.WX_HEADER_ENCRYPTED_DATA] = encryptedData;
    header[constants.WX_HEADER_IV] = iv;

    // 请求服务器登录地址，获得会话信息
    wx.request({
      url: options.loginUrl,
      header: header,
      method: options.method,
      data: options.data,
      success: function (result) {
        var data = result.data;

        // 成功地响应会话信息
        if (data && data.code === 0 && data.data.skey) {
          var res = data.data
          if (res.userinfo) {
            Session.set(res.skey);  //jacksplwxy:将skey缓存起来
            wx.setStorageSync('user_info_' + constants.WX_SESSION_MAGIC_ID, res.userinfo);//jacksplwxy:将用户信息存储起来
            options.success(userInfo);
          } else {
            var errorMessage = '登录失败(' + data.error + ')：' + (data.message || '未知错误');
            var noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, errorMessage);
            options.fail(noSessionError);
          }

          // 没有正确响应会话信息
        } else {
          var noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, JSON.stringify(data));
          options.fail(noSessionError);
        }
      },

      // 响应错误
      fail: function (loginResponseError) {
        var error = new LoginError(constants.ERR_LOGIN_FAILED, '登录失败，可能是网络错误或者服务器发生异常');
        options.fail(error);
      },
    });
  });

  doLogin();
};

var setLoginUrl = function (loginUrl) {
  defaultOptions.loginUrl = loginUrl;
};

module.exports = {
  LoginError: LoginError,
  login: login,
  setLoginUrl: setLoginUrl,
};