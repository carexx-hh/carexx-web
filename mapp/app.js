var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module('jl-customer', ['ionic', 'ionic.service.core', 'ngStorage', 'templates', 'wf-config', 'app-api', 'wf-tab', 'tab-home', 'tab-yuyue', 'tab-orderDetail', 'tab-myself', 'tab-myinfo', 'tab-visinfo', 'tab-editinfo', 'tab-pay', 'modal', 'tab-order-list', 'app-router', 'app-component-directive', 'app-util-func', 'app-initial', 'app-util-interceptor', 'ionic-datepicker', 'ionic-timepicker', 'app-util-filter']).service('tabData', function($rootScope, $ionicViewSwitcher) {
  var tabName, unwatch;
  tabName = ['tab.home', 'tab.order-list', 'tab.myself'];
  unwatch = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    var ref, ref1;
    if ((ref = toState.name, indexOf.call(tabName, ref) >= 0) && (ref1 = fromState.name, indexOf.call(tabName, ref1) >= 0)) {
      return $ionicViewSwitcher.nextTransition('none');
    }
  });
  return [
    {
      state: 'tab.home',
      iconOn: 'wf-index-on',
      iconOff: 'wf-index-off',
      title: '首页'
    }, {
      state: 'tab.order-list',
      iconOn: 'wf-order-on',
      iconOff: 'wf-order-off',
      title: '订单'
    }, {
      state: 'tab.myself',
      iconOn: 'wf-my-on',
      iconOff: 'wf-my-off',
      title: '我的'
    }
  ];
});

angular.module('wf-config', []).factory('wfConfig', function() {
  return {
    loggerBackend: '',
    debug: false,
    shareData: {
      title: 'Care++',
      url: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe31d89dfdd9864af&redirect_uri=https%3A%2F%2Fm.carexx.cn%2Fauth%2Flogin&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect',
      img: 'http://p1ekzzxyu.bkt.clouddn.com/khlogo.png',
      desc: 'Care desc！'
    }
  };
});

angular.module('app-router', ['ui.router']).config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('tab', {
    url: '/tab/wechat',
    template: '<ion-nav-view></ion-nav-view>',
    abstract: true
  }).state('tab.myself', {
    url: '/myself',
    templateUrl: 'templates/pages/tab-myself/tab-myself.html',
    controller: 'TabMyselfCtrl',
    cache: false
  }).state('tab.home', {
    url: '/home',
    templateUrl: 'templates/pages/tab-home/tab-home.html',
    controller: 'TabHomeCtrl',
    cache: false
  }).state('tab.order-list', {
    url: '/tab-order-list',
    templateUrl: 'templates/pages/tab-order-list/tab-order-list.html',
    controller: "TabOrderListCtrl",
    cache: false
  }).state('tab.yuyue', {
    url: '/tab-yuyue',
    templateUrl: 'templates/pages/tab-yuyue/tab-yuyue.html',
    controller: "TabYuyueCtrl",
    cache: false
  }).state('tab.orderDetail', {
    url: '/tab-orderDetail/{id}',
    templateUrl: 'templates/pages/tab-orderDetail/tab-orderDetail.html',
    controller: "OrderDetailCtrl",
    cache: false,
    params: {
      id: 0
    }
  }).state('tab.myinfo', {
    url: '/tab-myinfo',
    templateUrl: 'templates/pages/tab-myinfo/tab-myinfo.html',
    controller: "TabMyinfoCtrl",
    cache: false
  }).state('tab.visinfo', {
    url: '/tab-visinfo',
    templateUrl: 'templates/pages/tab-visinfo/tab-visinfo.html',
    controller: "TabVisinfoCtrl",
    cache: false
  }).state('tab.editinfo', {
    url: '/tab-editinfo',
    templateUrl: 'templates/pages/tab-editinfo/tab-editinfo.html',
    controller: "EditinfoCtrl",
    cache: false
  }).state('tab.pay', {
    url: '/tab-pay/{id}',
    templateUrl: 'templates/pages/tab-pay/tab-pay.html',
    controller: "TabPayCtrl",
    cache: false,
    params: {
      id: 0
    }
  });
  return $urlRouterProvider.otherwise('/tab/wechat/home');
});

angular.module('app-api', ['list-data-service']);

angular.module('date-format', []).run(function() {
  return Date.prototype.format = function(format) {
    var date, k, v;
    date = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "q+": Math.floor((this.getMonth() + 3) / 3),
      "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (v in date) {
      k = date[v];
      if (new RegExp("(" + v + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? [k] : ("00" + k).substr(("" + k).length));
      }
    }
    return format;
  };
});

angular.module('app-initial', ['ionic-config', 'date-format', 'number-tofixed']);

angular.module('ionic-config', ['ionic']).config(function($compileProvider) {
  return $compileProvider.imgSrcSanitizationWhitelist(/^(https|http|file|blob|cdvfile):|data:image\//);
}).run(function($ionicPlatform) {
  return $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      return StatusBar.styleLightContent();
    }
  });
}).config(function($ionicConfigProvider, inWeixin) {
  $ionicConfigProvider.platform.ios.tabs.style('standard');
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('standard');
  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');
  $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');
  if (!inWeixin) {
    return $ionicConfigProvider.platform.android.scrolling.jsScrolling(false);
  }
}).run(function() {
  var onDeviceReady;
  document.addEventListener("deviceready", onDeviceReady, false);
  return onDeviceReady = function() {
    return window.open = cordova.InAppBrowser.open;
  };
}).run(function($ionicPopup, $ionicLoading, $ionicPlatform, $state) {
  return $ionicPlatform.ready(function() {
    return _.defer(function() {
      var ref;
      return (ref = navigator.splashscreen) != null ? ref.hide() : void 0;
    });
  });
});

