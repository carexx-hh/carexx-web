angular.module('app.controllers', [])

	.controller("LoginCtrl", function($scope, $state, AclUserSvr, LocalStorageProvider, GlobalConst) {
		$scope.data = {};
		$scope.onEnter = function(e) {
			if($scope.loginForm.$valid) {
				var keycode = window.event ? e.keyCode : e.which;
				if(keycode == 13) {
					$scope.submit();
				}
			}
		};

		$scope.submit = function() {
			if($scope.data.loginPass.length<6){
				alert("密码长度至少需要6位");
				return;
			}
			AclUserSvr.login($scope.data).success(function(res) {
				if(res.code == 200) {
					LocalStorageProvider.set(GlobalConst.AUTH_TOKEN_CACHE_NAME, res.data);
					$state.go(GlobalConst.DEFAULT_WELCOME_URI);
				} else {
					alert(res.errorMsg);
				}
			});
		};

		$scope.init = function() {
			if(LocalStorageProvider.get(GlobalConst.AUTH_TOKEN_CACHE_NAME, "") != "") {
				$state.go(GlobalConst.DEFAULT_WELCOME_URI);
			}
		};
		$scope.init();
	})
	
	
	
	
	.controller("MainCtrl", function($rootScope, $scope, $state, AclUserSvr, LocalStorageProvider, GlobalConst,$uibModal) {
		$rootScope.userInfo = {};
		$rootScope.roleInfo = {};
		$rootScope.roleMenuList = [];
		$rootScope.ops = {};
		$rootScope.careInst = {};

		$scope.getUserInfo = function() {
			AclUserSvr.getUserInfo().success(function(res) {
				if(res.code == 200) {
					$rootScope.userInfo = res.data.userInfo;
					$rootScope.roleInfo = res.data.roleInfo;
					$rootScope.roleMenuList = res.data.roleMenuList;
					$rootScope.ops = res.data.roleOperInfo;
					$rootScope.careInst = res.data.careInst;
				}
			});
		};

		$scope.logout = function() {
			LocalStorageProvider.set(GlobalConst.AUTH_TOKEN_CACHE_NAME, "");
			$state.go("login");
		};
		
		$scope.modifyPwPopup = function(item,tag) {
			var modalInstance = $uibModal.open({
				size: 'lg',
				templateUrl: 'modifyPwPopup.html', //script标签中定义的id
				controller: 'modifyPwPopupCtrl', //modal对应的Controller
				resolve: {
					transmitData: function() { //data作为modal的controller传入的参数
						return null; //用于传递数据
					}
				}
			})
			modalInstance.result.then( //then的第一个函数对应ok(),第二个函数对应cancel()
				function() {
					$scope.logout();
				},
				function() {
					
				}
			);
		}
		
		

		$scope.init = function() {
			$scope.getUserInfo();
		};

		$scope.$on('repeatFinishCallback', function() {
			initMenuAnimate();
		});

		$scope.init();
	})

	.controller("DashboardCtrl", function($scope, $state) {
		
		
	})

	//修改密码弹出框
	.controller('modifyPwPopupCtrl', function($scope, $uibModalInstance, InstListSvr, LocalStorageProvider,AclUserSvr) {
		$scope.data = {};
		//在这里处理要进行的操作
		$scope.choice = function() {
			$uibModalInstance.close();
		};
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		}
		$scope.close = function() {
			$uibModalInstance.dismiss('cancel');
		}
		
		$scope.save = function(){
			if($scope.data.newPwd!=$scope.data.newPwdConfirm){
				alert("确认密码不一致");
				return false;
			}
			showLoading();
			AclUserSvr.modifyPwd($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("修改密码成功");
					$scope.choice();
				} else {
					alert(res.errorMsg);
				}
			});
		}


	})


	//服务单位弹出框InstChoiceCtrl
	.controller('InstChoiceCtrl', function($scope, $uibModalInstance, InstListSvr, LocalStorageProvider) {
		$scope.data = {};
		//在这里处理要进行的操作
		$scope.choice = function(list) {
			$uibModalInstance.close(list);
		};
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		}
		$scope.close = function() {
			$uibModalInstance.dismiss('cancel');
		}

		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};


		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			InstListSvr.servicelist($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.instList = res.data.items;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.$watch('pagerConf.currentPage', $scope.query);
	})

	//客户选择弹出框
	.controller('CustomerChoiceCtrl', function($scope, $uibModalInstance, CustomerSvr, LocalStorageProvider) {
		$scope.data = {};
		//在这里处理要进行的操作
		$scope.choice = function(list) {
			$uibModalInstance.close(list);
		};
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		}
		$scope.close = function() {
			$uibModalInstance.dismiss('cancel');
		}
		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};

		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			CustomerSvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.custList = res.data.items;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.$watch('pagerConf.currentPage', $scope.query);
	})

	//订单弹出框
	.controller('SchedulePopupCtrl', function($scope, $uibModalInstance, OrderSvr, LocalStorageProvider, transmitData,CompanySvr,$timeout) {
		
		$scope.voucherNo='';
		$scope.data = transmitData;
		$scope.data.adjustAmt=transmitData.adjustAmt;
		$scope.data.payType=transmitData.payType;

		if(transmitData.proofType=="1"){
			$scope.data.proofNo=$scope.data.receiptNo;
		}else{
			$scope.data.proofNo=$scope.data.invoiceNo;
		}		

		$scope.schList = [];

		//在这里处理要进行的操作
		$scope.choice = function(list) {
			$uibModalInstance.close(list);
		};
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		}
		$scope.close = function() {
			$uibModalInstance.dismiss('cancel');
		}
		
		$scope.init = function() {
			CompanySvr.listAll().success(function(res) {
					if(res.code == 200) {
						$scope.instSysList = res.data;
					} else {
						alert(res.errorMsg);
					}
				})
				.error(function() {
					hideLoading();
				});

		}

		$scope.checkAll = function(selectAll) {
			for(var i = 0; i < $scope.schList.length; i++) {
				if(selectAll == true) {
					if($scope.schList[i].serviceStatus == 1) {
						$scope.schList[i].checked = true;
					}
				} else {
					$scope.schList[i].checked = false;
				}
			}
		}

		$scope.getSchList = function(data) {
			showLoading();
			OrderSvr.schAll(data).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.schList = res.data;
						for(var i = 0; i < $scope.schList.length; i++) {
							$scope.schList[i].checked = false;
						}
					} else {
						alert(res.errorMsg);
					}
				})
				.error(function() {
					hideLoading();
				});
		}

		$scope.confirm = function() {
			$scope.ids = '';
			for(var i = 0; i < $scope.schList.length; i++) {
				if($scope.schList[i].checked == true) {
					$scope.ids = $scope.ids + $scope.schList[i].id + ','
				}
			}
			if($scope.ids.length == 0) {
				alert("请选一条排班信息");
				return;
			}
			$scope.ids = $scope.ids.substring(0, $scope.ids.length - 1)
			if(window.confirm("确认这些排班信息？")) {
				showLoading();
				OrderSvr.confirm($scope.ids).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						alert("确认成功");
						$scope.getSchList(transmitData);
					} else {
						alert(res.errorMsg);
					}
				});
			}
		}
		
		$scope.complete=function(){	
			if($scope.data.proofType=="1"){
				$scope.data.receiptNo=$scope.data.proofNo;
			}else{
				$scope.data.invoiceNo=$scope.data.proofNo;
			}
			showLoading();
			OrderSvr.complete($scope.data).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$uibModalInstance.dismiss('cancel');						
					} else {
						alert(res.errorMsg);
					}
				})
				.error(function() {
					hideLoading();
				});
		}
		
		$scope.adjust=function(){				
			$scope.data.adjustAmt=$scope.data.adjustAmt.toFixed(2);
			if($scope.data.proofType=="1"){
				$scope.data.receiptNo=$scope.data.proofNo;
			}else{
				$scope.data.invoiceNo=$scope.data.proofNo;
			}
			showLoading();
			OrderSvr.adjust($scope.data).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						alert('调整成功');
						$uibModalInstance.dismiss('cancel');						
					} else {
						alert(res.errorMsg);
						$uibModalInstance.dismiss('cancel');
					}
				})
				.error(function() {
					hideLoading();
				});
		}
		
		$scope.confirmpay=function(){				
			showLoading();
			OrderSvr.confirmpay($scope.data).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						alert('支付成功');
						$uibModalInstance.dismiss('cancel');						
					} else {
						alert(res.errorMsg);
						$uibModalInstance.dismiss('cancel');
					}
				})
				.error(function() {
					hideLoading();
				});
		}
		
		$scope.init();
		$scope.getSchList(transmitData);
		
	})
	
	//工量弹出框
	.controller('WqPopupCtrl', function($scope, $uibModalInstance, LocalStorageProvider, transmitData,WorkQuanitySvr) {
		$scope.data = transmitData;
		$scope.data.adjustAmt='';
		$scope.voucherNo='';
		$scope.schList = [];

		//在这里处理要进行的操作
		$scope.choice = function(list) {
			$uibModalInstance.close(list);
		};
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		}
		$scope.close = function() {
			$uibModalInstance.dismiss('cancel');
		}
		
		
		
		$scope.adjust=function(){	
			showLoading();
			$scope.data.adjustAmt=$scope.data.adjustAmt.toFixed(2);
			WorkQuanitySvr.adjust($scope.data).success(function(res) {
					if(res.code == 200) {
						alert('调整金额成功');
						$uibModalInstance.dismiss('cancel');
						hideLoading();
					} else {
						alert(res.errorMsg);
						$uibModalInstance.dismiss('cancel');
						hideLoading();
					}
				})
				.error(function() {
					hideLoading();
				});
		}
		
		
	})


	//人员选择弹出框
	.controller('StaffChoiceCtrl', function($scope, $uibModalInstance, StaffSvr, LocalStorageProvider, transmitData) {
		$scope.data = {};
		$scope.data.serviceId = transmitData.serviceId;
		//在这里处理要进行的操作
		$scope.choice = function(list) {
			$uibModalInstance.close(list);
		};
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		}
		$scope.close = function() {
			$uibModalInstance.dismiss('cancel');
		}
		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};

		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			StaffSvr.queryByserId($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.staffList = res.data.items;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.$watch('pagerConf.currentPage', $scope.query);
	})
	
	//外派社区人员选择弹出框
	.controller('outStaffChoiceCtrl', function($scope, $uibModalInstance, StaffSvr, LocalStorageProvider, transmitData) {
		$scope.data = {};
		//在这里处理要进行的操作
		$scope.choice = function(list) {
			$uibModalInstance.close(list);
		};
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		}
		$scope.close = function() {
			$uibModalInstance.dismiss('cancel');
		}
		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};

		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			StaffSvr.queryByserId($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.staffList = res.data.items;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.$watch('pagerConf.currentPage', $scope.query);
	})
	
	//新增关账弹出框
	.controller('BillAddCtrl', function($scope, $uibModalInstance, BillListSvr, LocalStorageProvider,$filter) {
		$scope.data = {};
		//在这里处理要进行的操作
		$scope.save = function() {
			
			if(window.confirm("确定创建此关账日期？")) {
				showLoading();
				BillListSvr.add($scope.data).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						alert('添加关账成功');
						$uibModalInstance.close();
					} else {
						alert(res.errorMsg);
					}
				});
			}
			
			
		};
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		}
		$scope.close = function() {
			$uibModalInstance.dismiss('cancel');
		}

		
	})

	/*人员档案*/
	.controller("StaffListCtrl", function($scope, $state, StaffSvr, LocalStorageProvider, GlobalConst, WorkTypeSvr) {
		$scope.data = {};

		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};
		
		$scope.init = function() {
			showLoading();
			WorkTypeSvr.listAll().success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.workTypeList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			StaffSvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.staffList = res.data.items;
				} else {
					alert(res.errorMsg);
				}
			});
		}
		
		$scope.exportReport= function(){
			$scope.data.token=LocalStorageProvider.get(GlobalConst.AUTH_TOKEN_CACHE_NAME, "");
			$scope.urlStr="inststaff/export_inststaff";
			post($scope.urlStr,$scope.data);		
		}

		$scope.add = function() {
			$state.go("/.staffAdd")
		}

		$scope.edit = function(list) {
			LocalStorageProvider.setObject("staff.item", list);
			$state.go('/.staffEdit');
		}

		$scope.delete = function(id) {
			if(window.confirm("确定删除数据？")) {
				showLoading();
				StaffSvr.delete(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}

		}
		
		
		$scope.init();
		$scope.$watch('pagerConf.currentPage', $scope.query);

	})

	/*人员档案新增*/
	.controller("StaffAddCtrl", function($scope, $state, StaffSvr, LocalStorageProvider, $uibModal, WorkTypeSvr) {
		$scope.data = {};

		$scope.init = function() {
			showLoading();
			WorkTypeSvr.listAll().success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.workTypeList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		var serviceInstId = "";
		$scope.choiceServiceInstId = function() {
			var modalInstance = $uibModal.open({
				size: 'lg',
				templateUrl: 'instChoice.html', //script标签中定义的id
				controller: 'InstChoiceCtrl', //modal对应的Controller
				resolve: {
					serviceInstId: function() { //data作为modal的controller传入的参数
						return null; //用于传递数据
					}
				}
			})
			modalInstance.result.then( //then的第一个函数对应ok(),第二个函数对应cancel()
				function(list) {
					$scope.data.serviceInstId = list.id;
					$scope.data.serInstName = list.instName;
				},
				function() {
					console.log("用户取消操作");
				}
			);
		}

		$scope.init();

		$scope.save = function() {
			if(!(/((11|12|13|14|15|21|22|23|31|32|33|34|35|36|37|41|42|43|44|45|46|50|51|52|53|54|61|62|63|64|65)[0-9]{4})(([1|2][0-9]{3}[0|1][0-9][0-3][0-9][0-9]{3}[Xx0-9])|([0-9]{2}[0|1][0-9][0-3][0-9][0-9]{3}))/.test($scope.data.idNo))) {
				alert("请输入正确的身份证格式");
				return false;
			}
			if($scope.data.birthday == null) {
				$scope.data.birthday = ""
			}
			if($scope.data.leavedate == null) {
				$scope.data.leavedate = ""
			}
			if($scope.data.entrydate == null) {
				$scope.data.entrydate = ""
			}
			if($scope.data.phone == null) {
				$scope.data.phone = ""
			}
			showLoading();
			StaffSvr.add($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("添加成功");
					$state.go("/.staffList");
				} else {
					alert(res.errorMsg);
				}
			});
		}

	})

	/*人员档案编辑*/
	.controller("StaffEditCtrl", function($scope, $state, StaffSvr, LocalStorageProvider, $uibModal) {
		$scope.data = {};
		$scope.staffItem = LocalStorageProvider.getObject("staff.item");
		$scope.data = $scope.staffItem;
		$scope.data.serInstName = $scope.staffItem.serviceInstName;
		$scope.data.sex = "" + $scope.staffItem.sex;
		$scope.data.personType = "" + $scope.staffItem.personType;
		$scope.data.jobStatus = "" + $scope.staffItem.jobStatus;
		if($scope.data.address == "null" || $scope.data.address == null) {
			$scope.data.address = "";
		}

		var serviceInstId = "";

		$scope.choiceServiceInstId = function() {
			var modalInstance = $uibModal.open({
				size: 'lg',
				templateUrl: 'instChoice.html', //script标签中定义的id
				controller: 'InstChoiceCtrl', //modal对应的Controller
				resolve: {
					serviceInstId: function() { //data作为modal的controller传入的参数
						return null; //用于传递数据
					}
				}
			})
			modalInstance.result.then( //then的第一个函数对应ok(),第二个函数对应cancel()
				function(list) {
					$scope.data.serviceInstId = list.id;
					$scope.data.serInstName = list.instName;
				},
				function() {
					console.log("用户取消操作");
				}
			);
		}

		$scope.save = function() {
			if(!(/((11|12|13|14|15|21|22|23|31|32|33|34|35|36|37|41|42|43|44|45|46|50|51|52|53|54|61|62|63|64|65)[0-9]{4})(([1|2][0-9]{3}[0|1][0-9][0-3][0-9][0-9]{3}[Xx0-9])|([0-9]{2}[0|1][0-9][0-3][0-9][0-9]{3}))/.test($scope.data.idNo))) {
				alert("请输入正确的身份证格式");
				return false;
			}
			if($scope.data.birthday == null) {
				$scope.data.birthday = ""
			}
			if($scope.data.leavedate == null) {
				$scope.data.leavedate = ""
			}
			if($scope.data.entrydate == null) {
				$scope.data.entrydate = ""
			}
			if($scope.data.phone == null) {
				$scope.data.phone = ""
			}
			showLoading();
			StaffSvr.modify($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("修改成功");
					$state.go("/.staffList");
				} else {
					alert(res.errorMsg);
				}
			});
		}

	})
	/*节假管理*/
	.controller("HolidayListCtrl", function($scope, $state, HolidaySvr, LocalStorageProvider) {
		$scope.data = {};

		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};

		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			HolidaySvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.holidayList = res.data.items;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.add = function() {
			$state.go("/.holidayAdd");
		}

		$scope.edit = function(item) {
			LocalStorageProvider.setObject("holiday.item", item);
			$state.go('/.holidayEdit');
		}

		$scope.delete = function(id) {
			if(window.confirm("确定删除数据？")) {
				showLoading();
				HolidaySvr.delete(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}

		}

		$scope.$watch('pagerConf.currentPage', $scope.query);

	})

	/*节假管理新增*/
	.controller("HolidayAddCtrl", function($scope, $state, HolidaySvr, LocalStorageProvider) {
		$scope.data = {};
		$scope.data.instId = "1";

		$scope.save = function() {
			showLoading();
			HolidaySvr.add($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("节假日添加成功");
					$state.go("/.holidayList");
				} else {
					alert(res.errorMsg);
				}
			});
		}

	})

	/*节假管理编辑*/
	.controller("HolidayEditCtrl", function($scope, $state, HolidaySvr, LocalStorageProvider) {
		$scope.data = LocalStorageProvider.getObject("holiday.item");

		$scope.save = function() {
			showLoading();
			HolidaySvr.modify($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("修改节假日成功");
					$state.go("/.holidayList");
				} else {
					alert(res.errorMsg);
				}
			});
		}

	})
	
	/*节假管理*/
	.controller("LesionListCtrl", function($scope, $state, LesionSvr, LocalStorageProvider) {
		$scope.data = {};

		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};

		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			LesionSvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.lesionList = res.data.items;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.add = function() {
			$state.go("/.lesionAdd");
		}

		$scope.edit = function(item) {
			LocalStorageProvider.setObject("lension.item", item);
			$state.go('/.lesionEdit');
		}

		$scope.delete = function(id) {
			if(window.confirm("确定删除数据？")) {
				showLoading();
				LesionSvr.delete(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}

		}

		$scope.$watch('pagerConf.currentPage', $scope.query);

	})

	/*节假管理新增*/
	.controller("LesionAddCtrl", function($scope, $state, LesionSvr, LocalStorageProvider) {
		$scope.data = {};
		$scope.data.instId = "1";

		$scope.save = function() {
			showLoading();
			LesionSvr.add($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("病区添加成功");
					$state.go("/.lesionList");
				} else {
					alert(res.errorMsg);
				}
			});
		}

	})

	/*节假管理编辑*/
	.controller("LesionEditCtrl", function($scope, $state, LesionSvr, LocalStorageProvider) {
		$scope.data = LocalStorageProvider.getObject("lension.item");

		$scope.save = function() {
			showLoading();
			LesionSvr.modify($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("修改病区成功");
					$state.go("/.lesionList");
				} else {
					alert(res.errorMsg);
				}
			});
		}

	})


	/*客户档案*/
	.controller("CustomerListCtrl", function($scope, $state, CustomerSvr, LocalStorageProvider) {
		$scope.data = {};

		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};

		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			CustomerSvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.custList = res.data.items;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.add = function() {
			$state.go("/.customerAdd")
		}

		$scope.edit = function(list) {
			LocalStorageProvider.setObject("cust.item", list);
			$state.go('/.customerEdit');
		}

		$scope.delete = function(id) {
			if(window.confirm("确定删除数据？")) {
				showLoading();
				CustomerSvr.delete(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}

		}

		$scope.$watch('pagerConf.currentPage', $scope.query);

	})

	/*客户档案新增*/
	.controller("CustomerAddCtrl", function($scope, $state, CustomerSvr, LocalStorageProvider) {
		$scope.data = {};

		$scope.save = function() {
			if($scope.data.idNo != "" && typeof $scope.data.idNo != "undefined") {
				if(!(/((11|12|13|14|15|21|22|23|31|32|33|34|35|36|37|41|42|43|44|45|46|50|51|52|53|54|61|62|63|64|65)[0-9]{4})(([1|2][0-9]{3}[0|1][0-9][0-3][0-9][0-9]{3}[Xx0-9])|([0-9]{2}[0|1][0-9][0-3][0-9][0-9]{3}))/.test($scope.data.idNo))) {
					alert("请输入正确的身份证格式");
					return false;
				}
			}
			if($scope.data.sex == "" || typeof $scope.data.sex == "undefined") {
				$scope.data.sex = 0;
			}
			showLoading();
			CustomerSvr.add($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("添加客户信息成功");
					$state.go("/.customerList");
				} else {
					$scope.data.sex = "";
					alert(res.errorMsg);
				}
			});
		}

	})

	/*客户档案编辑*/
	.controller("CustomerEditCtrl", function($scope, $state, CustomerSvr, LocalStorageProvider) {

		$scope.custItem = LocalStorageProvider.getObject("cust.item");
		$scope.data = {};
		$scope.data = $scope.custItem;
		$scope.data.sex = "" + $scope.custItem.sex;
		$scope.data.linkmanRelationship = "" + $scope.custItem.linkmanRelationship;
		if($scope.custItem.sex == "null" || $scope.custItem.sex == null) {
			$scope.data.sex = "0"
		}

		$scope.save = function() {
			if($scope.data.idNo != null && $scope.data.idNo != "" && typeof $scope.data.idNo != "undefined") {
				if(!(/((11|12|13|14|15|21|22|23|31|32|33|34|35|36|37|41|42|43|44|45|46|50|51|52|53|54|61|62|63|64|65)[0-9]{4})(([1|2][0-9]{3}[0|1][0-9][0-3][0-9][0-9]{3}[Xx0-9])|([0-9]{2}[0|1][0-9][0-3][0-9][0-9]{3}))/.test($scope.data.idNo))) {
					alert("请输入正确的身份证格式");
					return false;
				}
			}
			if($scope.data.sex == "" || typeof $scope.data.sex == "undefined") {
				$scope.data.sex = 0;
			}
			showLoading();
			CustomerSvr.modify($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("修改客户信息成功");
					$state.go("/.customerList");
				} else {
					alert(res.errorMsg);
				}
			});
		}

	})

	/*服务项目*/
	.controller("CareserListCtrl", function($scope, $state, CareserSvr, WorkTypeSvr, LocalStorageProvider) {
		$scope.data = {};

		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};

		$scope.into = function() {
			WorkTypeSvr.listAll().success(function(res) {
				if(res.code == 200) {
					$scope.workTypeList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			CareserSvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.careserList = res.data.items;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.add = function() {
			$state.go("/.careserAdd")
		}

		$scope.edit = function(list) {
			LocalStorageProvider.setObject("ser.item", list);
			$state.go('/.careserEdit');
		}

		$scope.delete = function(id) {
			if(window.confirm("确定删除数据？")) {
				showLoading();
				CareserSvr.delete(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}

		}

		$scope.into();
		$scope.$watch('pagerConf.currentPage', $scope.query);

	})

	/*服务项目新增*/
	.controller("CareserAddCtrl", function($scope, $state, CareserSvr, ServiceSvr, LocalStorageProvider) {
		$scope.data = {};

		$scope.into = function() {
			showLoading();
			ServiceSvr.listAll().success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.serviceList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.save = function() {
			if($scope.data.serialNumber <= 0 || $scope.data.serialNumber != Math.floor($scope.data.serialNumber)){
				alert("服务编号必须为大于0整数");
				return false;
			}
			showLoading();
			CareserSvr.add($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("添加服务成功");
					$state.go("/.careserList");
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.into();
	})

	/*服务项目编辑*/
	.controller("CareserEditCtrl", function($scope, $state, CareserSvr, ServiceSvr, LocalStorageProvider, $timeout) {
		$scope.data = LocalStorageProvider.getObject("ser.item");
		$scope.data.serialNumber = "" + LocalStorageProvider.getObject("ser.item").serialNumber;
		$scope.data.serviceUnit = "" + LocalStorageProvider.getObject("ser.item").serviceUnit;
		$scope.data.serviceAddress = "" + LocalStorageProvider.getObject("ser.item").serviceAddress;
		$scope.into = function() {
			showLoading();
			ServiceSvr.listAll().success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.serviceList = res.data;
					$timeout(function() {
						$scope.data.serviceId = "" + LocalStorageProvider.getObject("ser.item").serviceId;
					}, 100)
				} else {
					alert(res.errorMsg);
				}
			});

		}

		$scope.save = function() {
			if($scope.data.serialNumber <= 0 || $scope.data.serialNumber != Math.floor($scope.data.serialNumber)){
				alert("服务编号必须为大于0整数");
				return false;
			}
			showLoading();
			CareserSvr.modify($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("修改服务成功");
					$state.go("/.careserList");
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.into();
	})

	/*订单管理*/
	.controller("OrderListCtrl", function($scope, $state, OrderSvr, LocalStorageProvider, $uibModal,CompanySvr,$filter) {
		$scope.data = {};
		$scope.totalAmt=0;
		$scope.data.serviceStartTime=$filter('date')(new Date-(1000*60*60*24*60), 'yyyy-MM-dd');
		
		var transmitData = '';
		$scope.selectAll = false;
		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};
		
		$scope.init = function() {
			CompanySvr.listAll().success(function(res) {
				if(res.code == 200) {
					$scope.instSysList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
		}
		$scope.reset = function() {
			$scope.data = {};
		}

		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;			
			showLoading();
			OrderSvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.orderList = res.data.items;
					$scope.totalAmt=0;
					if($scope.orderList!=[]&&$scope.orderList!=null){
						for(var i=0;i<$scope.orderList.length;i++){
							$scope.totalAmt=$scope.totalAmt+$scope.orderList[i].orderAmt;
						}
					}
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.checkAll = function(selectAll) {
			for(var i = 0; i < $scope.schList.list; i++) {
				if(selectAll == true) {
					$scope.schList[i].checked = true;
				} else {
					$scope.schList[i].checked = false;
				}
			}
		}

		$scope.schedulePopup = function(item,tag) {
			$scope.orderItem = item;
			$scope.orderItem.tag=tag;
			var modalInstance = $uibModal.open({
				size: 'lg',
				templateUrl: 'schedulePopup.html', //script标签中定义的id
				controller: 'SchedulePopupCtrl', //modal对应的Controller
				resolve: {
					transmitData: function() { //data作为modal的controller传入的参数
						return $scope.orderItem; //用于传递数据
					}
				}
			})
			modalInstance.result.then( //then的第一个函数对应ok(),第二个函数对应cancel()
				function() {

				},
				function() {
					$scope.query();
				}
			);
		}

		$scope.add = function() {
			$state.go("/.orderAdd")
		}
		
		$scope.addCommunity = function() {
			$state.go("/.orderAddCommunity")
		}

		$scope.arrange = function(list) {
			LocalStorageProvider.setObject("order.item", list);
			if(list.serviceAddress == 1){
				$state.go("/.orderSchedule")
			}else if(list.serviceAddress == 2){
				$state.go("/.orderOutSchedule")
			}
		}

		$scope.cancel = function(list) {
			if(window.confirm("确定取消订单？")) {
				showLoading();
				OrderSvr.cancel(list).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}

		}
		
		$scope.canceled = function(list) {
			if(window.confirm("确定删除订单？")) {
				showLoading();
				OrderSvr.canceled(list).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}

		}
		
		$scope.init();
		$scope.$watch('pagerConf.currentPage', $scope.query);

	})

	/*订单管理新增*/
	.controller("OrderAddCtrl", function($scope, $state, OrderSvr, LocalStorageProvider, $uibModal, ServiceSvr, CareserSvr, $filter,LesionSvr) {
		$scope.data = {};
		$scope.handle = {};
		var transmitData = "";
		$scope.handle.startTime = "08:00";
		$scope.handle.endTime = "08:00";
		$scope.data.orderStatus = "1";
		$scope.data.serviceAddress = "1";

		$scope.choseCustomer = function() {
			var modalInstance = $uibModal.open({
				size: 'lg',
				templateUrl: 'customerChoice.html', //script标签中定义的id
				controller: 'CustomerChoiceCtrl', //modal对应的Controller
				resolve: {
					transmitData: function() { //data作为modal的controller传入的参数
						return null; //用于传递数据
					}
				}
			})
			modalInstance.result.then( //then的第一个函数对应ok(),第二个函数对应cancel()
				function(list) {
					$scope.data.customerId = list.id;
					$scope.data.customerName = list.realName;
				},
				function() {
					console.log("用户取消操作");
				}
			);
		}

		$scope.init = function() {
			CareserSvr.listAll($scope.data).success(function(res) {
				if(res.code == 200) {
					$scope.serviceList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
			
			LesionSvr.listAll().success(function(res) {
				if(res.code == 200) {
					$scope.lesionList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
		}
		
		$scope.initEndTime = function() {
			var hours = $filter('date')($scope.handle.startTime, 'HH:mm').substring(0,2);
			alert(hours);
		}
		
		$scope.getServiceId = function(id) {
			for(var i = 0; i < $scope.serviceList.length; i++) {
				if(id == $scope.serviceList[i].serviceId) {
					$scope.priceUnit = "" + $scope.serviceList[i].servicePrice + "/" + $filter('UnitFilter')($scope.serviceList[i].serviceUnit)
				}else{
					
				}				
			}
			
			if(id==''||typeof id=='undefined'){
				$scope.priceUnit = ""
			}
		}

		$scope.save = function() {
			$scope.data.serviceStartTime = $scope.handle.startDate + " " + $scope.handle.startTime;
			$scope.data.serviceEndTime = $scope.handle.endDate + " " + $scope.handle.endTime;
			showLoading();
			OrderSvr.add($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("添加成功");
					$state.go("/.orderList");
				} else {
					$scope.data.sex = "";
					alert(res.errorMsg);
				}
			});
		}

		$scope.init();

	})

	/*订单管理新增社区*/
	.controller("OrderAddCommunityCtrl", function($scope, $state, OrderSvr, LocalStorageProvider, $uibModal, ServiceSvr, CareserSvr, $filter,LesionSvr) {
		$scope.data = {};
		$scope.handle = {};
		var transmitData = "";
		$scope.handle.startTime = "00:00:00";
		$scope.handle.endTime = "00:00:00";
		$scope.data.orderStatus = "1";
		$scope.data.serviceAddress = "2";

		$scope.choseCustomer = function() {
			var modalInstance = $uibModal.open({
				size: 'lg',
				templateUrl: 'customerChoice.html', //script标签中定义的id
				controller: 'CustomerChoiceCtrl', //modal对应的Controller
				resolve: {
					transmitData: function() { //data作为modal的controller传入的参数
						return null; //用于传递数据
					}
				}
			})
			modalInstance.result.then( //then的第一个函数对应ok(),第二个函数对应cancel()
				function(list) {
					$scope.data.customerId = list.id;
					$scope.data.customerName = list.realName;
				},
				function() {
					console.log("用户取消操作");
				}
			);
		}

		$scope.init = function() {
			CareserSvr.listAll($scope.data).success(function(res) {
				if(res.code == 200) {
					$scope.serviceList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
			
			LesionSvr.listAll().success(function(res) {
				if(res.code == 200) {
					$scope.lesionList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.getServiceId = function(id) {
			for(var i = 0; i < $scope.serviceList.length; i++) {
				if(id == $scope.serviceList[i].serviceId) {
					$scope.priceUnit = "" + $scope.serviceList[i].servicePrice + "/" + $filter('UnitFilter')($scope.serviceList[i].serviceUnit)
				}else{
					
				}				
			}
			
			if(id==''||typeof id=='undefined'){
				$scope.priceUnit = ""
			}
		}

		$scope.save = function() {
			$scope.data.serviceStartTime = $scope.handle.startDate + " " + $scope.handle.startTime;
			$scope.data.serviceEndTime = $scope.handle.endDate + " " + $scope.handle.endTime;
			showLoading();
			OrderSvr.addCommunity($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("添加成功");
					$state.go("/.orderList");
				} else {
					$scope.data.sex = "";
					alert(res.errorMsg);
				}
			});
		}

		$scope.init();

	})
	
	/*订单管理编辑*/
	.controller("OrderEditCtrl", function($scope, $state, OrderSvr, LocalStorageProvider, $timeout, ServiceSvr) {
		$scope.data = LocalStorageProvider.getObject("ser.item");
		$scope.data.serviceUnit = "" + LocalStorageProvider.getObject("ser.item").serviceUnit;
		$scope.init = function() {
			showLoading();
			ServiceSvr.listAll().success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.serviceList = res.data;
					$timeout(function() {
						$scope.data.serviceId = "" + LocalStorageProvider.getObject("ser.item").serviceId;
					}, 100)
				} else {
					alert(res.errorMsg);
				}
			});

		}

		$scope.save = function() {

			showLoading();
			CareserSvr.modify($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("添加服务成功");
					$state.go("/.careserList");
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.init();
	})
	
	/*社区订单排班*/
	.controller("OrderOutScheduleCtrl", function($scope, $state, OrderSvr, LocalStorageProvider, InstSettleSvr, $uibModal, $filter) {
		$scope.handle = LocalStorageProvider.getObject("order.item");
		$scope.data = {};
		$scope.orderStatus=0;
		$scope.selectAll = false;
		$scope.data.orderNo = $scope.handle.orderNo;
		$scope.data.workTypeId = $scope.handle.workTypeId;
		$scope.data.serviceId = $scope.handle.serviceId;
		$scope.data.instId = $scope.handle.instId;
		$scope.data.orderAmt=$scope.handle.orderAmt;
		$scope.handle.endTime = "00:00:00";
		$scope.handle.serStartDate = $filter('date')($scope.handle.serviceStartTime, 'yyyy-MM-dd HH:mm:ss');
		$scope.handle.serEndDate = $filter('date')($scope.handle.serviceEndTime, 'yyyy-MM-dd HH:mm:ss');
		$scope.handle.endTimeLimit = $filter('date')($scope.handle.serviceEndTime, 'yyyy-MM-dd');
		
		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};

		$scope.init = function() {
			InstSettleSvr.listAll($scope.data).success(function(res) {
					if(res.code == 200) {
						$scope.ratioList = res.data;
					} else {
						alert(res.errorMsg);
					}
				})
				.error(function() {
					hideLoading();
				});

		}

		$scope.getSchList = function() {
			showLoading();
			OrderSvr.schAll($scope.data).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.schList = res.data;
						if($scope.schList.length == 0) {
							$scope.handle.startDate = $filter('date')($scope.handle.serviceStartTime, 'yyyy-MM-dd');
							$scope.handle.startTime = $filter('date')($scope.handle.serviceStartTime, 'HH:mm:ss');
						} else {
							for(var i = 0; i < $scope.schList.length; i++) {
								$scope.handle.startDate = $filter('date')($scope.schList[i].serviceEndTime, 'yyyy-MM-dd');
								$scope.handle.startTime = $filter('date')($scope.schList[i].serviceEndTime, 'HH:mm:ss');
							}
						}
					} else {
						alert(res.errorMsg);
					}
				})
				.error(function() {
					hideLoading();
				});
		}

		$scope.outstaffChoice = function() {
			var modalInstance = $uibModal.open({
				size: 'lg',
				templateUrl: 'staffChoice.html', //script标签中定义的id
				controller: 'outStaffChoiceCtrl', //modal对应的Controller
				resolve: {
					transmitData: function() { //data作为modal的controller传入的参数
						return $scope.data; //用于传递数据
					}
				}
			})
			modalInstance.result.then( //then的第一个函数对应ok(),第二个函数对应cancel()
				function(list) {
					$scope.data.serviceStaffId = list.id;
					$scope.data.staffName = list.realName;
				},
				function() {
					console.log("用户取消操作");
				}
			);
		}

		$scope.save = function() {
			$scope.data.serviceStartTime = $scope.handle.serStartDate;
			$scope.data.serviceEndTime = $scope.handle.serEndDate;
			if(new Date($scope.data.serviceStartTime).getTime() < new Date($scope.handle.serStartDate).getTime()) {
				alert("排班开始日期不能小于服务开始日期");
				return false;
			}
			if(new Date($scope.data.serviceEndTime).getTime() > new Date($scope.handle.serEndDate).getTime()) {
				alert("排班结束日期不能大于服务结束日期");
				return false;
			}
			showLoading();
			OrderSvr.outSchedule($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("排班成功");
					$state.go("/.orderList");
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.init();
		$scope.getSchList();
		
	})

	/*订单排班*/
	.controller("OrderScheduleCtrl", function($scope, $state, OrderSvr, LocalStorageProvider, InstSettleSvr, $uibModal, $filter) {
		$scope.handle = LocalStorageProvider.getObject("order.item");
		$scope.data = {};
		$scope.dataForState=[];
		$scope.orderStatus=0;
		$scope.dataForState.orderNo=$scope.handle.orderNo;
		$scope.selectAll = false;
		$scope.data.orderNo = $scope.handle.orderNo;
		$scope.data.workTypeId = $scope.handle.workTypeId;
		$scope.data.serviceId = $scope.handle.serviceId;
		$scope.data.instId = $scope.handle.instId;
		$scope.data.orderAmt=$scope.handle.orderAmt;
		$scope.handle.endTime = "08:00:00";
		$scope.handle.serStartDate = $filter('date')($scope.handle.serviceStartTime, 'yyyy-MM-dd HH:mm:ss');
		$scope.handle.serEndDate = $filter('date')($scope.handle.serviceEndTime, 'yyyy-MM-dd HH:mm:ss');
		$scope.handle.endTimeLimit = $filter('date')($scope.handle.serviceEndTime, 'yyyy-MM-dd');
		
		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};

		$scope.init = function() {
			InstSettleSvr.listAll($scope.data).success(function(res) {
					if(res.code == 200) {
						$scope.ratioList = res.data;
					} else {
						alert(res.errorMsg);
					}
				})
				.error(function() {
					hideLoading();
				});

		}
		
		
		$scope.getOrderState=function(){
			$scope.dataForState.pageNo = $scope.pagerConf.currentPage;
			$scope.dataForState.pageSize = $scope.pagerConf.maxSize;
			OrderSvr.query($scope.dataForState).success(function(res) {
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.orderStatus = res.data.items[0].orderStatus;
					if($scope.orderStatus==3){
						alert('所有排班已完成');
						$state.go("/.orderList");
					}
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.getSchList = function() {
			showLoading();
			OrderSvr.schAll($scope.data).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.schList = res.data;
						if($scope.schList.length == 0) {
							$scope.handle.startDate = $filter('date')($scope.handle.serviceStartTime, 'yyyy-MM-dd');
							$scope.handle.startTime = $filter('date')($scope.handle.serviceStartTime, 'HH:mm:ss');
						} else {
							for(var i = 0; i < $scope.schList.length; i++) {
								$scope.handle.startDate = $filter('date')($scope.schList[i].serviceEndTime, 'yyyy-MM-dd');
								$scope.handle.startTime = $filter('date')($scope.schList[i].serviceEndTime, 'HH:mm:ss');
							}
						}
					} else {
						alert(res.errorMsg);
					}
				})
				.error(function() {
					hideLoading();
				});
		}

		$scope.staffChoice = function() {
			var modalInstance = $uibModal.open({
				size: 'lg',
				templateUrl: 'staffChoice.html', //script标签中定义的id
				controller: 'StaffChoiceCtrl', //modal对应的Controller
				resolve: {
					transmitData: function() { //data作为modal的controller传入的参数
						return $scope.data; //用于传递数据
					}
				}
			})
			modalInstance.result.then( //then的第一个函数对应ok(),第二个函数对应cancel()
				function(list) {
					$scope.data.serviceStaffId = list.id;
					$scope.data.staffName = list.realName;
				},
				function() {
					console.log("用户取消操作");
				}
			);
		}

		$scope.save = function() {
			$scope.data.serviceStartTime = $scope.handle.startDate + " " + $scope.handle.startTime;
			$scope.data.serviceEndTime = $scope.handle.endDate + " " + $scope.handle.endTime;
			if(new Date($scope.data.serviceStartTime).getTime() < new Date($scope.handle.serStartDate).getTime()) {
				alert("排班开始日期不能小于服务开始日期");
				return false;
			}
			if(new Date($scope.data.serviceEndTime).getTime() > new Date($scope.handle.serEndDate).getTime()) {
				alert("排班结束日期不能大于服务结束日期");
				return false;
			}
			showLoading();
			OrderSvr.schedule($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("排班成功");
					$scope.getSchList();
					$scope.getOrderState();
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.init();
		$scope.getSchList();
		
	})

	/*服务管理*/
	.controller("ServiceListCtrl", function($scope, $state, ServiceSvr, WorkTypeSvr, LocalStorageProvider) {
		$scope.data = {};

		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};

		$scope.into = function() {
			WorkTypeSvr.listAll().success(function(res) {
				if(res.code == 200) {
					$scope.workTypeList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			ServiceSvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.serviceList = res.data.items;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.add = function() {
			$state.go("/.serviceAdd")
		}

		$scope.edit = function(list) {
			LocalStorageProvider.setObject("ser.item", list);
			$state.go('/.serviceEdit');
		}

		$scope.disable = function(id) {
			if(window.confirm("确定停用数据？")) {
				showLoading();
				ServiceSvr.disable(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}

		}

		$scope.enable = function(id) {
			if(window.confirm("确定启用数据？")) {
				showLoading();
				ServiceSvr.enable(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}
		}

		$scope.into();
		$scope.$watch('pagerConf.currentPage', $scope.query);

	})

	/*服务管理新增*/
	.controller("ServiceAddCtrl", function($scope, $state, ServiceSvr, WorkTypeSvr, LocalStorageProvider) {
		$scope.data = {};

		$scope.into = function() {
			showLoading();
			WorkTypeSvr.listAll().success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.workTypeList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.save = function() {

			showLoading();
			ServiceSvr.add($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("添加服务成功");
					$state.go("/.serviceList");
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.into();
	})

	/*服务管理编辑*/
	.controller("ServiceEditCtrl", function($scope, $state, ServiceSvr, WorkTypeSvr, LocalStorageProvider, $timeout) {
		$scope.data = LocalStorageProvider.getObject("ser.item");

		$scope.into = function() {
			showLoading();
			WorkTypeSvr.listAll().success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.workTypeList = res.data;
					$timeout(function() {
						$scope.data.workTypeId = "" + LocalStorageProvider.getObject("ser.item").workTypeId;
					}, 100)
				} else {
					alert(res.errorMsg);
				}
			});

		}

		$scope.save = function() {
			showLoading();
			ServiceSvr.modify($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("修改服务信息成功");
					$state.go("/.serviceList");

				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.into();
	})

	/*结算标准*/
	.controller("InstSettleListCtrl", function($scope, $state, InstSettleSvr, LocalStorageProvider) {
		$scope.data = {};

		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};

		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			InstSettleSvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.settleList = res.data.items;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.add = function() {
			$state.go("/.instSettleAdd")
		}

		$scope.edit = function(list) {
			LocalStorageProvider.setObject("settle.item", list);
			$state.go('/.instSettleEdit');
		}

		$scope.disable = function(id) {
			if(window.confirm("确定停用数据？")) {
				showLoading();
				InstSettleSvr.disable(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}

		}

		$scope.enable = function(id) {
			if(window.confirm("确定启用数据？")) {
				showLoading();
				InstSettleSvr.enable(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}
		}

		$scope.$watch('pagerConf.currentPage', $scope.query);

	})

	/*结算标准新增*/
	.controller("InstSettleAddCtrl", function($scope, $state, InstSettleSvr, WorkTypeSvr, LocalStorageProvider) {
		$scope.data = {};

		$scope.init = function() {
			showLoading();
			WorkTypeSvr.listAll().success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.workTypeList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.save = function() {
			if($scope.data.settleRatio<0||$scope.data.settleRatio>1){
				alert("结算比例必须在0和1之间");
				return false;
			}
			showLoading();
			InstSettleSvr.save($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("添加结算标准成功");
					$state.go("/.instSettleList");
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.init();

	})

	/*结算标准编辑*/
	.controller("InstSettleEditCtrl", function($scope, $state, InstSettleSvr, WorkTypeSvr, LocalStorageProvider, $timeout) {
		$scope.data = LocalStorageProvider.getObject("settle.item");

		$scope.init = function() {
			showLoading();
			WorkTypeSvr.listAll().success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.workTypeList = res.data;
					$timeout(function() {
						$scope.data.workTypeId = "" + LocalStorageProvider.getObject("settle.item").workTypeId;
					}, 100)
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.save = function() {
			if($scope.data.settleRatio<0||$scope.data.settleRatio>1){
				alert("结算比例必须在0和1之间");
				return false;
			}
			showLoading();
			InstSettleSvr.modify($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("修改结算标准成功");
					$state.go("/.instSettleList");
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.init();

	})

	/*用户管理*/
	.controller("AclUserListCtrl", function($scope, $state) {
		$scope.data = {};

	})

	/*公司管理*/
	.controller("CompanyListCtrl", function($scope, $state, LocalStorageProvider, CompanySvr) {
		$scope.data = {};

		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};

		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			CompanySvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.companyList = res.data.items;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.add = function() {
			$state.go("/.companyAdd")
		}

		$scope.disable = function(id) {
			if(window.confirm("确定停用数据？")) {
				showLoading();
				CompanySvr.disable(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}

		}

		$scope.enable = function(id) {
			if(window.confirm("确定启用数据？")) {
				showLoading();
				CompanySvr.enable(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}
		}

		$scope.$watch('pagerConf.currentPage', $scope.query);

	})

	/*公司管理新增*/
	.controller("CompanyAddCtrl", function($scope, $state, LocalStorageProvider, CompanySvr) {
		$scope.data = {};

		$scope.save = function() {

			showLoading();
			CompanySvr.save($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("添加单位成功");
					$state.go("/.companyList");
				} else {
					alert(res.errorMsg);
				}
			});
		}

	})

	/*单位管理*/
	.controller("InstListCtrl", function($scope, $state, InstListSvr, LocalStorageProvider) {
		$scope.data = {};

		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};


		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			InstListSvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.instList = res.data.items;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.add = function() {
			$state.go("/.instAdd")
		}

		$scope.edit = function(list) {
			LocalStorageProvider.setObject("inst.item", list);
			$state.go('/.instEdit');
		}

		$scope.disable = function(id) {
			if(window.confirm("确定停用数据？")) {
				showLoading();
				InstListSvr.disable(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}

		}

		$scope.enable = function(id) {
			if(window.confirm("确定启用数据？")) {
				showLoading();
				InstListSvr.enable(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}
		}

		$scope.$watch('pagerConf.currentPage', $scope.query);

	})

	/*单位管理新增*/
	.controller("InstAddCtrl", function($scope, $state, InstListSvr, LocalStorageProvider) {
		$scope.data = {};

		$scope.into = function() {
			showLoading();
			InstListSvr.listAll().success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.sysList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.save = function() {

			showLoading();
			InstListSvr.save($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("添加单位成功");
					$state.go("/.instList");
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.into();
	})

	/*单位管理编辑*/
	.controller("InstEditCtrl", function($scope, $state, InstListSvr, LocalStorageProvider, $timeout) {
		$scope.data = LocalStorageProvider.getObject("inst.item");
		$scope.data.instType = "" + LocalStorageProvider.getObject("inst.item").instType;

		$scope.into = function() {
			showLoading();
			InstListSvr.listAll().success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.sysList = res.data;
					$timeout(function() {
						$scope.data.instSysId = "" + LocalStorageProvider.getObject("inst.item").instSysId;
					}, 100)
				} else {
					alert(res.errorMsg);
				}
			});

		}

		$scope.save = function() {
			showLoading();
			InstListSvr.modify($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("修改单位信息成功");
					$state.go("/.instList");

				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.into();
	})

	/*数据字典*/
	.controller("DictListCtrl", function($scope, $state, DictSvr, LocalStorageProvider) {
		$scope.data = {};
		$scope.dictItems = [];

		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};

		$scope.add = function() {
			$state.go("/.dictAdd");
		}
		$scope.edit = function(item) {
			LocalStorageProvider.setObject("dict.item", item);
			$state.go('/.dictEdit');
		}
		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			DictSvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.dictItems = res.data.items;

				} else {
					alert(res.errorMsg);
				}
			});
		};

		$scope.disable = function(id) {
			if(window.confirm("确定停用字典？")) {
				showLoading();
				DictSvr.disable(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}

		}

		$scope.enable = function(id) {
			if(window.confirm("确定启用字典？")) {
				showLoading();
				DictSvr.enable(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}
		}

		$scope.manage = function(item) {
			LocalStorageProvider.setObject("dict.item", item);
			$state.go("/.dictDataList");
		}

		$scope.$watch('pagerConf.currentPage', $scope.query);

	})

	/*数据字典新增*/
	.controller("DictAddCtrl", function($scope, $state, DictSvr) {
		$scope.data = {};

		$scope.save = function() {
			showLoading();
			DictSvr.save($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("添加数据字典成功");
					$state.go("/.dictList");

				} else {
					alert(res.errorMsg);
				}
			});
		}

	})

	/*数据字典编辑*/
	.controller("DictEditCtrl", function($scope, $state, DictSvr, LocalStorageProvider) {
		$scope.data = LocalStorageProvider.getObject("dict.item");

		$scope.save = function() {
			showLoading();
			DictSvr.modify($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("修改数据字典成功");
					$state.go("/.dictList");

				} else {
					alert(res.errorMsg);
				}
			});
		}

	})

	/*字典数据*/
	.controller("DictDataListCtrl", function($scope, $state, DictDataSvr, LocalStorageProvider) {
		$scope.dictItems = [];
		$scope.data = LocalStorageProvider.getObject("dict.item");
		$scope.toQuery = {};
		$scope.toQuery.dictId = $scope.data.id;
		//	$scope.toQuery.dictDataName=$scope.data.dictName;
		//	$scope.toQuery.dictDataStatus=$scope.data.dictStatus;
		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};

		$scope.add = function() {
			LocalStorageProvider.setObject("dict.item", $scope.data);
			$state.go("/.dictDataAdd");
		}
		$scope.edit = function(item) {
			LocalStorageProvider.setObject("dict.item", $scope.data);
			LocalStorageProvider.setObject("dictdata.item", item);
			$state.go('/.dictDataEdit');
		}
		$scope.query = function() {
			$scope.toQuery.pageNo = $scope.pagerConf.currentPage;
			$scope.toQuery.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			DictDataSvr.query($scope.toQuery).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.dictDataItems = res.data.items;
				} else {
					alert(res.errorMsg);
				}
			});
		};

		$scope.disable = function(id) {
			if(window.confirm("确定停用数据？")) {
				showLoading();
				DictDataSvr.disable(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}

		}

		$scope.enable = function(id) {
			if(window.confirm("确定启用数据？")) {
				showLoading();
				DictDataSvr.enable(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}
		}

		$scope.query();

	})

	/*字典数据新增*/
	.controller("DictDataAddCtrl", function($scope, $state, DictDataSvr, LocalStorageProvider) {
		$scope.cache = LocalStorageProvider.getObject("dict.item");
		$scope.data = {};
		$scope.data.dictId = $scope.cache.id;
		$scope.data.isFixed = "1";
		$scope.save = function() {
			showLoading();
			DictDataSvr.save($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("添加数据成功");
					$state.go("/.dictDataList");

				} else {
					alert(res.errorMsg);
				}
			});
		}

	})

	/*字典数据编辑*/
	.controller("DictDataEditCtrl", function($scope, $state, DictDataSvr, LocalStorageProvider) {
		$scope.editData = {};
		$scope.cache = LocalStorageProvider.getObject("dict.item");
		$scope.data = LocalStorageProvider.getObject("dictdata.item");
		$scope.editData.id = $scope.data.id;
		$scope.editData.dictDataName = $scope.data.dictDataName;
		$scope.editData.dictDataValue = $scope.data.dictDataValue;
		$scope.save = function() {
			showLoading();
			DictDataSvr.modify($scope.editData).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("修改数据字典成功");
					$state.go("/.dictDataList");

				} else {
					alert(res.errorMsg);
				}
			});
		}

	})

	/*工种信息*/
	.controller("WorkTypeListCtrl", function($scope, $state, WorkTypeSvr, LocalStorageProvider) {
		$scope.data = {};
		$scope.workTypeItems = [];

		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};

		$scope.add = function() {
			$state.go("/.workTypeAdd");
		}
		$scope.edit = function(item) {
			LocalStorageProvider.setObject("worktype.item", item);
			$state.go('/.workTypeEdit');
		}
		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			WorkTypeSvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.workTypeItems = res.data.items;

				} else {
					alert(res.errorMsg);
				}
			});
		};

		$scope.disable = function(id) {
			if(window.confirm("确定停用工种？")) {
				showLoading();
				WorkTypeSvr.disable(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}

		}

		$scope.enable = function(id) {
			if(window.confirm("确定启用工种？")) {
				showLoading();
				WorkTypeSvr.enable(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}
		}

		$scope.$watch('pagerConf.currentPage', $scope.query);

	})

	/*工种信息新增*/
	.controller("WorkTypeAddCtrl", function($scope, $state, WorkTypeSvr) {
		$scope.data = {};

		$scope.save = function() {
			showLoading();
			WorkTypeSvr.save($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("添加工种成功");
					$state.go("/.workTypeList");

				} else {
					alert(res.errorMsg);
				}
			});
		}

	})

	/*工种信息编辑*/
	.controller("WorkTypeEditCtrl", function($scope, $state, WorkTypeSvr, LocalStorageProvider) {
		$scope.data = LocalStorageProvider.getObject("worktype.item");

		$scope.save = function() {
			showLoading();
			WorkTypeSvr.modify($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("修改工种成功");
					$state.go("/.workTypeList");

				} else {
					alert(res.errorMsg);
				}
			});
		}

	})

	/*工量*/
	.controller("WorkQuanityCtrl", function($scope, $state, WorkQuanitySvr, LocalStorageProvider, CompanySvr, WorkTypeSvr,$uibModal,$filter) {
		$scope.data = {};
		$scope.totalHours = 0;
		$scope.totalSSAmt = 0;
		$scope.totalISAmt = 0;
		$scope.totalCustomer = 0;
		$scope.data.serviceEndTime=$filter('date')(new Date, 'yyyy-MM-dd');
		$scope.data.serviceStartTime=$filter('date')(new Date-(1000*60*60*24*30), 'yyyy-MM-dd');
		$scope.init = function() {
			CompanySvr.listAll().success(function(res) {
				if(res.code == 200) {
					$scope.instSysList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
			WorkTypeSvr.listAll().success(function(res) {
				if(res.code == 200) {
					$scope.workTypeList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});

		}

		$scope.query = function() {
			showLoading();
			$scope.totalHours=0;
			$scope.totalSSAmt=0;
			$scope.totalISAmt=0;
			$scope.totalCustomer=0;
			WorkQuanitySvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.staffList = res.data;
					for(var i = 0; i < $scope.staffList.length; i++) {
						var summaryHours = 0;
						var summarySSAmt = 0;
						var summaryISAmt = 0;
						var summaryCustomer =0;
						for(var j = 0; j < $scope.staffList[i].items.length; j++) {
							var serviceDuration = $scope.staffList[i].items[j].serviceDuration;
							var staffSettleAmt = $scope.staffList[i].items[j].staffSettleAmt;
							var instSettleAmt = $scope.staffList[i].items[j].instSettleAmt;
							summaryHours += serviceDuration;
							summarySSAmt += staffSettleAmt;
							summaryISAmt += instSettleAmt;
							summaryCustomer++;
							$scope.totalHours = $scope.totalHours + serviceDuration;
							$scope.totalSSAmt = $scope.totalSSAmt + staffSettleAmt;
							$scope.totalISAmt = $scope.totalISAmt + instSettleAmt;
							$scope.totalCustomer++;
						}
						$scope.staffList[i].summaryHours = summaryHours;
						$scope.staffList[i].summarySSAmt = summarySSAmt;
						$scope.staffList[i].summaryISAmt = summaryISAmt;
						$scope.staffList[i].summaryCustomer=summaryCustomer;
					}

				} else {
					alert(res.errorMsg);
				}
			});
		}
		
		$scope.reset= function(){
			$scope.data = {};
			
		}
		
		$scope.popup = function(item) {
			$scope.orderItem = item;
			var modalInstance = $uibModal.open({
				size: 'lg',
				templateUrl: 'wqPopup.html', //script标签中定义的id
				controller: 'WqPopupCtrl', //modal对应的Controller
				resolve: {
					transmitData: function() { //data作为modal的controller传入的参数
						return $scope.orderItem; //用于传递数据
					}
				}
			})
			modalInstance.result.then( //then的第一个函数对应ok(),第二个函数对应cancel()
				function() {

				},
				function() {
					$scope.query();
				}
			);
		}


		$scope.init();
		$scope.query();


	})
	
	/*结算*/
	.controller("SerSettleCtrl", function($scope, $state, SerSettleSvr, LocalStorageProvider, GlobalConst , CompanySvr, WorkTypeSvr,$filter) {
		$scope.data = {};
		$scope.totalSSAmt = 0;
		$scope.totalISAmt = 0;
		$scope.totalPersonNum=0;
		$scope.data.serviceEndTime=$filter('date')(new Date, 'yyyy-MM-dd');
		$scope.data.serviceStartTime=$filter('date')(new Date-(1000*60*60*24*30), 'yyyy-MM-dd');
		
		$scope.init = function() {
			CompanySvr.listAll().success(function(res) {
				if(res.code == 200) {
					$scope.instSysList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
			WorkTypeSvr.listAll().success(function(res) {
				if(res.code == 200) {
					$scope.workTypeList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});

		}

		$scope.query = function() {
			$scope.totalSSAmt = 0;
			$scope.totalISAmt = 0;
			$scope.totalPersonNum=0;
			showLoading();
			SerSettleSvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.settleList = res.data;
					for(var i=0;i<$scope.settleList.length;i++){
						$scope.totalSSAmt=$scope.totalSSAmt+$scope.settleList[i].sumStaffSettleAmt;
						$scope.totalISAmt=$scope.totalISAmt+$scope.settleList[i].settleAdjustAmt;
						$scope.totalPersonNum=$scope.totalPersonNum+$scope.settleList[i].serviceCustomerNum;
					}

				} else {
					alert(res.errorMsg);
				}
			});
		}
		
		$scope.reset= function(){
			$scope.data = {};
			
		}
		
		$scope.exportReport= function(){
			$scope.data.token=LocalStorageProvider.get(GlobalConst.AUTH_TOKEN_CACHE_NAME, "");
			$scope.urlStr="instsettle/export_settlecount_report";
			post($scope.urlStr,$scope.data);		
		}
		

		$scope.init();
		$scope.query();


	})
	
	/*机构收入统计*/
	.controller("instIncomeCtrl", function($scope, $state, InstIncomeSvr, LocalStorageProvider, GlobalConst , CompanySvr, WorkTypeSvr,ServiceSvr,$filter) {
		$scope.data = {};
		$scope.totalOAAmt = 0;
		$scope.totalAAAmt = 0;
		$scope.totalOPAmt = 0;
		$scope.totalSPAmt = 0;
		$scope.totalCPAmt = 0;
		$scope.totalCTAAmt = 0;
		$scope.totalSAAmt=0;
		$scope.totalIAAmt=0;
		$scope.totalPDAmt=0;
		$scope.data.serviceEndTime=$filter('date')(new Date, 'yyyy-MM-dd');
		$scope.data.serviceStartTime=$filter('date')(new Date-(1000*60*60*24*30), 'yyyy-MM-dd');
		
		$scope.init = function() {
			ServiceSvr.listAll().success(function(res) {
				if(res.code == 200) {
					$scope.serviceList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
			CompanySvr.listAll().success(function(res) {
				if(res.code == 200) {
					$scope.instSysList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
			WorkTypeSvr.listAll().success(function(res) {
				if(res.code == 200) {
					$scope.workTypeList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});

		}

		$scope.query = function() {
			$scope.totalOAAmt = 0;
			$scope.totalAAAmt = 0;
			$scope.totalOPAmt = 0;
			$scope.totalSPAmt = 0;
			$scope.totalCPAmt = 0;
			$scope.totalCTAAmt = 0;
			$scope.totalSAAmt=0;
			$scope.totalIAAmt = 0;
			$scope.totalPDAmt=0;
			$scope.totalSCAmt=0;
			showLoading();
			InstIncomeSvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.instIncomeList = res.data;
					for(var i=0;i<$scope.instIncomeList.length;i++){
						$scope.totalOAAmt=$scope.totalOAAmt+$scope.instIncomeList[i].orderAmt;
						$scope.totalAAAmt=$scope.totalAAAmt+$scope.instIncomeList[i].adjustAmt;
						$scope.totalOPAmt=$scope.totalOPAmt+$scope.instIncomeList[i].onlinePayAmt;
						$scope.totalSPAmt=$scope.totalSPAmt+$scope.instIncomeList[i].scanPayAmt;
						$scope.totalCPAmt=$scope.totalCPAmt+$scope.instIncomeList[i].cashPayAmt;
						$scope.totalCTAAmt=$scope.totalCTAAmt+$scope.instIncomeList[i].companyTurnAccountAmt;
						$scope.totalSAAmt=$scope.totalSAAmt+$scope.instIncomeList[i].staffSettleAmt;
						$scope.totalIAAmt=$scope.totalIAAmt+$scope.instIncomeList[i].instSettleAmt;
						$scope.totalPDAmt=$scope.totalPDAmt+$scope.instIncomeList[i].pounDage;
						$scope.totalSCAmt=$scope.totalSCAmt+$scope.instIncomeList[i].serviceCharge;
					}

				} else {
					alert(res.errorMsg);
				}
			});
		}
		
		$scope.reset= function(){
			$scope.data = {};
			
		}
		
		$scope.exportReport= function(){
			$scope.data.token=LocalStorageProvider.get(GlobalConst.AUTH_TOKEN_CACHE_NAME, "");
			$scope.urlStr="customerorder/export_inst_income_count";
			post($scope.urlStr,$scope.data);		
		}
		

		$scope.init();
		$scope.query();


	})
	
	/*关账*/
	.controller("BillListCtrl", function($scope, $state, BillListSvr, LocalStorageProvider,$uibModal,$filter) {
		$scope.data = {};
		$scope.data.settleEndDate=$filter('date')(new Date, 'yyyy-MM-dd');
		$scope.data.settleStartDate=$filter('date')(new Date-(1000*60*60*24*365), 'yyyy-MM-dd');
	

		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};

		$scope.add = function() {
			var modalInstance = $uibModal.open({
				size:'lg',
				templateUrl: 'billAdd.html', //script标签中定义的id
				controller: 'BillAddCtrl', //modal对应的Controller
				resolve: {
					transmitData: function() { //data作为modal的controller传入的参数
						return null; //用于传递数据
					}
				}
			})
			modalInstance.result.then( //then的第一个函数对应ok(),第二个函数对应cancel()
				function() {
					$scope.query();
				},
				function() {
					console.log("用户取消操作");
				}
			);
		}
		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			BillListSvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.billList = res.data.items;

				} else {
					alert(res.errorMsg);
				}
			});
		};

		$scope.close = function(id) {
			if(window.confirm("确定关闭？")) {
				showLoading();
				BillListSvr.close(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}

		}

		$scope.open = function(id) {
			if(window.confirm("确定开启？")) {
				showLoading();
				BillListSvr.open(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}
		}

		$scope.$watch('pagerConf.currentPage', $scope.query);

	})
	

	.controller("AclUserCtrl", function($scope, $state, SessionStorageProvider, AclUserSvr) {
		$scope.data = {};
		$scope.data.status = '';
		$scope.items = {};
		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};

		$scope.add = function() {
			SessionStorageProvider.set("editMode", "0");
			$state.go("/.aclUserEdit");
		}

		$scope.edit = function(aclUserInfo) {
			SessionStorageProvider.set("editMode", "1");
			SessionStorageProvider.setObject("aclUserInfo", aclUserInfo);
			$state.go("/.aclUserEdit");
		}

		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			AclUserSvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.items = res.data.items;
				}
			});
		}

		$scope.reset = function() {
			$scope.data = {};
		}

		$scope.refresh = function() {
			$scope.query();
		}

		$scope.lock = function(id) {
			if(window.confirm("确定冻结系统用户吗？")) {
				AclUserSvr.lock(id).success(function(res) {
					if(res.code == 200) {
						$scope.refresh();
					} else {
						alert(res.errorMsg);
					}
				});
			}
		}

		$scope.unlock = function(id) {
			if(window.confirm("确定激活系统用户吗？")) {
				AclUserSvr.unlock(id).success(function(res) {
					if(res.code == 200) {
						$scope.refresh();
					} else {
						alert(res.errorMsg);
					}
				});
			}
		}

		$scope.del = function(id) {
			if(window.confirm("确定删除系统用户吗？")) {
				AclUserSvr.del(id).success(function(res) {
					if(res.code == 200) {
						$scope.refresh();
					} else {
						alert(res.errorMsg);
					}
				});
			}
		}

		$scope.$watch('pagerConf.currentPage + pagerConf.maxSize', $scope.query);
	})
	
	//收入统计
	.controller("incomeStatCtrl", function($scope, $state, LocalStorageProvider, GlobalConst , CompanySvr, WorkTypeSvr,IncomeStatSvr,LesionSvr,InstListSvr,$uibModal,$filter) {
		$scope.data = {};
		$scope.totalday = 0;
		$scope.totalzje = 0;
		$scope.totaljsk=0;
		$scope.totalglf=0;
		$scope.totaljstz = 0;
		$scope.totalddtz = 0;
		$scope.totalsxf = 0;
		$scope.data.sortStatus=1;
		$scope.data.serviceEndTime=$filter('date')(new Date, 'yyyy-MM-dd');
		$scope.data.serviceStartTime=$filter('date')(new Date-(1000*60*60*24*30), 'yyyy-MM-dd');
		
		$scope.reset = function() {
			$scope.data = {};
		}
		$scope.sort = function(sortName) {

			$scope.data.sortName=sortName;

			if($scope.data.sortType==1){
				$scope.data.sortType=0;
			}else{
				$scope.data.sortType=1;
			}
			$scope.query();
		}
		
		$scope.schedulePopup = function(item) {
			$scope.orderItem = item;
			var modalInstance = $uibModal.open({
				size: 'lg',
				templateUrl: 'incomePopup.html', //script标签中定义的id
				controller: 'SchedulePopupCtrl', //modal对应的Controller
				resolve: {
					transmitData: function() { //data作为modal的controller传入的参数
						return $scope.orderItem; //用于传递数据
					}
				}
			})
			modalInstance.result.then( //then的第一个函数对应ok(),第二个函数对应cancel()
				function() {

				},
				function() {
					$scope.query();
				}
			);
		}
		
		
		$scope.init = function() {
			CompanySvr.listAll().success(function(res) {
				if(res.code == 200) {
					$scope.instSysList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
			WorkTypeSvr.listAll().success(function(res) {
				if(res.code == 200) {
					$scope.workTypeList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
			LesionSvr.listAll().success(function(res) {
				if(res.code == 200) {
					$scope.lesionList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
			InstListSvr.all().success(function(res) {
				if(res.code == 200) {
					$scope.instList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
			
		}
		
		$scope.query= function(){
			showLoading();
			IncomeStatSvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.totalday = 0;
					$scope.totalzje = 0;
					$scope.totaljsk = 0;
					$scope.totalglf = 0;
					$scope.totaljstz = 0;
					$scope.totalddtz = 0;
					$scope.totalsxf = 0;
					$scope.totalHolidayDay=0;
					$scope.incomeList = res.data;
					for(var i=0; i<$scope.incomeList.length;i++){
						$scope.incomeList[i].serviceDuration=$scope.incomeList[i].serviceDuration/24;						
						$scope.totalday=$scope.totalday+$scope.incomeList[i].serviceDuration;
						$scope.totaljsk =$scope.totaljsk+$scope.incomeList[i].staffSettleAmt;
						$scope.totalglf =$scope.totalglf+$scope.incomeList[i].instSettleAmt+$scope.incomeList[i].orderAdjustAmt;
						$scope.totaljstz =$scope.totaljstz+$scope.incomeList[i].settleAdjustAmt;
						$scope.totalzje =$scope.totalzje+$scope.incomeList[i].orderAmt+$scope.incomeList[i].orderAdjustAmt;
						$scope.totalddtz =$scope.totalddtz+$scope.incomeList[i].orderAdjustAmt;
						$scope.totalsxf =$scope.totalsxf+$scope.incomeList[i].pounDage;
						$scope.incomeList[i].orderNum=i+1;
						$scope.totalHolidayDay =$scope.totalHolidayDay+$scope.incomeList[i].holiday
					}
					
				} else {
					alert(res.errorMsg);
				}
			});
		}
	

		$scope.init();
		$scope.query();
		
		$scope.exportReport= function(){
			$scope.data.token=LocalStorageProvider.get(GlobalConst.AUTH_TOKEN_CACHE_NAME, "");
			$scope.urlStr="customerorder/export_income_count";
			post($scope.urlStr,$scope.data);		
		}


	})

	.controller("AclUserEditCtrl", function($scope, $state, SessionStorageProvider, AclUserSvr, AclRoleSvr,$uibModal,$rootScope) {
		$scope.data = {};
		$scope.roles = {};
		$scope.editMode = '0';
		$scope.title = "新增";
		$scope.userInfo=$rootScope.userInfo;
		console.log($scope.userInfo);
		$scope.choiceServiceInstId = function() {
			var modalInstance = $uibModal.open({
				size: 'lg',
				templateUrl: 'instChoice.html', //script标签中定义的id
				controller: 'InstChoiceCtrl', //modal对应的Controller
				resolve: {
					serviceInstId: function() { //data作为modal的controller传入的参数
						return null; //用于传递数据
					}
				}
			})
			modalInstance.result.then( //then的第一个函数对应ok(),第二个函数对应cancel()
				function(list) {
					$scope.data.instId = list.id;
					$scope.data.serInstName = list.instName;
				},
				function() {
					console.log("用户取消操作");
				}
			);
		}
		
		$scope.save = function() {
			showLoading();
			if($scope.editMode == '0') {
				AclUserSvr.add($scope.data).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						alert("创建系统用户成功！");
						$state.go("/.aclUserList");
					} else {
						alert(res.errorMsg);
					}
				});
			} else {
				AclUserSvr.modify($scope.data).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						alert("修改系统用户成功！");
						$state.go("/.aclUserList");
					} else {
						alert(res.errorMsg);
					}
				});
			}
		}

		$scope.initRole = function() {
			AclRoleSvr.queryAllAvailable().success(function(res) {
				$scope.roles = res.data;
			});
		}

		$scope.init = function() {
			$scope.initRole();
			$scope.editMode = SessionStorageProvider.get("editMode");
			if($scope.editMode == '1') {
				$scope.title = "编辑";
				$scope.data = SessionStorageProvider.getObject("aclUserInfo");
			}
		};

		$scope.init();
	})

	.controller("AclRoleCtrl", function($scope, $state, SessionStorageProvider, AclRoleSvr) {
		$scope.data = {};
		$scope.data.status = '';
		$scope.items = {};
		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};

		$scope.add = function() {
			SessionStorageProvider.set("editMode", "0");
			$state.go("/.aclRoleEdit");
		}

		$scope.edit = function(aclRoleInfo) {
			SessionStorageProvider.set("editMode", "1");
			SessionStorageProvider.setObject("aclRoleInfo", aclRoleInfo);
			$state.go("/.aclRoleEdit");
		}

		$scope.editAuth = function(aclRoleInfo) {
			SessionStorageProvider.setObject("aclRoleInfo", aclRoleInfo);
			$state.go("/.aclRoleAuthEdit");
		}

		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			AclRoleSvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.items = res.data.items;
				}
			});
		}

		$scope.reset = function() {
			$scope.data = {};
		}

		$scope.refresh = function() {
			$scope.query();
		}

		$scope.enable = function(id) {
			if(window.confirm("确定启用系统角色吗？")) {
				AclRoleSvr.enable(id).success(function(res) {
					if(res.code == 200) {
						$scope.refresh();
					} else {
						alert(res.errorMsg);
					}
				});
			}
		}

		$scope.disable = function(id) {
			if(window.confirm("确定停用系统角色吗？")) {
				AclRoleSvr.disable(id).success(function(res) {
					if(res.code == 200) {
						$scope.refresh();
					} else {
						alert(res.errorMsg);
					}
				});
			}
		}

		$scope.$watch('pagerConf.currentPage + pagerConf.maxSize', $scope.query);
	})

	.controller("AclRoleEditCtrl", function($scope, $state, SessionStorageProvider, AclRoleSvr) {
		$scope.data = {};
		$scope.editMode = '0';
		$scope.title = "新增";

		$scope.save = function() {
			showLoading();
			if($scope.editMode == '0') {
				AclRoleSvr.add($scope.data).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						alert("创建系统角色成功！");
						$state.go("/.aclRoleList");
					} else {
						alert(res.errorMsg);
					}
				});
			} else {
				AclRoleSvr.modify($scope.data).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						alert("修改系统角色成功！");
						$state.go("/.aclRoleList");
					} else {
						alert(res.errorMsg);
					}
				});
			}
		}

		$scope.init = function() {
			$scope.editMode = SessionStorageProvider.get("editMode");
			if($scope.editMode == '1') {
				$scope.title = "编辑";
				$scope.data = SessionStorageProvider.getObject("aclRoleInfo");
			}
		};

		$scope.init();
	})

	.controller("AclRoleAuthEditCtrl", function($scope, $state, SessionStorageProvider, AclRoleSvr) {
		$scope.data = {};
		$scope.roleInfo = {};
		$scope.roleAuth = [];
		$scope.savedRoleAuth = [];

		$scope.checkRootMenu = function(rootMenu) {
			angular.forEach(rootMenu.subMenuList, function(subMenu, subIndex, subArray) {
				if(rootMenu.checked) {
					subMenu.checked = true;
				} else {
					subMenu.checked = false;
				}
				angular.forEach(subMenu.operList, function(oper, operIndex, operArray) {
					if(subMenu.checked) {
						oper.checked = true;
					} else {
						oper.checked = false;
					}
				});
			});
		}

		$scope.checkSubMenu = function(subMenu) {
			angular.forEach(subMenu.operList, function(oper, operIndex, operArray) {
				if(subMenu.checked) {
					oper.checked = true;
				} else {
					oper.checked = false;
				}
			});
			$scope.checkOper();
		}

		$scope.checkOper = function() {
			angular.forEach($scope.roleAuth, function(rootMenu, rootIndex, rootArray) {
				var rootChecked = true;
				angular.forEach(rootMenu.subMenuList, function(subMenu, subIndex, subArray) {
					var subChecked = true;
					angular.forEach(subMenu.operList, function(oper, operIndex, operArray) {
						if(!oper.checked) {
							subChecked = false;
						}
					});
					subMenu.checked = subChecked;
					if(!subMenu.checked) {
						rootChecked = false;
					}
				});
				rootMenu.checked = rootChecked;
			});
		}

		$scope.checkSavedOper = function() {
			angular.forEach($scope.roleAuth, function(rootMenu, rootIndex, rootArray) {
				angular.forEach(rootMenu.subMenuList, function(subMenu, subIndex, subArray) {
					angular.forEach(subMenu.operList, function(oper, operIndex, operArray) {
						angular.forEach($scope.savedRoleAuth, function(savedOper, savedOperIndex, savedOperArray) {
							if(oper.menuId == savedOper.menuId && oper.id == savedOper.operId) {
								oper.checked = true;
							}
						});
					});
				});
			});
			$scope.checkOper();
		}

		$scope.getCheckedOpers = function() {
			var authArr = [];
			angular.forEach($scope.roleAuth, function(rootMenu, rootIndex, rootArray) {
				angular.forEach(rootMenu.subMenuList, function(subMenu, subIndex, subArray) {
					angular.forEach(subMenu.operList, function(oper, operIndex, operArray) {
						if(oper.checked) {
							authArr.push(oper.menuId + ":" + oper.id);
						}
					});
				});
			});
			return authArr.join(";");
		}

		$scope.save = function() {
			if(window.confirm("确定保存设置？")) {
				$scope.data.authBody = $scope.getCheckedOpers();
				$scope.data.roleId = $scope.roleInfo.id;
				AclRoleSvr.modifyAuth($scope.data).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						alert("修改角色权限成功！");
						$state.go("/.aclRoleList");
					} else {
						alert(res.errorMsg);
					}
				});
			}
		}

		$scope.initRoleAuth = function() {
			showLoading();
			AclRoleSvr.queryAllRoleAuth({}).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.roleAuth = res.data;
					$scope.initSavedRoleAuth();
				}
			});
		};

		$scope.initSavedRoleAuth = function() {
			var id = $scope.roleInfo.id;
			AclRoleSvr.queryRoleAuth(id).success(function(res) {
				if(res.code == 200) {
					$scope.savedRoleAuth = res.data;
					$scope.checkSavedOper();
				}
			});
		};

		$scope.init = function() {
			$scope.roleInfo = SessionStorageProvider.getObject("aclRoleInfo");
			$scope.initRoleAuth();
		};

		$scope.init();
	})
	
	/*服务比例*/
	.controller("ServiceratioListCtrl", function($scope, $state, ServiceRatioListSvr, LocalStorageProvider) {
		$scope.data = {};

		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};


		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			ServiceRatioListSvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.serviceRatioList = res.data.items;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.add = function() {
			$state.go("/.serviceRatioAdd")
		}

		$scope.edit = function(list) {
			LocalStorageProvider.setObject("serviceratio.item", list);
			$state.go('/.serviceRatioEdit');
		}

		$scope.disable = function(id) {
			if(window.confirm("确定停用数据？")) {
				showLoading();
				ServiceRatioListSvr.disable(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}

		}

		$scope.enable = function(id) {
			if(window.confirm("确定启用数据？")) {
				showLoading();
				ServiceRatioListSvr.enable(id).success(function(res) {
					hideLoading();
					if(res.code == 200) {
						$scope.query();
					} else {
						alert(res.errorMsg);
					}
				});
			}
		}

		$scope.$watch('pagerConf.currentPage', $scope.query);

	})
	
	
	/*服务比例新增*/
	.controller("ServiceRatioAddCtrl", function($scope, $state, ServiceRatioListSvr, LocalStorageProvider) {
		$scope.data = {};

		$scope.save = function() {

			showLoading();
			ServiceRatioListSvr.save($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("添加服务比例成功");
					$state.go("/.serviceRatioList");
				} else {
					alert(res.errorMsg);
				}
			});
		}
	})
	
	/*服务比例编辑*/
	.controller("ServiceRatioEditCtrl", function($scope, $state, ServiceRatioListSvr, LocalStorageProvider, $timeout) {
		$scope.data = LocalStorageProvider.getObject("serviceratio.item");
		$scope.data.serviceAddress = "" + LocalStorageProvider.getObject("serviceratio.item").serviceAddress;


		$scope.save = function() {
			showLoading();
			ServiceRatioListSvr.modify($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					alert("修改服务比例成功");
					$state.go("/.serviceRatioList");

				} else {
					alert(res.errorMsg);
				}
			});
		}
	})
	
	/*人员排班*/
	.controller("StaffScheduleListCtrl", function($scope, $state, StaffScheduleSvr, LocalStorageProvider, GlobalConst, WorkTypeSvr) {
		$scope.data = {};

		$scope.pagerConf = {
			maxSize: 10,
			totalItems: 0,
			currentPage: 1
		};
		
		$scope.init = function() {
			showLoading();
			WorkTypeSvr.listAll().success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.workTypeList = res.data;
				} else {
					alert(res.errorMsg);
				}
			});
		}

		$scope.query = function() {
			$scope.data.pageNo = $scope.pagerConf.currentPage;
			$scope.data.pageSize = $scope.pagerConf.maxSize;
			showLoading();
			StaffScheduleSvr.query($scope.data).success(function(res) {
				hideLoading();
				if(res.code == 200) {
					$scope.pagerConf.totalItems = res.data.totalNum;
					$scope.staffList = res.data.items;
				} else {
					alert(res.errorMsg);
				}
			});
		}
		
		
		$scope.init();
		$scope.$watch('pagerConf.currentPage', $scope.query);

	});
