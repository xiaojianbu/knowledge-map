# git merge 和 git rebase 的区别

merge 常用操作

```sh
git checkout feature
git merge master
```

会有一个 'merge commit'

rebase 常用操作

```sh
git checkout feature
git rebase master
```

1. feature 从 master tip 处开始合并 master 上的 commits
2. 重写 project 的 history
3. rebase 后，project 的 history 更加干净了。没了多余的'merge commit'，并且成了一条线。
4. rebase 会丢失掉 merge commit，导致看不到之后合并到 feature 的 commit。

merge 是对目前分叉的两条分支的合并

rebase 是对当前分支记录基于任何 commit 节点(不限于当前分支上的节点)的变更.