angular.module('number-tofixed', []).run(function() {
  return Number.prototype.toFixed = function(d) {
    var a, b, i, j, pm, ref, s;
    s = this + "";
    if (!d) {
      d = 0;
    }
    if (s.indexOf(".") === -1) {
      s += ".";
    }
    s += new Array(d + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
      s = "0" + RegExp.$2;
      pm = RegExp.$1;
      a = RegExp.$3.length;
      b = true;
      if (a === d + 2) {
        a = s.match(/\d/g);
        if (parseInt(a[a.length - 1]) > 4) {
          for (i = j = ref = a.length - 2; ref <= 0 ? j <= 0 : j >= 0; i = ref <= 0 ? ++j : --j) {
            a[i] = parseInt(a[i]) + 1;
            if (a[i] === 10) {
              a[i] = 0;
              b = i !== 1;
            } else {
              break;
            }
          }
        }
        s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");
      }
      if (b) {
        s = s.substr(1);
      }
      return (pm + s).replace(/\.$/, "");
    }
    return this + "";
  };
});

var OrderModel;

OrderModel = function() {
  var Order;
  Order = {
    orderNo: '',
    orderId: '',
    productId: ''
  };
  return addSetterAndGetter(Order);
};

var addSetterAndGetter;

addSetterAndGetter = function(obj) {
  var f, k, v;
  f = function(word) {
    if (typeof word !== 'String' && word.length < 1) {
      return '';
    }
    return word[0].toUpperCase() + word.slice(1, word.length);
  };
  for (k in obj) {
    v = obj[k];
    if (typeof v !== 'function') {
      obj['set' + f(k)] = function(value) {
        obj[k] = value;
        return console.log('changed', obj);
      };
      obj['get' + f(k)] = function() {
        return obj[k];
      };
    }
  }
  return obj;
};

angular.module('list-data-service', []).factory('ListDataService', function($http, $rootScope, $q, $ionicPopup, $state) {
  var DataFactory, pool;
  DataFactory = function(name, url) {
    var $watch, canLoadMore, getData, loadingFlag, orderData, params;
    $watch = {};
    orderData = [];
    canLoadMore = true;
    loadingFlag = false;
    params = {
      size: 10,
      page: 0
    };
    $rootScope.$on('$stateChangeSuccess', function() {
      var stateName;
      stateName = $state.current.name;
      if (_.has($watch, stateName)) {
        console.log("change to " + stateName + ", send data");
        return $watch[stateName](orderData);
      }
    });
    getData = function(setData, innerParams) {
      if (loadingFlag) {
        return {
          "finally": function() {
            return console.log('fetch data error ,now there is an other progress fetching data');
          }
        };
      }
      loadingFlag = true;
      _.extend(params, innerParams);
      console.log(params);
      return $http.get(url, {
        params: params,
        loadingAnimation: false
      }).success(function(resp) {
        var ref, ref1, ref2, stateName;
        if (resp.code === 0) {
          if (params.page === 0) {
            orderData = resp.message.content;
            console.log(orderData);
          } else {
            console.log('load more in------------', resp.message.content);
            orderData.push.apply(orderData, (ref = resp.message) != null ? ref.content : void 0);
          }
          if (((ref1 = resp.message) != null ? (ref2 = ref1.content) != null ? ref2.length : void 0 : void 0) < params.size) {
            canLoadMore = false;
          } else {
            canLoadMore = true;
          }
          params.page += 1;
        } else {
          canLoadMore = false;
        }
        stateName = $state.current.name;
        if (setData && _.has($watch, stateName)) {
          console.log("call back " + $state.current.name);
          console.log($watch);
          $watch[stateName](orderData);
        }
        return loadingFlag = false;
      }).error(function() {
        loadingFlag = false;
        canLoadMore = false;
        return $ionicPopup.alert({
          title: '哎呀!',
          template: '您的网络又调皮了'
        });
      });
    };
    return {
      canLoadMore: function() {
        if (canLoadMore === void 0) {
          return false;
        } else {
          return canLoadMore;
        }
      },
      reload: function(innerParams, setData) {
        if (innerParams == null) {
          innerParams = void 0;
        }
        if (setData == null) {
          setData = false;
        }
        params.page = 0;
        return getData(setData, innerParams);
      },
      loadMore: function(innerParams, setData) {
        if (innerParams == null) {
          innerParams = void 0;
        }
        if (setData == null) {
          setData = true;
        }
        console.log('loadMore data');
        return getData(setData, innerParams);
      },
      watch: function(func) {
        var key;
        if (!_.isFunction(func)) {
          throw "watch param is not a function!";
        }
        key = $state.current.name;
        $watch[key] = func;
        console.log("key: " + key + "\t$watch size: " + (_.keys($watch).length));
        func(orderData);
        return function() {
          return delete $watch[key];
        };
      }
    };
  };
  pool = {};
  return {
    init: function(name, url) {
      var obj;
      if (_.isEmpty(url)) {
        throw '初始化dataFactory对象需要指定url';
      }
      obj = new DataFactory(name, url);
      return pool[name] = obj;
    },
    get: function(name) {
      if (_.has(pool, name)) {
        return pool[name];
      } else {
        throw "没有为dataFactory对象初始化" + name;
      }
    }
  };
}).run(function(ListDataService) {
  return ListDataService.init('orderList', '/order');
});

