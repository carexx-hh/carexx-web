angular.module('app.routers', [])

.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/login');
	$stateProvider.state('/', {
		url: '/',
		templateUrl: 'tpl/layout.html?v=20180302',
		controller: "MainCtrl"
	}).state('login', {
		url: '/login',
		templateUrl: 'tpl/login.html?v=20180302',
		controller: "LoginCtrl"
	}).state('/.dashboard', {
		url: 'dashboard',
		templateUrl: 'tpl/dashboard.html?v=20180302',
		controller: "DashboardCtrl"
	}).state('/.instList', {/*医院管理*/
		url: 'inst/list',
		templateUrl: 'tpl/inst/instList.html?v=20180302',
		controller: "InstListCtrl"
	}).state('/.instAdd', {/*医院管理新增*/
		url: 'inst/add',
		templateUrl: 'tpl/inst/instAdd.html?v=20180302',
		controller: "InstAddCtrl"
	}).state('/.instEdit', {/*医院管理编辑*/
		url: 'inst/edit',
		templateUrl: 'tpl/inst/instEdit.html?v=20180302',
		controller: "InstEditCtrl"
	}).state('/.jobTypeList', {/*医院班次管理*/
		url: 'jobtype/list',
		templateUrl: 'tpl/jobtype/jobTypeList.html?v=20180302',
		controller: "JobTypeListCtrl"
	}).state('/.jobTypeAdd', {/*医院班次新增*/
		url: 'jobtype/add',
		templateUrl: 'tpl/jobtype/jobTypeAdd.html?v=20180302',
		controller: "JobTypeAddCtrl"
	}).state('/.jobTypeEdit', {/*医院班次编辑*/
		url: 'jobtype/edit',
		templateUrl: 'tpl/jobtype/jobTypeEdit.html?v=20180302',
		controller: "JobTypeEditCtrl"
	}).state('/.companyList', {/*公司管理*/
		url: 'company/list',
		templateUrl: 'tpl/company/companyList.html?v=20180302',
		controller: "CompanyListCtrl"
	}).state('/.companyAdd', {/*公司管理新增*/
		url: 'company/add',
		templateUrl: 'tpl/company/companyAdd.html?v=20180302',
		controller: "CompanyAddCtrl"
	}).state('/.dictList', {/*数据字典*/
		url: 'dict/list',
		templateUrl: 'tpl/dict/dictList.html?v=20180302',
		controller: "DictListCtrl"
	}).state('/.dictAdd', {/*数据字典新增*/
		url: 'dict/Add',
		templateUrl: 'tpl/dict/dictAdd.html?v=20180302',
		controller: "DictAddCtrl"
	}).state('/.dictEdit', {/*数据字典编辑*/
		url: 'dict/Edit',
		templateUrl: 'tpl/dict/dictEdit.html?v=20180302',
		controller: "DictEditCtrl"
	}).state('/.dictDataList', {/*字典数据*/
		url: 'dictdata/list',
		templateUrl: 'tpl/dictdata/dictDataList.html?v=20180302',
		controller: "DictDataListCtrl"
	}).state('/.dictDataAdd', {/*字典数据新增*/
		url: 'dictdata/Add',
		templateUrl: 'tpl/dictdata/dictDataAdd.html?v=20180302',
		controller: "DictDataAddCtrl"
	}).state('/.dictDataEdit', {/*字典数据编辑*/
		url: 'dictdata/Edit',
		templateUrl: 'tpl/dictdata/dictDataEdit.html?v=20180302',
		controller: "DictDataEditCtrl"
	}).state('/.workTypeList', {/*工种信息*/
		url: 'worktype/list',
		templateUrl: 'tpl/worktype/workTypeList.html?v=20180302',
		controller: "WorkTypeListCtrl"
	}).state('/.workTypeAdd', {/*工种信息新增*/
		url: 'worktype/Add',
		templateUrl: 'tpl/worktype/workTypeAdd.html?v=20180302',
		controller: "WorkTypeAddCtrl"
	}).state('/.workTypeEdit', {/*工种信息编辑*/
		url: 'worktype/Edit',
		templateUrl: 'tpl/worktype/workTypeEdit.html?v=20180302',
		controller: "WorkTypeEditCtrl"
	}).state('/.customerList', {/*客户管理*/
		url: 'customer/list',
		templateUrl: 'tpl/customer/customerList.html?v=20180302',
		controller: "CustomerListCtrl"
	}).state('/.customerAdd', {/*客户管理新增*/
		url: 'customer/add',
		templateUrl: 'tpl/customer/customerAdd.html?v=20180302',
		controller: "CustomerAddCtrl"
	}).state('/.customerEdit', {/*客户管理编辑*/
		url: 'customer/edit',
		templateUrl: 'tpl/customer/customerEdit.html?v=20180302',
		controller: "CustomerEditCtrl"
	}).state('/.staffList', {/*人员档案*/
		url: 'staff/list',
		templateUrl: 'tpl/staff/staffList.html?v=20180302',
		controller: "StaffListCtrl"
	}).state('/.staffAdd', {/*人员档案新增*/
		url: 'staff/add',
		templateUrl: 'tpl/staff/staffAdd.html?v=20180302',
		controller: "StaffAddCtrl"
	}).state('/.staffEdit', {/*人员档案编辑*/
		url: 'staff/edit',
		templateUrl: 'tpl/staff/staffEdit.html?v=20180302',
		controller: "StaffEditCtrl"
	}).state('/.serviceList', {/*服务管理*/
		url: 'service/list',
		templateUrl: 'tpl/service/serviceList.html?v=20180302',
		controller: "ServiceListCtrl"
	}).state('/.serviceAdd', {/*服务管理新增*/
		url: 'service/add',
		templateUrl: 'tpl/service/serviceAdd.html?v=20180302',
		controller: "ServiceAddCtrl"
	}).state('/.serviceEdit', {/*服务管理编辑*/
		url: 'service/edit',
		templateUrl: 'tpl/service/serviceEdit.html?v=20180302',
		controller: "ServiceEditCtrl"
	}).state('/.careserList', {/*服务项目*/
		url: 'careser/list',
		templateUrl: 'tpl/careser/careserList.html?v=20180302',
		controller: "CareserListCtrl"
	}).state('/.careserAdd', {/*服务项目新增*/
		url: 'careser/add',
		templateUrl: 'tpl/careser/careserAdd.html?v=20180302',
		controller: "CareserAddCtrl"
	}).state('/.careserEdit', {/*服务项目编辑*/
		url: 'careser/edit',
		templateUrl: 'tpl/careser/careserEdit.html?v=20180302',
		controller: "CareserEditCtrl"
	}).state('/.instSettleList', {/*结算标准*/
		url: 'settle/list',
		templateUrl: 'tpl/settle/instSettleList.html?v=20180302',
		controller: "InstSettleListCtrl"
	}).state('/.instSettleAdd', {/*结算标准新增*/
		url: 'settle/add',
		templateUrl: 'tpl/settle/instSettleAdd.html?v=20180302',
		controller: "InstSettleAddCtrl"
	}).state('/.instSettleEdit', {/*结算标准编辑*/
		url: 'settle/edit',
		templateUrl: 'tpl/settle/instSettleEdit.html?v=20180302',
		controller: "InstSettleEditCtrl"
	}).state('/.holidayList', {/*节假管理*/
		url: 'holiday/list',
		templateUrl: 'tpl/holiday/holidayList.html?v=20180302',
		controller: "HolidayListCtrl"
	}).state('/.holidayAdd', {/*节假管理新增*/
		url: 'holiday/add',
		templateUrl: 'tpl/holiday/holidayAdd.html?v=20180302',
		controller: "HolidayAddCtrl"
	}).state('/.holidayEdit', {/*节假管理编辑*/
		url: 'holiday/edit',
		templateUrl: 'tpl/holiday/holidayEdit.html?v=20180302',
		controller: "HolidayEditCtrl"
	}).state('/.lesionList', {/*病区管理*/
		url: 'lesion/list',
		templateUrl: 'tpl/lesion/lesionList.html?v=20180302',
		controller: "LesionListCtrl"
	}).state('/.lesionAdd', {/*病区管理新增*/
		url: 'lesion/add',
		templateUrl: 'tpl/lesion/lesionAdd.html?v=20180302',
		controller: "LesionAddCtrl"
	}).state('/.lesionEdit', {/*病区管理编辑*/
		url: 'lesion/edit',
		templateUrl: 'tpl/lesion/lesionEdit.html?v=20180302',
		controller: "LesionEditCtrl"
	}).state('/.orderList', {/*订单管理*/
		url: 'order/list',
		templateUrl: 'tpl/order/orderList.html?v=20180302',
		controller: "OrderListCtrl"
	}).state('/.orderAdd', {/*订单管理新增*/
		url: 'order/add',
		templateUrl: 'tpl/order/orderAdd.html?v=20180302',
		controller: "OrderAddCtrl"
	}).state('/.orderAddCommunity', {/*订单管理新增社区*/
		url: 'order/add_community',
		templateUrl: 'tpl/order/orderAddCommunity.html?v=20180302',
		controller: "OrderAddCommunityCtrl"
	}).state('/.orderEdit', {/*订单管理编辑*/
		url: 'order/edit',
		templateUrl: 'tpl/order/orderEdit.html?v=20180302',
		controller: "OrderEditCtrl"
	}).state('/.orderSchedule', {/*订单排班*/
		url: 'order/schedule',
		templateUrl: 'tpl/order/orderSchedule.html?v=20180302',
		controller: "OrderScheduleCtrl"
	}).state('/.orderOutSchedule', {/*外派订单排班*/
		url: 'order/out_schedule',
		templateUrl: 'tpl/order/orderOutSchedule.html?v=20180302',
		controller: "OrderOutScheduleCtrl"
	}).state('/.workQuanityList', {/*工量计算*/
		url: 'workquanity/list',
		templateUrl: 'tpl/workquanity/workQuanityList.html?v=20180302',
		controller: "WorkQuanityCtrl"
	}).state('/.serSettleList', {/*结算管理*/
		url: 'sersettle/list',
		templateUrl: 'tpl/sersettle/serSettleList.html?v=20180302',
		controller: "SerSettleCtrl"
	}).state('/.incomeStatList', {/*收入统计*/
		url: 'incomestat/list',
		templateUrl: 'tpl/incomestat/incomeStatList.html?v=20180302',
		controller: "incomeStatCtrl"
	}).state('/.billList', {/*账务管理*/
		url: 'billlist/list',
		templateUrl: 'tpl/billlist/billList.html?v=20180302',
		controller: "BillListCtrl"
	}).state('/.instIncomeList', {/*机构统计*/
		url: 'instIncome/list',
		templateUrl: 'tpl/instIncome/instIncomeList.html?v=20180302',
		controller: "instIncomeCtrl"
	}).state('/.incomeCountList', {/*机构收入统计*/
		url: 'incomecount/list',
		templateUrl: 'tpl/incomestat/incomeCountList.html?v=20180302',
		controller: "incomeStatCtrl"
	}).state('/.aclUserList', {
		url: 'acluser/list',
		templateUrl: 'tpl/acl/aclUserList.html?v=20180302',
		controller: "AclUserCtrl"
	}).state('/.aclUserEdit', {
		url: 'acluser/edit',
		templateUrl: 'tpl/acl/aclUserEdit.html?v=20180302',
		controller: "AclUserEditCtrl"
	}).state('/.aclRoleList', {
		url: 'aclrole/list',
		templateUrl: 'tpl/acl/aclRoleList.html?v=20180302',
		controller: "AclRoleCtrl"
	}).state('/.aclRoleEdit', {
		url: 'aclrole/edit',
		templateUrl: 'tpl/acl/aclRoleEdit.html?v=20180302',
		controller: "AclRoleEditCtrl"
	}).state('/.aclRoleAuthEdit', {
		url: 'aclrole/edit_auth',
		templateUrl: 'tpl/acl/aclRoleAuthEdit.html?v=20180302',
		controller: "AclRoleAuthEditCtrl"
	}).state('/.serviceRatioList', {/*服务比例管理*/
		url: 'serviceratio/list',
		templateUrl: 'tpl/serviceratio/serviceRatioList.html?v=20180302',
		controller: "ServiceratioListCtrl"
	}).state('/.serviceRatioAdd', {/*服务比例新增*/
		url: 'serviceratio/add',
		templateUrl: 'tpl/serviceratio/serviceRatioAdd.html?v=20180302',
		controller: "ServiceRatioAddCtrl"
	}).state('/.serviceRatioEdit', {/*服务比例编辑*/
		url: 'serviceratio/edit',
		templateUrl: 'tpl/serviceratio/serviceRatioEdit.html?v=20180302',
		controller: "ServiceRatioEditCtrl"
	}).state('/.staffScheduleList', {/*人员排班*/
		url: 'staffSchedule/list',
		templateUrl: 'tpl/staffschedule/staffScheduleList.html?v=20180302',
		controller: "StaffScheduleListCtrl"
	});
});