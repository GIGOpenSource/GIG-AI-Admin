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
    // {
    //   path: '/tag',
    //   name: 'tag',
    //   component: () => import('../views/tag/tag.vue'),
    //   meta: {
    //     title: 'Tag',
    //   },
    // },
    // {
    //   path: '/follow',
    //   name: 'Follow',
    //   component: () => import('../views/follow/follow.vue'),
    //   meta: {
    //     title: '关注列表',
    //   },
    // },
    {
      path: '/ai-accounts',
      name: 'AI Accounts',
      component: () => import('../views/AIAccounts/index.vue'),
      meta: {
        title: 'AI账户管理',
      },
    },
    {
      path: '/ai-config',
      name: 'AI Config',
      component: () => import('../views/AIConfig/index.vue'),
      meta: {
        title: 'AI配置',
      },
    },
    {
      path: '/task',
      name: 'Auto Reply',
      component: () => import('../views/AutoReply/new.vue'),
      meta: {
        title: '任务列表',
      },
    },
    {
      path: '/taskLog',
      name: 'task Log',
      component: () => import('../views/taskLog/taskLog.vue'),
      meta: {
        title: '任务日志',
      },
    },
    {
      path: '/prompt-templates',
      name: 'Prompt Templates',
      component: () => import('../views/PromptTemplates/index.vue'),
      meta: {
        title: '提示词模板',
      },
    },
    // {
    //   path: '/keyword-rules',
    //   name: 'Keyword Rules',
    //   component: () => import('../views/KeywordRules/index.vue'),
    //   meta: {
    //     title: '关键词规则',
    //   },
    // },
     {
      path: '/prompts',
      name: 'Prompts',
      component: () => import('../views/prompts/index.vue'),
      meta: {
          title: '账号池',
      },
    },
    // {
    //   path: '/platform-accounts',
    //   name: 'Platform Accounts',
    //   component: () => import('../views/PlatformAccounts/index.vue'),
    //   meta: {
    //     title: '平台账户',
    //   },
    // },
    // {
    //   path: '/platform-accounts/new',
    //   name: 'Platform Accounts New',
    //   component: () => import('../views/PlatformAccounts/Form.vue'),
    //   meta: {
    //     title: '新增平台账户',
    //     parentRoute: '/platform-accounts',
    //   },
    // },
    // {
    //   path: '/platform-accounts/edit',
    //   name: 'Platform Accounts Edit',
    //   component: () => import('../views/PlatformAccounts/Form.vue'),
    //   meta: {
    //     title: '编辑平台账户',
    //     parentRoute: '/platform-accounts',
    //   },
    // },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: '空白页',
      },
    },{
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404错误',
      },
    },

    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: '登录',
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
    {
      path: '/profile',
      name: 'User Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: '个人资料',
      },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Pulse AI`
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
  } else if (token && to.path === '/ai-accounts') {
    if (!profile || !profile.is_superuser || !profile.is_staff) {
      next('/')
    } else {
      next()
    }
  }  else {
    next()
  }
})