angular.module('modal', []).service('Modal', function($ionicModal, $rootScope) {
  $rootScope.style = '';
  return {
    setNoFilter: function() {
      return $rootScope.nofilter = true;
    },
    setStyle: function(style) {
      return $rootScope.style = style;
    },
    setText: function(attrs) {
      return $rootScope.lineTextList = attrs;
    },
    onClick: function(funcs) {
      return $rootScope.lineClick = funcs;
    },
    showModal: function() {
      if ($rootScope.lineTextList === void 0 || $rootScope.lineClick === void 0) {
        console.log('未设置lineText值或lineCLick事件');
        return;
      }
      return $ionicModal.fromTemplateUrl('templates/component/modal/modal.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $rootScope.modal = modal;
        return $rootScope.modal.show();
      });
    },
    hideModal: function() {
      if ($rootScope.modal !== void 0) {
        return $rootScope.modal.hide();
      }
    }
  };
});

angular.module('app-component-directive', []).directive('wfSrc', function(cdn) {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      if (cdn === null) {
        element.attr('src', attr.wfSrc);
      } else {
        element.attr('src', cdn + '/' + attr.wfSrc);
      }
      return element.attr('wf-src', null);
    }
  };
}).directive('ygjSrc', function(cdn) {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      return attr.$observe('ygjSrc', function() {
        console.log('enter');
        if (cdn === null) {
          return element.attr('src', attr.ygjSrc);
        } else {
          return element.attr('src', cdn + '/' + attr.ygjSrc);
        }
      });
    }
  };
}).service('Toast', function($ionicModal, $rootScope) {
  var modal, scope;
  scope = $rootScope.$new();
  modal = $ionicModal.fromTemplate("<div id='toastModal' style='width: 100%;height: 800px;background: rgba(0,0,0,.5);'> <div style=' padding: 10px; width: 50%; height: auto; background-color: #fff; border-radius: 5px; text-align: center; position: absolute; left: 50%; top:50%; transform: translate(-50%,-50%); -ms-transform: translate(-50%,-50%); -moz-transform: translate(-50%,-50%); -webkit-transform: translate(-50%,-50%); -o-transform: translate(-50%,-50%); font-size: 14px;'> <img wf-src='img/info.png' style='width: 20px;'/> <p ng-bind='msg'></p> </div> </div>", {
    scope: scope,
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  });
  return {
    showMsg: function(msg, time) {
      if (time == null) {
        time = 1000;
      }
      scope.msg = msg;
      modal.show();
      if (time !== -1) {
        return _.delay((function() {
          return modal.hide();
        }), time);
      }
    },
    showSysError: function(msg, time) {
      if (msg == null) {
        msg = '网络异常,请稍后重试';
      }
      if (time == null) {
        time = 1000;
      }
      scope.msg = msg;
      modal.show();
      if (time !== -1) {
        return _.delay((function() {
          return modal.hide();
        }), time);
      }
    },
    showBusinessError: function(resp, time) {
      var errorMsg;
      if (time == null) {
        time = 1000;
      }
      console.log(resp);
      errorMsg = resp.message;
      scope.msg = errorMsg;
      modal.show();
      if (time !== -1) {
        return _.delay((function() {
          return modal.hide();
        }), time);
      }
    }
  };
});

angular.module('wf-tab', ['ionic']).directive('wfTab', function(tabData, $ionicHistory, $state) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attrs) {
      var clearOldTab, fakeEle, height, idx, innerElement, ionContent, select, stateName;
      fakeEle = angular.element(document.createDocumentFragment());
      fakeEle.append('<div class="tabs tab-nav tabs-icon-top tabs-stable"></div>');
      clearOldTab = void 0;
      _.each(tabData, function(tab, $index) {
        console.log(tab.state);
        if (tab.state === 'tab.kefu') {
          return fakeEle.children().append("<a class=\"tab-item big\" idx=\"" + $index + "\"\n  state=\"" + tab.state + "\">\n  <i class=\"icon " + tab.iconOff + "\"></i>\n  <span class='chat-bubble' style=\"display:none;position: absolute;background: #f73e05;border-radius: 100px;\n      color: white;width: 13px;height: 13px;margin-left: 7px;margin-top: -29px;\"></span>\n  <span>" + tab.title + "</span>\n</a>");
        } else {
          return fakeEle.children().append("<a class=\"tab-item\" idx=\"" + $index + "\"\n  state=\"" + tab.state + "\">\n  <i class=\"icon " + tab.iconOff + "\"></i><span>" + tab.title + "</span></a>");
        }
      });
      $element.append(fakeEle);
      innerElement = angular.element(_.last($element.children()));
      select = function(idx) {
        var ele, iEle;
        if (clearOldTab !== void 0) {
          clearOldTab();
        }
        ele = angular.element(innerElement.children()[idx]);
        iEle = ele.children();
        iEle.removeClass(tabData[idx].iconOff);
        iEle.addClass(tabData[idx].iconOn);
        return clearOldTab = function() {
          iEle.removeClass(tabData[idx].iconOn);
          return iEle.addClass(tabData[idx].iconOff);
        };
      };
      stateName = $state.current.name;
      idx = _.findIndex(tabData, function(tab) {
        return tab.state === stateName;
      });
      if (idx !== -1) {
        select(idx);
      }
      ionContent = _.find($element.children(), function(ele) {
        return ele.tagName === 'ION-CONTENT';
      });
      height = innerElement[0].getClientRects()[0].height;
      ionContent.style.bottom = (height + 1) + "px";
      return innerElement.bind('click', function(e) {
        var ele, state, tagName;
        tagName = e.target.tagName;
        if (tagName !== 'DIV') {
          ele = angular.element(e.target);
          if (tagName === 'SPAN' || tagName === 'I') {
            ele = ele.parent();
          }
          state = ele.attr('state');
          if (state === $state.current.name) {
            return;
          }
          if (state === 'tab.kefu') {
            $scope.$emit('kefu', 'show');
            return;
          }
          if (!state) {
            console.log(ele);
          }
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          return $state.go(state);
        }
      });
    }
  };
});

