import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'
import TabsPage from '../views/TabsPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/home'
      },
      {
        path: 'tabs/home',
        component: () => import('../views/HomePage.vue')
      },
      {
        path: 'tabs/detection/:exerciseType',
        component: () => import('../views/DetectionPage.vue')
      },
      {
        path: 'tabs/settings',
        component: () => import('../views/SettingsPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router