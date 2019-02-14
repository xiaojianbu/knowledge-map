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
      { text: 'CSS', link: '/css/' },
      { text: 'JS', link: '/js/' },
      { text: 'Git', link: '/git/' },
      {
        text: '框架',
        items: [
          { text: 'Vue', link: '/library/vue/' },
          { text: 'React', link: '/library/react/' }
        ]
      },
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
      // '/css': ['', 'css'],
      // '/js': ['', 'js']
    },
    sidebarDepth: 2,
    lastUpdated: 'Last Updated',
    serviceWorker: true
  }
}