angular.module('tab-home', []).controller('TabHomeCtrl', function($location, userData, $scope, $ionicLoading, $anchorScroll, $timeout, $state, $http, $ionicHistory, $ionicBackdrop, $ionicPlatform, Toast, $localStorage) {
  var getHosList, getProductList, getTokenFromCurrentUrl, getUserInfo;
  $scope.$storage = $localStorage;
  $scope.ssh = {
    name: void 0
  };
  $localStorage.currentHos = void 0;
  $scope.mark = false;
  $scope.data = {};
  getHosList = function() {
    return $http.post('/careinst/all').success(function(resp) {
      $scope.hosList = resp.data;
      if ($scope.hosList.length > 0) {
        if ($localStorage.currentHos === void 0) {
          $localStorage.currentHos = $scope.hosList[0];
          return getProductList();
        }
      }
    });
  };
  getProductList = function() {
    $scope.data.instId = $localStorage.currentHos.id;
    return $http.post('/careservice/list_all_inst', $scope.data).success(function(resp) {
      if (resp.code === 200) {
        return $scope.proList = resp.data;
      } else {
        return Toast.showBusinessError(resp.errorMsg);
      }
    }).error(function(resp) {
      return Toast.showSysError(resp.errorMsg);
    });
  };
  getUserInfo = function() {
    return $http.get('/customer/detail').success(function(resp) {
      if (resp.code === 0) {
        $scope.user = resp.message;
        userData.set($scope.user);
        return $localStorage.userId = resp.message.id;
      } else {
        return Toast.showMsg("获取数据失败");
      }
    }).error(function(resp, status) {
      console.log(resp);
      return Toast.showMsg("加载数据失败");
    });
  };
  getTokenFromCurrentUrl = function() {
    var token;
    token = $location.search().token;
    if ($location.search().openId) {
      $localStorage['openId'] = $location.search().openId;
    }
    if (token !== void 0) {
      $localStorage.token = token;
    }
    return getHosList();
  };
  getTokenFromCurrentUrl();
  return _.extend($scope, {
    yuyue: function(item) {
      $localStorage.getProinfo = item;
      return $state.go('tab.yuyue');
    },
    changeMask: function() {
      $scope.mask = !$scope.mask;
      return getHosList();
    },
    chosen: function(item) {
      $localStorage.currentHos = item;
      getProductList();
      return $scope.mask = !$scope.mask;
    },
    search: function() {
      $scope.data.instName = $scope.ssh.name;
      return $http.post('/careinst/all', $scope.data).success(function(resp) {
        return $scope.hosList = resp.data;
      }).error(function(err) {
        return Toast.showSysError(resp.errorMsg);
      });
    }
  });
});

angular.module('tab-myinfo', []).controller('TabMyinfoCtrl', function($localStorage, Modal, wfConfig, inWeixin, $location, $scope, $state, Toast, $filter, $window, $ionicHistory, ionicDatePicker, $http, $ionicViewSwitcher, userData) {
  $scope.$storage = $localStorage;
  $scope.commit = [];
  $scope.commit.birthday = new Date();
  $scope.back = function() {
    return window.history.back();
  };
  $scope.toEdit = function() {
    return $scope.editing = true;
  };
  $scope.datepickerObjectStart = {
    callback: function(val) {
      if (typeof val === 'undefined') {

      } else {
        $scope.commit.birthday = $filter('date')(new Date(val), 'yyyy-MM-dd');
        return $scope.datepickerObjectStart.inputDate = new Date(val);
      }
    },
    inputDate: new Date(),
    titleLabel: '选择日期',
    setLabel: '确定',
    todayLabel: '今天',
    closeLabel: '关闭',
    mondayFirst: false,
    weeksList: ["日", "一", "二", "三", "四", "五", "六"],
    monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    templateType: 'popup',
    from: new Date(1900, 8, 1),
    to: new Date(2028, 8, 1),
    showTodayButton: true,
    dateFormat: 'yyyy-MM-dd',
    closeOnSelect: false,
    disableWeekdays: []
  };
  $scope.openDatePickerS = function() {
    return ionicDatePicker.openDatePicker($scope.datepickerObjectStart);
  };
  return $scope.commitEdit = function() {
    return $http.put('/customer/' + $localStorage.user.id, {
      gender: $scope.commit.gender,
      name: $scope.commit.name,
      birthday: $scope.commit.birthday,
      idNo: $scope.commit.idNo,
      tel: $scope.commit.tel
    }).success(function(resp) {
      if (resp.code === 0) {
        $window.location.reload();
        return Toast.showMsg("修改资料成功");
      } else {
        return Toast.showMsg("添加数据失败");
      }
    }).error(function(resp, status) {
      console.log(resp);
      return Toast.showMsg("添加数据失败");
    });
  };
});

