import layoutAdmin from '../layout/admin/Layout'
import layoutLogin from '../layout/user/loginlayout/login'

//admin
import homeAdmin from '../pages/admin/index'
import userAdmin from '../pages/admin/user'
import AdminCateory from '../pages/admin/category'
import AdminBlog from '../pages/admin/blog'
import AdminAddBlog from '../pages/admin/addblog'
import AdminDoanhThu from '../pages/admin/doanhthu'
import AdminProduct from '../pages/admin/product'
import AdminAddProduct from '../pages/admin/addproduct'


//public
import login from '../pages/public/login'
import index from '../pages/public/index'
import regis from '../pages/public/regis'
import confirm from '../pages/public/confirm'
import PublicBlog from '../pages/public/blog'
import PublicBlogDetail from '../pages/public/blogdetail'
import PublicForgot from '../pages/public/forgot'
import PublicCheckOut from '../pages/public/checkout'
import PublicPayment from '../pages/public/payment'
import PublicAccount from '../pages/public/account'

const publicRoutes = [
    { path: "/", component: index},
    { path: "/index", component: index},
    { path: "/login", component: login, layout: layoutLogin },
    { path: "/regis", component: regis, layout: layoutLogin },
    { path: "/confirm", component: confirm, layout: layoutLogin },
    { path: "/blog", component: PublicBlog},
    { path: "/blogdetail", component: PublicBlogDetail},
    { path: "/forgot", component: PublicForgot, layout: layoutLogin},
    { path: "/checkout", component: PublicCheckOut, layout: layoutLogin},
    { path: "/payment", component: PublicPayment, layout: layoutLogin},
    { path: "/account", component: PublicAccount},
];


const adminRoutes = [
    { path: "/admin/index", component: homeAdmin, layout: layoutAdmin },
    { path: "/admin/user", component: userAdmin, layout: layoutAdmin },
    { path: "/admin/category", component: AdminCateory, layout: layoutAdmin },
    { path: "/admin/blog", component: AdminBlog, layout: layoutAdmin },
    { path: "/admin/addblog", component: AdminAddBlog, layout: layoutAdmin },
    { path: "/admin/doanhthu", component: AdminDoanhThu, layout: layoutAdmin },
    { path: "/admin/product", component: AdminProduct, layout: layoutAdmin },
    { path: "/admin/addproduct", component: AdminAddProduct, layout: layoutAdmin },
];



export { publicRoutes, adminRoutes};
