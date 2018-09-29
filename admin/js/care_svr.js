angular.module('app.services', [])

.factory('AclUserSvr', ['$http', function($http) {
		var aclUserSvr = {};

		aclUserSvr.login = function(data) {
			return $http.post('auth/login', data);
		};

		aclUserSvr.getUserInfo = function() {
			return $http.get('acluser/detail')
		};

		aclUserSvr.add = function(data) {
			return $http.post('acluser/add', data);
		};

		aclUserSvr.query = function(data) {
			return $http.post('acluser/list', data);
		};

		aclUserSvr.modify = function(data) {
			return $http.post('acluser/modify', data);
		};

		aclUserSvr.lock = function(id) {
			return $http.get('acluser/lock/' + id);
		};

		aclUserSvr.unlock = function(id) {
			return $http.get('acluser/unlock/' + id);
		};

		aclUserSvr.del = function(id) {
			return $http.get('acluser/delete/' + id);
		};
		
		aclUserSvr.modifyPwd = function(data) {
			return $http.post('acluser/modify_pwd',data);
		};
		

		return aclUserSvr;
	}])

	.factory('AclRoleSvr', ['$http', function($http) {
		var aclRoleSvr = {};

		aclRoleSvr.add = function(data) {
			return $http.post('aclrole/add', data);
		};

		aclRoleSvr.queryAllAvailable = function() {
			return $http.get('aclrole/list_all');
		};

		aclRoleSvr.query = function(data) {
			return $http.post('aclrole/list', data);
		};

		aclRoleSvr.queryAllRoleAuth = function() {
			return $http.get('aclrole/list_all_auth');
		};

		aclRoleSvr.queryRoleAuth = function(id) {
			return $http.get('aclrole/list_auth/' + id);
		};

		aclRoleSvr.modify = function(data) {
			return $http.post('aclrole/modify', data);
		};

		aclRoleSvr.modifyAuth = function(data) {
			return $http.post('aclrole/modify_auth', data);
		};

		aclRoleSvr.enable = function(id) {
			return $http.get('aclrole/enable/' + id);
		};

		aclRoleSvr.disable = function(id) {
			return $http.get('aclrole/disable/' + id);
		};

		return aclRoleSvr;
	}])

.factory('DictSvr', ['$http', function($http) {
	var dictSvr = {};

	dictSvr.query = function(data) {
		return $http.post('dict/list', data);
	};
	
	dictSvr.save = function(data) {
		return $http.post('dict/add', data);
	};
	
	dictSvr.modify = function(data) {
		return $http.post('dict/modify', data);
	};
	
	dictSvr.disable = function(id) {
		return $http.get('dict/disable/'+id);
	};
	
	dictSvr.enable = function(id) {
		return $http.get('dict/enable/'+id);
	};
	


	return dictSvr;
}])

.factory('DictDataSvr', ['$http', function($http) {
	var dictDataSvr = {};

	dictDataSvr.query = function(data) {
		return $http.post('dictdata/list',data);
	};
	
	dictDataSvr.save = function(data) {
		if (data.isFixed=="0"){
			data.isFixed=false;
		}else{
			data.isFixed=true;
		}
		return $http.post('dictdata/add', data);
	};
	
	dictDataSvr.modify = function(data) {
		return $http.post('dictdata/modify', data);
	};
	
	dictDataSvr.disable = function(id) {
		return $http.get('dictdata/disable/'+id);
	};
	
	dictDataSvr.enable = function(id) {
		return $http.get('dictdata/enable/'+id);
	};
	


	return dictDataSvr;
}])


.factory('WorkTypeSvr', ['$http', function($http) {
	var workTypeSvr = {};

	workTypeSvr.query = function(data) {
		return $http.post('worktype/list', data);
	};
	
	workTypeSvr.save = function(data) {
		return $http.post('worktype/add', data);
	};
	
	workTypeSvr.modify = function(data) {
		return $http.post('worktype/modify', data);
	};
	
	workTypeSvr.disable = function(id) {
		return $http.get('worktype/disable/'+id);
	};
	
	workTypeSvr.enable = function(id) {
		return $http.get('worktype/enable/'+id);
	};
	//查询所有工种信息
	workTypeSvr.listAll = function() {
		return $http.get('worktype/list_all');
	};
	


	return workTypeSvr;
}])

.factory('BillListSvr', ['$http', function($http) {
	var billListSvr = {};

	billListSvr.query = function(data) {
		return $http.post('instsettle/list', data);
	};
	
	billListSvr.add = function(data) {
		return $http.post('instsettle/add', data);
	};
	
	
	billListSvr.close = function(id) {
		return $http.get('instsettle/closesettle/'+id);
	};
	
	billListSvr.open = function(id) {
		return $http.get('instsettle/opensettle/'+id);
	};

	


	return billListSvr;
}])



