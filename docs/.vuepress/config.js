module.exports = {
  title: 'knowledge-map',
  description: 'xiaojianbu的知识梳理',
  head: [['link', { rel: 'icon', href: `/favicon.ico` }]],
  base: '/knowledge-map/',
  markdown: {
    lineNumbers: true // 代码块显示行号
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'HTML', link: '/html/' },
      { text: 'CSS', items: [{ text: '布局', link: '/css/layout/' }] },
      { text: 'JS', link: '/js/' },
      { text: 'Git', link: '/git/' },
      {
        text: '框架',
        items: [
          { text: 'Vue', link: '/library/Vue/' },
          { text: 'React', link: '/library/React/' }
        ]
      },
      { text: 'HTTP', link: '/HTTP/' },
      { text: '关于', link: '/about/' },
      { text: 'Github', link: 'https://github.com/xiaojianbu/knowledge-map' }
    ],
    sidebar: {
      '/html': [
        {
          title: '前端',
          collapsable: true,
          children: ['/html/测试']
        }
      ],
      '/css': [
        {
          title: '布局',
          collapsable: true,
          children: [
            '/css/layout/CSS元素居中',
            '/css/layout/三栏布局',
            '/css/layout/盒子模型',
          ]
        }
      ],
      '/js': [
        {
          title: 'JS',
          collapsable: true,
          children: [
            '/js/模块化',
            '/js/JS构造函数与Class',
            '/js/继承与原型链',
            '/js/异步',
            '/js/Promise',
            '/js/任务队列',
            '/js/DOM事件',
            '/js/JS类数组转换为数组',
          ]
        }
      ],
      '/library/React': [
        {
          title: 'React',
          collapsable: true,
          children: [
            '/library/React/虚拟DOM',
            '/library/React/JXS',
            '/library/React/setState',
          ]
        }
      ],
      '/library/Vue': [
        {
          title: 'Vue',
          collapsable: true,
          children: [
            '/library/Vue/Vue的响应式',
            '/library/Vue/React和Vue对比',
          ]
        }
      ],
      '/HTTP': [
        {
          title: 'HTTP',
          collapsable: true,
          children: [
            '/HTTP/http协议',
          ]
        }
      ],
    },
    sidebarDepth: 2,
    lastUpdated: 'Last Updated',
    serviceWorker: true
  }
}