angular.module('tab-editinfo', []).controller('EditinfoCtrl', function($localStorage, Modal, wfConfig, inWeixin, $location, $scope, $rootScope, Toast, $state, $ionicHistory, $http, $ionicViewSwitcher, userData, $stateParams) {
  $scope.editInfo = $localStorage.editInfo;
  $scope.info = {};
  $scope.editOrAdd = $localStorage.editOrAdd;
  console.log("ifEdit:" + $localStorage.ifEdit);
  if ($localStorage.ifEdit === 0) {
    $scope.edit = true;
    $scope.add = false;
  } else {
    $scope.edit = false;
    $scope.add = true;
  }
  $scope.editCommit = function() {
    if ($localStorage.ifEdit === 0) {
      return $http.post('/customerpatient/modify', {
        id: $scope.editInfo.id,
        patientName: $scope.editInfo.patientName,
        phone: $scope.editInfo.phone,
        address: $scope.editInfo.address
      }).success(function(resp) {
        if (resp.code === 200) {
          Toast.showMsg("修改信息成功");
          return $state.go("tab.visinfo");
        } else {
          return Toast.showMsg(resp.errorMsg);
        }
      }).error(function(resp, status) {
        console.log(resp);
        return Toast.showBusinessError(resp.errorMsg);
      });
    } else {
      return $http.post('/customerpatient/add', {
        patientName: $scope.info.patientName,
        phone: $scope.info.phone,
        address: $scope.info.address
      }).success(function(resp) {
        if (resp.code === 200) {
          Toast.showMsg("添加信息成功");
          return $state.go("tab.visinfo");
        } else {
          return Toast.showMsg(resp.errorMsg);
        }
      }).error(function(resp, status) {
        console.log(resp);
        return Toast.showSysError(resp.errorMsg);
      });
    }
  };
  $scope.back = function() {
    return window.history.back();
  };
  $scope.deleteInfo = function() {
    return $http["delete"]('/visitInfo/' + $scope.editInfo.id, {}).success(function(resp) {
      Toast.showMsg("删除信息成功");
      return $state.go("tab.visinfo");
    }).error(function(resp, status) {
      console.log(resp);
      return Toast.showBusinessError(resp.errorMsg);
    });
  };
  return $scope.setDefault = function() {
    return $http.put('/visitInfo/' + $scope.editInfo.id, {
      customerName: $scope.editInfo.customerName,
      tel: $scope.editInfo.tel,
      bed: $scope.editInfo.bed,
      isSelect: 1
    }).success(function(resp) {
      Toast.showMsg("修改默认成功");
      return $state.go("tab.visinfo");
    }).error(function(resp, status) {
      console.log(resp);
      return Toast.showBusinessError(resp.errorMsg);
    });
  };
});

angular.module('tab-myself', []).controller('TabMyselfCtrl', function($localStorage, Modal, wfConfig, inWeixin, $location, $scope, $state, $ionicHistory, $http, $ionicViewSwitcher, userData, Toast) {
  var getUserInfo;
  $scope.$storage = $localStorage;
  $scope.goMyifo = function() {
    return $state.go("tab.myinfo");
  };
  $scope.goVisinfo = function() {
    return $state.go("tab.visinfo");
  };
  getUserInfo = function() {
    return $http.get('/user/get_user_info').success(function(resp) {
      if (resp.code === 200) {
        $scope.user = resp.data;
        return $localStorage.user = $scope.user;
      } else {
        return Toast.showMsg("获取数据失败");
      }
    }).error(function(resp, status) {
      return Toast.showMsg("加载数据失败");
    });
  };
  return getUserInfo();
});

angular.module('tab-order-list', []).controller('TabOrderListCtrl', function(Toast, $location, $localStorage, $ionicLoading, $scope, $state, $http, $window, $ionicHistory, $stateParams, orderService, ListDataService, $ionicScrollDelegate, $filter) {
  var onBridgeReady, wechatPay;
  onBridgeReady = function(data) {
    WeixinJSBridge.invoke('getBrandWCPayRequest', data, function(res) {
      if (res.err_msg === 'get_brand_wcpay_request:ok') {
        $scope.doRefresh();
      } else {
        Toast.showSysError(resp.errorMsg);
      }
    });
  };
  wechatPay = function(data) {
    if (typeof WeixinJSBridge === 'undefined') {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
      }
    } else {
      onBridgeReady(data);
    }
  };
  _.extend($scope, {
    selectTap: 1,
    orderList: [],
    lishi: false,
    dangqian: true,
    clickqhl: function() {
      $scope.selectTap = 1;
      $scope.lishi = false;
      $scope.dangqian = true;
      return $scope.doRefresh();
    },
    clickqhr: function() {
      $scope.selectTap = 0;
      $scope.lishi = true;
      $scope.dangqian = false;
      return $scope.doRefresh();
    },
    goDetail: function(order) {
      $localStorage.orderDetail = order;
      return $state.go('tab.orderDetail');
    },
    goPay: function(order) {
      console.log("pay");
      return $http.post('/customerorder/pay', {
        openId: $localStorage['openId'],
        orderNo: order.orderNo
      }).success(function(resp) {
        if (resp.code === 200) {
          return wechatPay(resp.data);
        } else {
          return Toast.showMsg(resp.errorMsg);
        }
      }).error(function(err) {
        return console.log(err);
      });
    },
    getOrderList: function() {
      return $http.post('/customerorder/list_by_userid', {
        selectType: $scope.selectTap
      }).success(function(resp) {
        if (resp.code === 200) {
          return $scope.orderList = resp.data.items;
        } else {
          return Toast.showMsg(resp.errorMsg);
        }
      }).error(function(resp, status) {
        console.log(resp);
        return Toast.showSysError(resp.errorMsg);
      });
    },
    doRefresh: function() {
      return $scope.getOrderList();
    },
    cancel: function(id) {
      return orderService.cancel(id).then(function() {
        return $scope.doRefresh();
      });
    }
  });
  return $scope.clickqhl();
});

