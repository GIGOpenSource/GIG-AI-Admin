import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Datastatistics',
      component: () => import('../views/Datastatistics/index.vue'),
      meta: {
        title: '数据统计',
      },
    },
    {
      path: '/ai-accounts',
      name: 'AI Accounts',
      component: () => import('../views/AIAccounts/index.vue'),
      meta: {
        title: 'AI Accounts',
      },
    },
    {
      path: '/ai-config',
      name: 'AI Config',
      component: () => import('../views/AIConfig/index.vue'),
      meta: {
        title: 'AI Config',
      },
    },
    {
      path: '/auto-reply',
      name: 'Auto Reply',
      component: () => import('../views/AutoReply/index.vue'),
      meta: {
        title: 'Auto Reply',
      },
    },
    {
      path: '/prompt-templates',
      name: 'Prompt Templates',
      component: () => import('../views/PromptTemplates/index.vue'),
      meta: {
        title: 'Prompt Templates',
      },
    },
    {
      path: '/keyword-rules',
      name: 'Keyword Rules',
      component: () => import('../views/KeywordRules/index.vue'),
      meta: {
        title: 'Keyword Rules',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },

    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    // {
    //   path: '/signup',
    //   name: 'Signup',
    //   component: () => import('../views/Auth/Signup.vue'),
    //   meta: {
    //     title: 'Signup',
    //   },
    // },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | AiDS`
  document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`
  const token = localStorage.getItem('token')
  const profile = JSON.parse(localStorage.getItem('profile') || '{}')
  if (!token && to.path !== '/signin') {
    next('/signin')
  } else if (token && to.path === '/signin') {
    next('/')
  } else if (token && to.path === '/ai-config') {
    if (!profile || !profile.is_superuser || !profile.is_staff) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})
