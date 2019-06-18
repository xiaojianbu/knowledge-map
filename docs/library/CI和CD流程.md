# CI 和 CD

自动部署

这边用的是 gitLab 做 git 服务器，可以配置 commit 的钩子函数，实现自动部署和线上发布，就相当服务器监听你的提交，在你 commit 之后，服务器自动执行了一下 npm run build，放到对应的测试服务器目录，配置文件在根目录下有.gitlab-ci.yml 文件，起作用的是下边一段代码，script 是 linux 脚本，拷贝文件到指定的静态资源 CDN 目录和 web 服务器目录

```js
npm-build-test:
  image: cdn路径
  stage: build
  cache:
    untracked: true
    paths:
      - node_modules/
  before_script:
    - export BI_ENV="test"
  script:
    - "npm install --registry=http://代理地址 --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/"
    - "npm run build"
    - "rsync -auvz dist/index.html  ip::服务器开发分支目录/trunk/resources/views/index/"
    - "rsync -auvz dist/* 静态资源cdn目录/trunk/bi/"
  only:
    - master  分支名称
```

## 参考

[什么是持续集成（CI）/持续部署（CD）？](https://zhuanlan.zhihu.com/p/42286143)

[两大阐释、四大流程，拿下 CI/CD！](https://segmentfault.com/a/1190000012696373)

[什么是 CI/CD?](https://jenkins-zh.cn/wechat/articles/2019/04/2019-04-12-what-is-cicd/)
