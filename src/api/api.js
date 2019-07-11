import axios from '@/plugins/axios'
import config from '../../config/address'
import utils from '@/plugins/utils'

let prefix = '/nurserystock'

function getUrl(str = ''){
	return prefix + str
}

/*直接查询品类*/
function searchCategory(params){
  return axios.get(getUrl('/core/public/categorys/' + params.name), {params})
}

/*获取品类规格(标准)*/
function getSpecs(){
	return axios.get(getUrl('/core/public/allspecs'))
}

function getBase(params){
  return axios.get('/core/base', {params})
}

/*系统自动匹配供应商(好友和陌生人)*/
function sysMatching(params){
  return axios.get(getUrl('/biz/space/order/suppliers/' + params.userid), {params})
}

function newOrder(params){
	return axios.post(getUrl('/biz/space/order'), params)
}

/*查询用户的询盘单*/
function searchCategoryFromInquiry(params){
	return axios.get(getUrl('/biz/space/order/enquirys/' + params.userid), {params})
}

/*用户登录验证*/
function checkLogin(params){
	return axios.post(getUrl('/user/login'), params)
}

/*保存用户报价单(草稿状态)*/
function saveOrder(params){
	return axios.put(getUrl('/biz/space/order'), params)
}

/*按照状态查询订单*/
function searchOrderList(params){
	return axios.get(getUrl('/biz/space/order/userorders/' + params.userid), {params})
}

/*查看订单详情（有品类列表的）*/
function orderDetail(params){
  return axios.get(getUrl('/biz/space/order/userorder/' + params.orderid), {params})
}

/*查看订单某个品类详情*/
function orderCategoryDetail(params){
  return axios.get(getUrl('/biz/space/order/userorder/item/unquote/' + params.itemid), {params})
}

/*删除订单*/
function remove(params){
  return axios.delete(getUrl('/biz/space/order'), {data: params})
}

/*从报价单中删除一个品类*/
function removeCategoryFromBjd(params){
  return axios.delete(getUrl('/biz/space/order/single'), {data: params})
}

/*发布报价单*/
function publishOffer(params){
  return axios.put(getUrl('/biz/space/order/publish'), params)
}

/*获取生意圈主界面上报价单列表*/
function businessList(params){
  return axios.get(getUrl('/biz/zone/orders/' + params.userid), {params})
}

function getMsgs(){
	return axios.get(getUrl('/biz/zone/msgs'))
}

/*获取天气数据（以后从后端获取）*/
function getWeather(city){
	console.log('/weather/index?cityname=' + city.replace('市', '') + '&dtype=json&format=1&key=' + utils.getAppKey())
  return axios.get('/weather/index?cityname=' + city.replace('市', '') + '&dtype=json&format=1&key=' + utils.getAppKey())
}

/*向长连接发送指令*/
function sendMsg(params){
  return axios.head(getUrl('/biz/msg/channel/command/' + params.userid), {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': '*',
			'Access-Control-Allow-Headers': '*'
		},
  	params
  })
}

/*获得生意圈中某个报价单下的品类列表*/
function businessCategoryList(params){
  return axios.get(getUrl('/biz/zone/order/items/' + params.orderid), {params})
}

/*生意圈中保存临时报价数据（保存完后该报价单转到“我的接单”中）*/
function saveOrderTakes(params){
  return axios.post(getUrl('/biz/space/order/usertak'), params)
}

/*查询用户自己接收的报价单*/
function getMyAcceptFromList(params){
  return axios.get(getUrl('/biz/space/order/usertaks/' + params.userid), {params})
}

/*获得我的接单中某个报价单下的品类列表*/
function getMyAcceptChosedCategoryList(params){
  return axios.get(getUrl('/biz/space/order/usertak/selecteditems/' + params.takid), {params})
}

/*确定发布我的接单报价*/
function publishTakOrder(params){
  return axios.put(getUrl('/biz/space/order/usertak/publish'), params)
}

/*获得已报价的品类的详情*/
function getReportedCategoryDetail(params){
  return axios.get(getUrl('/biz/space/order/userorder/item/quote/' + params.itemid), {params})
}

/*保存已报价的供应商(针对某一个品类的)*/
function saveReportedCategorySuppliers(params){
  return axios.post(getUrl('/biz/space/order/confirm/publish/single'), params)
}