angular.module('tab-pay', []).controller('TabPayCtrl', function(Toast, wechatUtil, $location, $localStorage, $ionicLoading, $scope, $state, $http, $window, $ionicHistory, $ionicPopup, ListDataService, $ionicScrollDelegate, ionicDatePicker, $filter) {
  var loadData, payCancel, payFail, paySuccess;
  $scope.order = void 0;
  loadData = function() {};
  $http.get("/order/" + $state.params.id, {
    params: {
      history: 0
    }
  }).success(function(resp) {
    $scope.order = resp.message;
    $scope.order.hasServe = _.countBy($scope.order.orderTracks, function(item) {
      return item.state === 2;
    });
    return console.log($scope.order.hasServe);
  }).error(function(resp, status) {
    return Toast.showBusinessError(resp.message);
  });
  loadData();
  $scope.back = function() {
    return $state.go('tab.order-list');
  };
  paySuccess = function() {
    return $state.go('tab.orderDetail', {
      id: $scope.order.id
    });
  };
  payFail = function() {
    return Toast.showMsg('支付失败');
  };
  payCancel = function() {
    return Toast.showMsg('用户取消支付');
  };
  return $scope.pay = function() {
    console.log("pay");
    return $http.get('/payment/wechat/prepay/' + $scope.order.invoice, {
      params: {
        openId: $localStorage['openId']
      }
    }).success(function(resp) {
      if (resp.code === 0) {
        return wechatUtil.jsPay(resp.message.prepay_id, resp.message.timeStamp, resp.message.nonceStr, resp.message.sign, paySuccess, payFail, payCancel);
      } else {
        return Toast.showMsg(resp.message);
      }
    }).error(function(err) {
      return console.log(err);
    });
  };
});

angular.module('tab-orderDetail', []).controller('OrderDetailCtrl', function($location, Toast, $localStorage, $ionicLoading, $scope, $state, $http, $stateParams, $window, $ionicHistory, $ionicPopup, orderService) {
  var loadData;
  $scope.order = $localStorage.orderDetail;
  loadData = function() {
    return $http.get('/customerorderschedule/all_schedule/' + $scope.order.orderNo).success(function(resp) {
      return $scope.scheduleList = resp.data;
    }).error(function(resp, status) {
      return Toast.showBusinessError(resp.message);
    });
  };
  loadData();
  $scope.back = function() {
    return $state.go('tab.order-list');
  };
  return _.extend($scope, {
    cancel: function(id) {
      return orderService.cancel(id).then(function() {
        return loadData();
      });
    },
    goPay: function() {
      return $state.go('tab.pay', {
        id: $scope.order.id
      });
    }
  });
});

angular.module('tab-visinfo', []).controller('TabVisinfoCtrl', function($localStorage, Modal, wfConfig, inWeixin, $location, $scope, $rootScope, Toast, $state, $ionicHistory, $http, $ionicViewSwitcher, userData, $stateParams) {
  $scope.editing = false;
  $scope.setDefault = function(e, info) {
    e.stopPropagation();
    e.preventDefault();
    return $http.put('/visitInfo/' + info.id, {
      isSelect: 1
    }).success(function(resp) {
      Toast.showMsg("已设置为默认就诊信息");
      _.each($scope.infoList, function(item) {
        return item.isSelect = false;
      });
      return info.isSelect = true;
    }).error(function(resp, status) {
      return Toast.showBusinessError(resp.message);
    });
  };
  $scope.canEdit = function() {
    return $scope.editing = !$scope.editing;
  };
  $scope.goEditinfo = function(e, info) {
    $localStorage.ifEdit = 0;
    $localStorage.editInfo = info;
    $localStorage.editOrAdd = "编辑";
    return $state.go("tab.editinfo");
  };
  $http.get('/customerpatient/list').success(function(resp) {
    $scope.infoList = resp.data.items;
    return console.log($scope.infoList);
  }).error(function(resp, status) {
    return Toast.showBusinessError(resp.message);
  });
  $scope.back = function() {
    if ($localStorage.visinfo.fromYuyue) {
      return $ionicHistory.goBack();
    } else {
      return $state.go('tab.myself');
    }
  };
  $scope.addInfo = function() {
    $localStorage.ifEdit = 1;
    $localStorage.editOrAdd = "新增";
    return $state.go("tab.editinfo");
  };
  return $scope.remove = function(e, info) {
    e.stopPropagation();
    return $http.get('/customerpatient/delete/' + info.id).success(function(resp) {
      Toast.showMsg("删除信息成功");
      return $scope.infoList = _.without($scope.infoList, info);
    }).error(function(resp, status) {
      console.log(resp);
      return Toast.showBusinessError(resp.message);
    });
  };
});

