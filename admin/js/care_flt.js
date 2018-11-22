angular.module('app.filters', [])

	.filter("UseStatusFilter", function() {
		return function(useStatus) {
			if(useStatus == 1) {
				return "已启用";
			}
			if(useStatus == 0) {
				return "未启用";
			}
			return "-";
		}
	})

	.filter("InstTypeFilter", function() {
		return function(instType) {
			if(instType == 1) {
				return "医院";
			}
			if(instType == 2) {
				return "社区";
			}
			return "-";
		}
	})
	
	.filter("JobTypeFilter", function() {
		return function(jobType) {
			if(jobType == 1) {
				return "白班";
			}
			if(jobType == 2) {
				return "夜班";
			}
			if(jobType == 3) {
				return "全天";
			}
			return "-";
		}
	})
	
	.filter("serviceAddressFilter", function() {
		return function(serviceAddress) {
			if(serviceAddress == 1) {
				return "医院";
			}
			if(serviceAddress == 2) {
				return "社区";
			}
			return "-";
		}
	})

	.filter("orderStateFilter", function() {
		return function(orderState) {
			if(orderState == 1) {
				return "待排班";
			}
			if(orderState == 2) {
				return "已取消";
			}
			if(orderState == 3) {
				return "服务中";
			}
			if(orderState == 4) {
				return "待支付";
			}
			if(orderState == 5) {
				return "已支付";
			}
			if(orderState == 6) {
				return "已完成";
			}
			return "-";
		}
	})

	.filter("SchStateFilter", function() {
		return function(schState) {
			if(schState == 0) {
				return "已取消";
			}
			if(schState == 1) {
				return "待确认";
			}
			if(schState == 2) {
				return "已确认";
			}
			return "-";
		}
	})

	.filter("SexFilter", function() {
		return function(sex) {
			if(sex == 1) {
				return "男";
			}
			if(sex == 2) {
				return "女";
			}
			if(sex == 0) {
				return "-";
			}
			return "-";
		}
	})

	.filter("UnitFilter", function() {
		return function(unit) {
			if(unit == 1) {
				return "时";
			}
			if(unit == 2) {
				return "天";
			}
			if(unit == 3) {
				return "周";
			}
			if(unit == 4) {
				return "月";
			}
			if(unit == 5) {
				return "年";
			}
			return "-";
		}
	})

	.filter("PersonTypeFilter", function() {
		return function(personType) {
			if(personType == 1) {
				return "在编";
			}
			if(personType == 2) {
				return "加盟";
			}
			return "-";
		}
	})

	.filter("JobFilter", function() {
		return function(job) {
			if(job == 1) {
				return "在职";
			}
			if(job == 2) {
				return "离职";
			}
			return "-";
		}
	})

	.filter("FixedFilter", function() {
		return function(fixed) {
			if(fixed == true) {
				return "是";
			}
			return "否";
		}
	})

	.filter("PayTypeFilter", function() {
		return function(payType) {
			if(payType == 1) {
				return "在线支付";
			}
			if(payType == 2) {
				return "扫码支付";
			}
			if(payType == 3) {
				return "公司转账";
			}
			if(payType == 4) {
				return "现金支付";
			}
			return "未支付";
		}
	})
	
	.filter("OrderTypeFilter", function() {
		return function(orderType) {
			if(orderType == 1) {
				return "线上订单";
			}
			if(orderType == 2) {
				return "线下订单";
			}
			return "-";
		}
	})
	
	.filter("proofTypeFilter", function() {
		return function(proofType) {
			if(proofType == 1) {
				return "收据";
			}
			if(proofType == 2) {
				return "发票";
			}
			return "-";
		}
	})
	
	.filter("BillStatusFilter", function() {
		return function(billStatus) {
			if(billStatus == 0) {
				return "未关账";
			}
			if(billStatus == 1) {
				return "已关账";
			}
			return "-";
		}
	})
	
	.filter("SettleStatusFilter", function() {
		return function(settleStatus) {
			if(settleStatus == 1) {
				return "未结算";
			}
			if(settleStatus == 2) {
				return "已结算";
			}
			if(settleStatus == 3) {
				return "已关账";
			}
			return "-";
		}
	})
	
	.filter("UseStatusFilter", function() {
		return function(useStatus) {
			if(useStatus == 1) {
				return "已启用";
			}
			if(useStatus == 0) {
				return "未启用";
			}
			return "-";
		}
	})
	

	.filter("FixedFilter", function() {
		return function(fixed) {
			if(fixed == true) {
				return "是";
			}
			return "否";
		}
	})

	.filter("AclUserAcctStatusFilter", function() {
		return function(aclUserAcctStatus) {
			if(aclUserAcctStatus == 1) {
				return "正常";
			}
			if(aclUserAcctStatus == 2) {
				return "已冻结";
			}
			if(aclUserAcctStatus == 3) {
				return "已销户";
			}
			return "-";
		}
	});