/*工程公司在查看自己发布的报价单中， 修改供应商报上来的报价信息*/
function modifySupplierPrice(params){
  return axios.put(getUrl('/biz/space/order/confirm/single'), params)
}

/*发布已报价的供应商(针对整个报价单的)*/
function publishReportedCategorySuppliers(params){
  return axios.post(getUrl('/biz/space/order/confirm/' + params.userid), params)
}

/*经纪人查看工程公司确认过的报价单品类列表*/
function getAccecptConfirmDetail(params){
	return axios.get(getUrl('/biz/space/order/usertak/items/' + params.takid), {params})
}

/*获得我关注的人*/
function getFriends(params){
  return axios.get(getUrl('/user/addrlist/' + params.userid), {params})
}

/*获得其他用户信息*/
function getUserInfo(params){
  return axios.get(getUrl('/user/info/' + params.userid), {params})
}

/*修改好友信息*/
function modifyFriend(params){
  return axios.put(getUrl('/user/addrlist'), params)
}

/*关注*/
function addFriend(params){
  return axios.put(getUrl('/user/addfriend/' + params.userid), params)
}

/*取消关注*/
function removeFriend(params){
  return axios.delete(getUrl('/user/addrlist'), {data: params})
}

/*删除接单中的品类*/
function deleteCategory(params){
  return axios.delete(getUrl('/biz/space/order/usertak/single'), {data: params})
}

/*拉黑*/
function blackFriend(params){
  return axios.put(getUrl('/user/addrlist/maskfriend'), params)
}

/*拉黑恢复*/
function unblackFriend(params){
  return axios.put(getUrl('/user/addrlist/unmaskfriend'), params)
}

/*提交发货单*/
function submitInvoice(params){
  return axios.put(getUrl('/biz/space/invoice'), params)
}

/*修改工程公司发货单下某供应商某品类价格信息*/
function modifyCategoryPriceInfo(params){
  return axios.put(getUrl('/biz/space/invoice/published'), params)
}

/*删除工程公司发货单下某供应商某品类*/
function removeCategoryPriceInfo(params){
	return axios.delete(getUrl('/biz/space/invoice/published'), {data: params})
}

/*工程公司查询自己的发货单*/
function getMyGoods(params){
  return axios.get(getUrl('/biz/space/invoicegs/' + params.userid), {params})
}

/*发货单详情（下面的品类列表）*/
function getMyGoodDetail(params){
  return axios.get(getUrl('/biz/space/invoiceg/cates/' + params.groupid), {params})
}

/*发货单某一个供应商下品类列表*/
function getMyGoodSupplierCategorys(params){
  return axios.get(getUrl('/biz/space/invoiceg/invoice/items/' + params.invoiceid), {params})
}

/*工程公司发货单下供应商列表*/
function getMyGoodSuppliers(params){
  return axios.get(getUrl('/biz/space/invoiceg/invoices/' + params.groupid), {params})
}

/*发布工程公司下某个供应商发货单*/
function publishInvoice(params){
  return axios.put(getUrl('/biz/space/invoices/publish'), params)
}

/*删除工程公司发货单或者发货单下供应商或者供应商下品类*/
function removeInvoice(params){
  return axios.delete(getUrl('/biz/space/invoices'), {data: params})
}

function saveInvoice(params){
  return axios.post(getUrl('/biz/space/invoices'), params)
}

/*供应商获得工程公司给自己的发货单*/
function getAcceptInvoices(params){
	return axios.get(getUrl('/biz/space/supplier/invoices/' + params.userid), {params})
}

/*供应商查看工程公司发货单下品类列表*/
function getAccpetInvoiceCategorys(params){
  return axios.get(getUrl('/biz/space/supplier/invoice/items/' + params.invoiceid), {params})
}

/*供应商查看工程公司回复自己的报价单时， 同意或者放弃*/
function agreeOrNagtive(params){
  return axios.put(getUrl('/biz/space/trade/response'), params)
}

function offerAgreeOrNagtive(params){
  return axios.put(getUrl('/biz/space/order/usertak/items/confirm/response'), params)
}

/*供应商获取自己的订单*/
function getMyOrders(params){
  return axios.get(getUrl('/biz/space/supplier/invoice/trades/' + params.invoiceid), {params})
}

/*供应商创建自己的订单*/
function createMyOrder(params){
  return axios.post(getUrl('/biz/space/supplier/trade'), params)
}

