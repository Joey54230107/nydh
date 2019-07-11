import Vue from 'vue'
import Router from 'vue-router'
import WaitingPage from '@/components/pages/Waiting'
import Index from '@/components/pages/Index'
import HomePage from '@/components/pages/home/Index'
import BusinessPage from '@/components/pages/business/Index'
import ChatPage from '@/components/pages/chat/Index'
import MyPage from '@/components/pages/my/Index'
import ToastPage from '@/components/dialog/Toast'
import ErrorPage from '@/components/dialog/Error'
import ConfirmPage from '@/components/dialog/Confirm'
import LoginPage from '@/components/pages/Login'
import LocationPage from '@/components/pages/Location'
import PersonInfoPage from '@/components/pages/PersonInfo'
import UserEditorPage from '@/components/pages/my/user/UserEditor'
import PopMenu from '@/components/comm/PopMenu'
import CodesPage from '@/components/pages/Codes'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
		{path: '/', component: Index},
		{path: '/home', component: HomePage},
		{path: '/business', component: BusinessPage},
    {path: '/liaotian', component: ChatPage},
    {path: '/my', component: MyPage},
    {path: '/login', component: LoginPage},
    {path: '/popmenu', component: PopMenu},
		{path: '/waiting', component: WaitingPage},
    {path: '/location', component: LocationPage},
		{path: '/PersonInfo', component: PersonInfoPage},
    {path: '/userEditor', component: UserEditorPage},
		{path: '/toast', component: ToastPage},
		{path: '/error', component: ErrorPage},
		{path: '/confirm', component: ConfirmPage},
    {path: '/codes', component: CodesPage},

    /*登录/注册*/
    {path: '/regist', component: () => import('@/components/pages/Regist')},

    /*聊天*/
    {path: '/chatDetail', component: () => import('@/components/pages/chat/Chat')},

		/*我的联系人*/
		{path: '/contact', component: () => import('@/components/pages/contact/Index')},
		{path: '/userDetail', component: () => import('@/components/pages/contact/UserDetail')},
		{path: '/newFriends', component: () => import('@/components/pages/contact/NewFriends')},
    {path: '/groupSetup', component: () => import('@/components/pages/contact/GroupSetup')},
    {path: '/searchFriend', component: () => import('@/components/pages/contact/SearchFriend')},

    /*我的农场*/
    {path: '/map', component: () => import('@/components/pages/map/Map')},
		{path: '/myFram', component: () => import('@/components/pages/home/farm/Farms')},
		{path: '/group', component: () => import('@/components/pages/home/farm/Group')},
		{path: '/goods', component: () => import('@/components/pages/home/farm/Goods')},
    {path: '/farm', component: () => import('@/components/pages/home/farm/Farm')},

    /*我接收到的报价单*/
    {path: '/myAccept', component: () => import('@/components/pages/my/accept/AcceptFrom')},
    {path: '/myAccecptDetail', component: () => import('@/components/pages/my/accept/AcceptFromDetail')},
		{path: '/myAccecptConfirmDetail', component: () => import('@/components/pages/my/accept/AcceptConfirmFromDetail')},

		/*报价单*/
    {path: '/myOffer', component: () => import('@/components/pages/my/offer/Index')},
    {path: '/orderInnerList', component: () => import('@/components/pages/my/offer/OrderInnerList')},
		{path: '/orderFilter', component: () => import('@/components/pages/my/offer/OrderFilter')},
    {path: '/categoryDetail', component: () => import('@/components/pages/my/offer/CategoryDetail')},
    {path: '/orderDetail', component: () => import('@/components/pages/my/offer/OrderDetail')},
    {path: '/reportedOrder', component: () => import('@/components/pages/my/offer/ReportedOrder')},
		{path: '/reportedCategory', component: () => import('@/components/pages/my/offer/ReportedCategory')},
		{path: '/confirmedOrder', component: () => import('@/components/pages/my/offer/ConfirmedOrder')},

    /*查找品类（公用页面）*/
    {path: '/searchCateory', component: () => import('@/components/pages/my/offer/SearchCategory')},

    /*我创建的发货单（工程公司）*/
    {path: '/myGoods', component: () => import('@/components/pages/my/goods/Goods')},
    {path: '/myGoodSupplierCategorys', component: () => import('@/components/pages/my/goods/GoodSupplierCategorys')},
    {path: '/myGoodSuppliers', component: () => import('@/components/pages/my/goods/GoodSuppliers')},

		/*我接收到的发货单(供应商)*/
    {path: '/myAcceptGoods', component: () => import('@/components/pages/my/goods/AcceptGoods')},
    {path: '/myAcceptGoodCategorys', component: () => import('@/components/pages/my/goods/AcceptGoodCategorys')},
    {path: '/categoryInOrders', component: () => import('@/components/pages/my/goods/CategoryInOrders')},

    /*我的订单*/
		{path: '/myAcceptOrders', component: () => import('@/components/pages/my/order/AcceptOrders')},
		{path: '/myOrderDetail', component: () => import('@/components/pages/my/order/OrderDetail')},
    {path: '/myOrders', component: () => import('@/components/pages/my/order/Orders')},
    {path: '/myAcceptOrderDetail', component: () => import('@/components/pages/my/order/AcceptOrderDetail')},
		{path: '/moneySelect', component: () => import('@/components/pages/my/order/PreMoneySelect')},
    {path: '/examiners', component: () => import('@/components/pages/my/order/Examiners')},

		/*我的地址维护*/
		{path: '/addresses', component: () => import('@/components/pages/my/address/Addresses')},
		{path: '/address', component: () => import('@/components/pages/my/address/Address')},

    /*生意圈*/
    {path: '/businessInnerList', component: () => import('@/components/pages/business/BusinessInnerList')},
    {path: '/businessEditCategory', component: () => import('@/components/pages/business/EditCategory')},

		/*我的车辆管理*/
		{path: '/drivers', component: () => import('@/components/pages/my/driver/Drivers')},
    {path: '/driver', component: () => import('@/components/pages/my/driver/Driver')},

    /*我的任务*/
    {path: '/tasks', component: () => import('@/components/pages/home/task/Index')},
    {path: '/taskOrderDetail', component: () => import('@/components/pages/home/task/TaskOrderDetail')},
    {path: '/categoryExamin', component: () => import('@/components/pages/home/task/TaskOrderExamin')}
  ]
})
