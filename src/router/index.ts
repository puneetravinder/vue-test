import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '../components/ProductList.vue'
import ProductCart from '../components/ProductCart.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/productList/:category',
      name: 'productList',
      component: ProductView
    },
    {
      path: '/productCart',
      name: 'cart',
      component: ProductCart
    },
  ]
})

export default router