angular.module('tab-yuyue', []).controller('TabYuyueCtrl', function(Toast, $location, $localStorage, $ionicLoading, $scope, $state, $http, $window, $ionicHistory, $ionicPopup, ListDataService, $ionicScrollDelegate, ionicDatePicker, $filter, datepickerBaseConfig) {
  var init, initTimeRange, now;
  now = null;
  $scope.info = {};
  $scope.time = {};
  $scope.info.startHour = "08:00";
  $scope.info.endHour = "08:00";
  $scope.scheduleInfo = {};
  $scope.info = $localStorage.getProinfo;
  $scope.info.inpatientAreaId = '';
  $scope.$storage = $localStorage;
  $scope.serviceStartTime = '';
  $scope.serviceEndTime = '';
  $scope.startScend = '';
  $scope.endScend = '';
  init = function() {
    return $http.get('/inpatientarea/all/' + $localStorage.currentHos.id).success(function(resp) {
      if (resp.code === 200) {
        return $scope.lesionList = resp.data;
      }
    }).error(function(resp, status) {
      return Toast.showMsg(resp.errorMsg);
    });
  };
  initTimeRange = function() {
    now = new Date();
    $scope.startTime = $filter('date')(now, 'yyyy-MM-dd');
    return $scope.endTime = $filter('date')(now, 'yyyy-MM-dd');
  };
  initTimeRange();
  $scope.openDatePickerS = function() {
    var config;
    config = datepickerBaseConfig(now, Date.parse($scope.startTime));
    config.callback = function(val) {
      if (val) {
        $scope.startTime = $filter('date')(new Date(val), 'yyyy-MM-dd');
        return $scope.getCharge();
      }
    };
    return ionicDatePicker.openDatePicker(config);
  };
  $scope.openDatePickerE = function() {
    var config;
    config = datepickerBaseConfig(Date.parse($scope.startTime));
    config.callback = function(val) {
      if (val) {
        $scope.endTime = $filter('date')(new Date(val), 'yyyy-MM-dd');
        return $scope.getCharge();
      }
    };
    return ionicDatePicker.openDatePicker(config);
  };
  $scope.commit = function() {
    if ($scope.info.patientName === void 0) {
      Toast.showMsg('请输入病人姓名');
      return false;
    }
    if ($scope.info.inpatientAreaId === void 0 || $scope.info.inpatientAreaId === '') {
      Toast.showMsg('请输入病区信息');
      return false;
    }
    if ($scope.info.inpatientWard === void 0) {
      Toast.showMsg('请输入病床信息');
      return false;
    }
    if ($scope.endScend - $scope.startScend <= 0) {
      return Toast.showMsg('结束时间必须大于开始时间');
    } else {
      $scope.serviceStartTime = $scope.startTime + ' ' + $scope.info.startHour + ':00';
      $scope.serviceEndTime = $scope.endTime + ' ' + $scope.info.endHour + ':00';
      return $http.post('/customerorder/addappointorder', {
        instId: $localStorage.currentHos.id,
        serviceId: $localStorage.getProinfo.serviceId,
        inpatientAreaId: $scope.info.inpatientAreaId,
        inpatientWard: $scope.info.inpatientWard,
        patientName: $scope.info.patientName,
        serviceStartTime: $scope.serviceStartTime,
        serviceEndTime: $scope.serviceEndTime,
        orderRemark: $scope.info.orderRemark
      }).success(function(resp) {
        if (resp.code === 200) {
          Toast.showMsg("预约订单成功");
          return $state.go('tab.order-list');
        } else {
          return Toast.showMsg(resp.errorMsg);
        }
      }).error(function(resp, status) {
        console.log(resp);
        return Toast.showMsg(resp.errorMsg);
      });
    }
  };
  $scope.back = function() {
    return $state.go('tab.home');
  };
  $scope.goChooseInfo = function() {
    $localStorage.visinfo.fromYuyue = true;
    return $state.go("tab.visinfo");
  };
  $scope.getCharge = function() {
    if ($scope.time.startHour === '' || typeof $scope.time.startHour === 'undefined') {
      $scope.info.startHour = '08:00';
    } else {
      $scope.info.startHour = '20:00';
    }
    if ($scope.time.endHour === '' || typeof $scope.time.endHour === 'undefined') {
      $scope.info.endHour = '08:00';
    } else {
      $scope.info.endHour = '20:00';
    }
    $scope.startScend = new Date($scope.startTime + ' ' + $scope.info.startHour + ':00').getTime();
    $scope.endScend = new Date($scope.endTime + ' ' + $scope.info.endHour + ':00').getTime();
    $scope.serviceStartTime = $scope.startTime + ' ' + $scope.info.startHour + ':00';
    $scope.serviceEndTime = $scope.endTime + ' ' + $scope.info.endHour + ':00';
    return $http.post('/customerorder/calc_service_fee', {
      instId: $localStorage.currentHos.id,
      serviceId: $localStorage.getProinfo.serviceId,
      serviceStartTime: $scope.serviceStartTime,
      serviceEndTime: $scope.serviceEndTime
    }).success(function(resp) {
      if (resp.code === 200) {
        return $scope.charge = resp.data;
      } else {
        return Toast.showMsg("获取总价数据失败");
      }
    }).error(function(resp, status) {
      console.log(resp);
      return Toast.showMsg("获取总价数据失败");
    });
  };
  $scope.getCharge();
  return init();
});

angular.module('app-util-filter', []).filter('integer', function() {
  return function(number) {
    return Math.floor(number);
  };
}).filter('dateFix', function() {
  return function(val) {
    if (val >= 1 && val <= 9) {
      return '0' + val;
    } else {
      return val;
    }
  };
}).filter('decimal', function() {
  return function(number) {
    var decimal;
    decimal = (number - Math.floor(number)).toPrecision(3);
    return decimal.substr(2);
  };
}).filter('UnitFilter', function() {
  return function(unit) {
    if (unit === 1) {
      return '时';
    }
    if (unit === 2) {
      return '天';
    }
    if (unit === 3) {
      return '周';
    }
    if (unit === 4) {
      return '月';
    }
    if (unit === 5) {
      return '年';
    }
    return '-';
  };
}).filter('SexFilter', function() {
  return function(sex) {
    if (sex === 1) {
      return '男';
    }
    if (sex === 2) {
      return '女';
    }
    return '-';
  };
}).filter('StatusFilter', function() {
  return function(status) {
    if (status === 1) {
      return '待排班';
    }
    if (status === 2) {
      return '已取消';
    }
    if (status === 3) {
      return '服务中';
    }
    if (status === 4) {
      return '待支付';
    }
    if (status === 5) {
      return '已支付';
    }
    if (status === 6) {
      return '已完成';
    }
    return '-';
  };
});

angular.module('datepicker-util', []).service('datepickerBaseConfig', function() {
  return function(begin, input) {
    var end;
    if (begin == null) {
      begin = new Date();
    }
    if (input == null) {
      input = null;
    }
    console.log(begin);
    begin = new Date(begin);
    end = new Date(begin);
    end.setYear(end.getFullYear() + 1);
    if (!input) {
      input = new Date(begin);
    } else {
      input = new Date(input);
    }
    return {
      inputDate: input,
      titleLabel: '选择日期',
      setLabel: '确定',
      todayLabel: '今天',
      closeLabel: '关闭',
      mondayFirst: false,
      weeksList: ["日", "一", "二", "三", "四", "五", "六"],
      monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      templateType: 'popup',
      from: begin,
      to: end,
      showTodayButton: true,
      dateFormat: 'yyyy-MM-dd',
      closeOnSelect: false,
      disableWeekdays: []
    };
  };
});