/*供应商保存自己的订单（仅保存订单基本信息，不包括订单项目）*/
function saveMyOrder(params){
  return axios.put(getUrl('/biz/space/supplier/trade'), params)
}

/*供应商修改发布状态下订单中的品类报价信息*/
function saveCategorys2Order(params){
	return axios.put(getUrl('/biz/space/supplier/trade/item'), params)
}

/*发布订单*/
function publishOrder(params){
  return axios.put(getUrl('/biz/space/trade/item/purchaser'), params)
}

/*供应商自己的订单详情*/
function getOrderDetail(params){
  return axios.get(getUrl('/biz/space/trade/' + params.tradeid), {params})
}

/*查看验收对应的订单详情*/
function getExamOrderDetail(params){
  return axios.get(getUrl('/biz/space/trade/examine/' + params.tradeid), {params})
}

/*查询用户地址列表*/
function getAddresses(params){
  return axios.get(getUrl('/biz/space/trade/addresses/' + params.userid), {params})
}

/*保存用户地址（新增、修改）*/
function saveAddress(params){
  return axios.put(getUrl('/biz/space/trade/item/purchaser'), params)
}

function removeAddress(params){
  return axios.delete(getUrl('/biz/space/trade/address'), {data: params})
}

/*查询用户地址列表*/
function getDrivers(params){
	return axios.get(getUrl('/biz/space/trade/veroutes/' + params.userid), {params})
}

/*查询省*/
function getProvincesOrCitys(params){
	return axios.get(getUrl('/core/public/allcitys/' + params.type), {params})
}

/*保存地址*/
function saveAddr(params){
	return axios.put(getUrl('/biz/space/trade/address'), params)
}

/*查询道路运输*/
function getCars(params){
  return axios.get(getUrl('/biz/space/trade/veroutes/' + params.userid), {params})
}

/*保存道路运输*/
function saveCar(params){
	return axios.put(getUrl('/biz/space/trade/veroute'), params)
}

/*删除道路运输*/
function deleteCar(params){
	return axios.delete(getUrl('/biz/space/trade/veroute'), {data: params})
}

/*放弃报价*/
function giveupOffer(params){
  return axios.put(getUrl('/biz/space/order/usertak/abandon'), params)
}

function getConfirmedOffer(params){
  return axios.get(getUrl('/biz/space/order/userorder/confirm/items/' + params.orderid), {params})
}

/*工程公司在提交了发货单后, 单独修改某个品类的发货价格信息*/
function modifyPrice(params){
	return axios.put(getUrl('/biz/space/invoice/item/published'), params)
}

/*工程公司在提交了发货单后, 单独删除了某个品类的发货价格信息*/
function removeCategory(params){
  return axios.delete(getUrl('/biz/space/invoice/published'), {data: params})
}

function deleteOrder(params){
  return axios.delete(getUrl('/biz/space/supplier/trade/single'), {data: params})
}

/*发布订单*/
function publishOrder2(params){
	return axios.post(getUrl('/biz/space/supplier/trade/publish'), params)
}

/*订单发车*/
function deliveryOrder(params){
  return axios.post(getUrl('/biz/space/supplier/trade/delivery'), params)
}

/*删除订单中的品类（未发布订单或已发布的）*/
function deleteCategoryFromOrder(params){
  return axios.delete(getUrl('/biz/space/supplier/trade/single'), {data: params})
}

/*求购方获取自己接收到的订单列表*/
function getMyAcceptOrders(params){
  return axios.get(getUrl('/biz/space/purchaser/trades/' + params.userid), {params})
}

/*求购方获取自己接收到的订单列表*/
function getOrders(params){
  return axios.get(getUrl('/biz/space/supplier/trades/' + params.userid), {params})
}

/*获取系统字典表内容*/
function getCode(params){
	return axios.get(getUrl('/core/public/distionarys/' + params.code), {params})
}

/*获取系统字典表内容*/
function saveUserInfo(params){
	return axios.put(getUrl('/user/updatefriend/' + params.userid), params)
}

/*获取认证朋友信息*/
function getIdentfriends(params){
  return axios.get(getUrl('/user/addrlist/identfriend/' + params.userid), {params})
}

function responseFriend(params){
  return axios.put(getUrl('/user/addrlist/identfriend/response'), params)
}

