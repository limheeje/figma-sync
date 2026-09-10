import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

/* Figma: Page 1 — CJ WMS 핸디 앱 화면 플로우 */
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: () => import('./screens/LoginScreen.vue'),
    meta: { title: '로그인', node: '8:7448' },
  },
  {
    path: '/scan',
    name: 'scan',
    component: () => import('./screens/ScanScreen.vue'),
    meta: { title: '스캔', node: '8:7475' },
  },
  {
    path: '/picking',
    name: 'picking',
    component: () => import('./screens/PickingScreen.vue'),
    meta: { title: '피킹', node: '8:7519' },
  },
  {
    path: '/product-input',
    name: 'product-input',
    component: () => import('./screens/ProductInputScreen.vue'),
    meta: { title: '상품투입', node: '8:7612' },
  },
  {
    path: '/complete',
    name: 'complete',
    component: () => import('./screens/CompleteScreen.vue'),
    meta: { title: '투입완료', node: '8:7560' },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