angular.module('app-util-func', ['wechat-func', 'order-util', 'datepicker-util']).service('popup', function($ionicPopup) {
  return {
    error: function(msg) {
      return $ionicPopup.alert({
        title: '温馨提示',
        template: msg
      });
    },
    info: function(msg) {
      return $ionicPopup.alert({
        title: '温馨提示',
        template: msg
      });
    }
  };
}).factory('validator', function() {
  return {
    phone: function(phone) {
      return /^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/.test(phone);
    }
  };
}).factory('guid', function($localStorage) {
  var guid;
  guid = $localStorage.get('wf-guid');
  if (_.isEmpty(guid)) {
    guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r, v;
      r = Math.random() * 16 | 0;
      v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
    $localStorage.set('wf-guid', guid);
  }
  return guid;
}).service('userData', function($localStorage, $http, $q) {
  return {
    getToken: function() {
      return $localStorage['token'];
    },
    setToken: function(token) {
      return $localStorage['token'] = token;
    },
    reset: function() {
      $localStorage['user'] = null;
      return $localStorage['token'] = null;
    },
    get: function() {
      return angular.copy($localStorage['user']);
    },
    set: function(user) {
      return $localStorage['user'] = user;
    }
  };
});

angular.module('order-util', []).service('orderService', function($ionicPopup, $http, $q, Toast) {
  return {
    cancel: function(id) {
      var deffer, myPopup;
      deffer = $q.defer();
      myPopup = $ionicPopup.confirm({
        title: '是否要取消预约',
        template: '取消预约后仍需要继续服务需要重新下单哦！',
        okText: '确认',
        cancelText: '我再想想'
      });
      return myPopup.then(function(res) {
        if (res) {
          return $http.get('/customerorder/cancel/' + id).success(function(resp) {
            if (resp.code === 200) {
              Toast.showMsg("取消预约成功");
              deffer.resolve();
              return console.log(resp);
            } else {
              console.log(resp);
              return Toast.showBusinessError(resp);
            }
          }).error(function(resp, status) {
            console.log(resp);
            return Toast.showSysError(resp);
          });
        } else {
          return console.log('cancel');
        }
      });
    }
  };
});

angular.module('wechat-func', []).constant('inWeixin', /micromessenger/.test(navigator.userAgent.toLowerCase()));

angular.module('http-interceptor', ['constants', 'app-util-func', 'ngStorage', 'ionic']).run(function($rootScope, $ionicLoading) {
  $rootScope.showLoading = function() {
    return $ionicLoading.show();
  };
  return $rootScope.hideLoading = function() {
    return $ionicLoading.hide();
  };
}).config([
  '$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $httpProvider.defaults.transformRequest = function(data) {
      if (data === void 0) {
        return data;
      }
      return $.param(data);
    };
  }
]).config(function($provide, $httpProvider, backend, inWeixin, $localStorageProvider) {
  var httpDecorator;
  if (backend) {
    httpDecorator = function($delegate) {
      return function(method, url, post, callback, headers, timeout, withCredentials) {
        var token;
        if (url !== null && url !== void 0 && url.charAt(0) === '/') {
          if (url !== '/customer/login' && url !== '/customer/register') {
            token = $localStorageProvider.get('token');
            if (token !== null) {
              if (url.indexOf('?') < 0) {
                url = url + ("?token=" + token);
              } else {
                url = url + ("&token=" + token);
              }
            }
          }
          url = backend + url;
        }
        return $delegate(method, url, post, callback, headers, timeout, withCredentials);
      };
    };
    $provide.decorator('$httpBackend', ["$delegate", httpDecorator]);
  }
  if (inWeixin) {
    $provide.decorator('$ionicHistory', function($delegate) {
      $delegate.goBack = function(i) {
        if (i !== void 0) {
          return window.history.go(i);
        } else {
          return window.history.back();
        }
      };
      return $delegate;
    });
  }
  return $httpProvider.interceptors.push(function($q, $rootScope) {
    return {
      request: function(config) {
        if (config.loadingAnimation !== false) {
          $rootScope.showLoading();
        }
        return config;
      },
      response: function(response) {
        var ref;
        if (((ref = response.config) != null ? ref.loadingAnimation : void 0) !== false) {
          $rootScope.hideLoading();
        }
        return response;
      },
      responseError: function(rejection) {
        var ref;
        if (((ref = rejection.config) != null ? ref.loadingAnimation : void 0) !== false) {
          $rootScope.hideLoading();
        }
        return $q.reject(rejection);
      }
    };
  });
});

angular.module('app-util-interceptor', ['http-interceptor', 'url-interceptor']);

angular.module('url-interceptor', []).run(function($ionicPlatform, userData, $localStorage) {
  var $hashIndex, $key, $params, $qIndex, $str, $url, $urlArr, $value, i, len, results;
  $url = location.href;
  $qIndex = $url.indexOf('?');
  $hashIndex = $url.indexOf('#');
  $urlArr = $qIndex < $hashIndex ? $url.substr($qIndex + 1, $hashIndex - $qIndex - 1).split('&') : $url.substr($qIndex + 1).split('&');
  $params = {};
  results = [];
  for (i = 0, len = $urlArr.length; i < len; i++) {
    $str = $urlArr[i];
    $key = $str.split('=')[0];
    $value = $str.split('=')[1];
    $params[$key] = $value;
    if ($key === 'token') {
      results.push($localStorage.token = $params[$key]);
    } else {
      results.push(void 0);
    }
  }
  return results;
});

//# sourceMappingURL=app.js.map