.factory('InstListSvr', ['$http', function($http) {
	var instListSvr = {};
	//查询所有所属公司
	instListSvr.listAll = function() {
		return $http.get('careinstsys/list_all');
	};
	
	instListSvr.servicelist = function(data) {
		return $http.post('careinst/list_service',data);
	};
	
	instListSvr.query = function(data) {
		return $http.post('careinst/list',data);
	};
	
	instListSvr.save = function(data) {
		return $http.post('careinst/add', data);
	};
	
	instListSvr.modify = function(data) {
		return $http.post('careinst/modify', data);
	};
	
	instListSvr.disable = function(id) {
		return $http.get('careinst/disable/'+id);
	};
	
	instListSvr.enable = function(id) {
		return $http.get('careinst/enable/'+id);
	};

	return instListSvr;
}])

.factory('CompanySvr', ['$http', function($http) {
	var companySvr = {};
	//查询所有医院下公司
	companySvr.listAll = function() {
		return $http.get('careinstsys/list_all');
	};
	
	
	companySvr.query = function(data) {
		return $http.post('careinstsys/list',data);
	};
	
	companySvr.save = function(data) {
		return $http.post('careinstsys/add', data);
	};
	
	
	companySvr.disable = function(id) {
		return $http.get('careinstsys/disable/'+id);
	};
	
	companySvr.enable = function(id) {
		return $http.get('careinstsys/enable/'+id);
	};

	return companySvr;
}])

.factory('ServiceSvr', ['$http', function($http) {
	var serviceSvr = {};
	
	serviceSvr.query = function(data) {
		return $http.post('careservice/list',data);
	};
	
	serviceSvr.add = function(data) {
		return $http.post('careservice/add', data);
	};
	
	serviceSvr.modify = function(data) {
		return $http.post('careservice/modify', data);
	};
	
	serviceSvr.disable = function(id) {
		return $http.get('careservice/disable/'+id);
	};
	
	serviceSvr.enable = function(id) {
		return $http.get('careservice/enable/'+id);
	};
	
	//查询所有启用的服务信息
	serviceSvr.listAll = function(data) {
		return $http.post('careservice/list_all',data);
	};

	return serviceSvr;
}])


.factory('OrderSvr', ['$http', function($http) {
	var orderSvr = {};
	
	orderSvr.query = function(data) {
		return $http.post('customerorder/list',data);
	};
	
	orderSvr.add = function(data) {
		return $http.post('customerorder/add', data);
	};
	
	orderSvr.addCommunity = function(data) {
		return $http.post('customerorder/add_community', data);
	};
	
	orderSvr.schedule = function(data) {
		return $http.post('customerorderschedule/add', data);
	};
	
	orderSvr.outSchedule = function(data) {
		return $http.post('customerorderschedule/add_outSend', data);
	};
	
	//通过订单号查询排班信息
	orderSvr.schAll = function(data) {
		return $http.get('customerorderschedule/all_schedule/'+data.orderNo);
	};
	
	orderSvr.cancel = function(data) {
		return $http.get('customerorder/cancel/'+data.orderNo);
	};
	//确认排班
	orderSvr.confirm = function(ids) {
		return $http.post('customerorderschedule/batchconfirmcompleted',{ids:ids});
	};
	//确认支付
	orderSvr.confirmpay = function(data) {
		return $http.get('customerorder/throughPay/'+data.orderNo+"/"+data.payType);
	};
	//订单完成
	orderSvr.complete = function(data) {
		return $http.post('customerorder/confirmcompleted',data);
	};
	//批量删除排班
	orderSvr.delete = function(id) {
		return $http.get('customerorderschedule/batchdelete/'+id);
	};
	//调整金额
	orderSvr.adjust = function(data) {
		return $http.post('customerorder/adjust',data);
	};
	

	return orderSvr;
}])


.factory('InstSettleSvr', ['$http', function($http) {
	var instSettleSvr = {};
	
	instSettleSvr.query = function(data) {
		return $http.post('instworktypesettle/list',data);
	};
	
	instSettleSvr.save = function(data) {
		return $http.post('instworktypesettle/add', data);
	};
	
	instSettleSvr.modify = function(data) {
		return $http.post('instworktypesettle/modify', data);
	};
	
	instSettleSvr.disable = function(id) {
		return $http.get('instworktypesettle/disable/'+id);
	};
	
	instSettleSvr.enable = function(id) {
		return $http.get('instworktypesettle/enable/'+id);
	};
	
	//查询所有启用的结算信息
	instSettleSvr.listAll = function(data) {
		return $http.post('instworktypesettle/list_all/'+data.workTypeId);
	};

	return instSettleSvr;
}])