function userRegist(params){
  return axios.post(getUrl('/user/account/register'), params)
}

/*根据手机号码或人名查询联系人*/
function searchFriends(params){
  return axios.get(getUrl('/user/account/user/' + params.userid), {params})
}

/*申请添加好友*/
function addMyFriend(params){
  return axios.put(getUrl('/user/addrlist/addfriend'), params)
}

function setExaminers(params){
  return axios.put(getUrl('/biz/space/purchaser/trade/allot/examiner'), params)
}

function searchTasks(params){
	return axios.get(getUrl('/biz/space/work/works/' + params.userid), {params})
}

function responseTask(params){
  return axios.put(getUrl('/biz/space/work/response'), params)
}

function examinFinished(params){
  return axios.put(getUrl('/biz/space/purchaser/trade/examine/save'), params)
}

function getMessageAddressInfo(params){
  return axios.get(getUrl('/user/account/xmpp/' + params.mobile), {params})
}

function getMyGoodGroups(params){
	return axios.get(getUrl('/biz/space/goods/productcollects/' + params.userid), {params})
}

function saveGoodGroup(params){
	return axios.post(getUrl('/biz/space/goods/productcollect'), params)
}

function saveGoods(params){
  return axios.put(getUrl('/biz/space/goods/product'), params)
}

function getFarms(params){
  return axios.get(getUrl('/biz/space/goods/farms/' + params.userid), {params})
}

function saveFarm(params){
  return axios.post(getUrl('/biz/space/goods/farm'), params)
}

/*开始验收*/
function startExam(params){
  return axios.put(getUrl('/biz/space/purchaser/trade/examine/open'), params)
}

/*发布验收*/
function publishExam(params){
  return axios.put(getUrl('/biz/space/purchaser/trade/examine/publish'), params)
}

/*经纪人响应验收结果*/
function responseExamine(params){
  return axios.put(getUrl('/biz/space/supplier/trade/examine/response'), params)
}

export default {
  searchCategory,
  getBase,
	sysMatching,
	newOrder,
	searchCategoryFromInquiry,
	getSpecs,
	checkLogin,
	saveOrder,
  publishOffer,
	searchOrderList,
  businessList,
  orderDetail,
  orderCategoryDetail,
  remove,
  getWeather,
  sendMsg,
  businessCategoryList,
  saveOrderTakes,
  getMyAcceptFromList,
  getMyAcceptChosedCategoryList,
  publishTakOrder,
  getReportedCategoryDetail,
	saveReportedCategorySuppliers,
  publishReportedCategorySuppliers,
	getAccecptConfirmDetail,
	getFriends,
  getUserInfo,
  addFriend,
  removeFriend,
  blackFriend,
  unblackFriend,
	getMsgs,
  submitInvoice,
  getMyGoods,
  getMyGoodDetail,
  getMyGoodSupplierCategorys,
  getMyGoodSuppliers,
  publishInvoice,
  modifyCategoryPriceInfo,
  removeInvoice,
  saveInvoice,
	getAcceptInvoices,
  getAccpetInvoiceCategorys,
  agreeOrNagtive,
	removeCategoryPriceInfo,
  getMyOrders,
  createMyOrder,
	saveCategorys2Order,
  publishOrder,
	getOrderDetail,
	getExamOrderDetail,
  getAddresses,
  saveAddress,
  removeAddress,
	getDrivers,
	getProvincesOrCitys,
	saveAddr,
  getCars,
	saveCar,
	deleteCar,
  giveupOffer,
  getConfirmedOffer,
	modifyPrice,
  removeCategory,
  deleteOrder,
	publishOrder2,
  deleteCategoryFromOrder,
  deleteCategory,
  getMyAcceptOrders,
  getOrders,
	getCode,
  saveMyOrder,
  deliveryOrder,
	saveUserInfo,
  modifyFriend,
  getIdentfriends,
  responseFriend,
  modifySupplierPrice,
  offerAgreeOrNagtive,
  userRegist,
  searchFriends,
  addMyFriend,
  setExaminers,
	searchTasks,
  responseTask,
  examinFinished,
  getMessageAddressInfo,
	getMyGoodGroups,
	saveGoodGroup,
  saveGoods,
  getFarms,
  saveFarm,
  startExam,
  getExamOrderDetail,
  publishExam,
  responseExamine,
  removeCategoryFromBjd
}