.factory('HolidaySvr', ['$http', function($http) {
	var holidaySvr = {};
	
	holidaySvr.query = function(data) {
		return $http.post('holiday/list',data);
	};
	
	holidaySvr.add = function(data) {
		return $http.post('holiday/add', data);
	};
	
	holidaySvr.modify = function(data) {
		return $http.post('holiday/modify', data);
	};
	
	holidaySvr.delete = function(id) {
		return $http.get('holiday/delete/'+id);
	};
	
	

	return holidaySvr;
}])


.factory('LesionSvr', ['$http', function($http) {
	var lesionSvr = {};
	
	lesionSvr.query = function(data) {
		return $http.post('inpatientarea/list',data);
	};
	
	lesionSvr.add = function(data) {
		return $http.post('inpatientarea/add', data);
	};
	
	lesionSvr.modify = function(data) {
		return $http.post('inpatientarea/modify', data);
	};
	
	lesionSvr.delete = function(id) {
		return $http.get('inpatientarea/delete/'+id);
	};
	
	
	//查询所有启用的病区
	lesionSvr.listAll = function() {
		return $http.get('inpatientarea/all');
	};
	

	return lesionSvr;
}])


.factory('CustomerSvr', ['$http', function($http) {
	var customerSvr = {};
	
	customerSvr.query = function(data) {
		return $http.post('instcustomer/list',data);
	};
	
	customerSvr.add = function(data) {
		return $http.post('instcustomer/add', data);
	};
	
	customerSvr.modify = function(data) {
		return $http.post('instcustomer/modify', data);
	};
	
	customerSvr.delete = function(id) {
		return $http.get('instcustomer/delete/'+id);
	};
	
	

	return customerSvr;
}])


.factory('StaffSvr', ['$http', function($http) {
	var staffSvr = {};
	
	staffSvr.query = function(data) {
		return $http.post('inststaff/list',data);
	};
	
	staffSvr.add = function(data) {
		return $http.post('inststaff/add', data);
	};
	
	staffSvr.modify = function(data) {
		return $http.post('inststaff/modify', data);
	};
	
	staffSvr.delete = function(id) {
		return $http.get('inststaff/delete/'+id);
	};
	
	staffSvr.queryByserId = function(data) {
		return $http.post('inststaff/list_by_serviceid',data);
	};

	return staffSvr;
}])

.factory('WorkQuanitySvr', ['$http', function($http) {
	var workQuanitySvr = {};
	
	workQuanitySvr.query = function(data) {
		return $http.post('customerorderschedule/workquantity_report',data);
	};
	
	workQuanitySvr.adjust = function(data) {
		return $http.post('customerorderschedule/modify_settle_amt',data);
	};

	return workQuanitySvr;
}])

.factory('SerSettleSvr', ['$http', function($http) {
	var serSettleSvr = {};
	
	serSettleSvr.query = function(data) {
		return $http.post('instsettle/settlecount_report',data);
	};
	

	return serSettleSvr;
}])

.factory('IncomeStatSvr', ['$http', function($http) {
	var incomeStatSvr = {};
	
	incomeStatSvr.query = function(data) {
		return $http.post('customerorder/income_count',data);
	};
	

	return incomeStatSvr;
}])

.factory('InstIncomeSvr', ['$http', function($http) {
	var instIncomeSvr = {};
	
	instIncomeSvr.query = function(data) {
		return $http.post('customerorder/inst_income_count',data);
	};
	
	return instIncomeSvr;
}])


.factory('CareserSvr', ['$http', function($http) {
	var careserSvr = {};
	
	careserSvr.query = function(data) {
		return $http.post('careservice/list_inst',data);
	};
	
	careserSvr.add = function(data) {
		return $http.post('careservice/add_inst', data);
	};
	
	careserSvr.modify = function(data) {
		return $http.post('careservice/modify_inst', data);
	};
	
	careserSvr.delete = function(id) {
		return $http.get('careservice/delete/'+id);
	};
	
	careserSvr.listAll = function(data) {
		return $http.post('careservice/list_all_inst',data);
	};

	return careserSvr;
}])


.factory('DriverSvr', ['$http', function($http) {
	var driverSvr = {};
	
	driverSvr.uploadInfoFile = function (file) {
        var formData = new FormData();
        formData.append("infoFile", file);
        var args = {
            method: 'POST',
            url: "driver/info_upload",
            data: formData,
            headers: {
            	'Content-Type': undefined
            },
            transformRequest: angular.identity
        };
        return $http(args);
    }

	driverSvr.queryInfoList = function(data) {
		return $http.post('driver/info_list', data);
	};
	
	driverSvr.modifyInfo = function(data) {
		return $http.post('driver/info_modify', data);
	};

	return driverSvr;
}]);