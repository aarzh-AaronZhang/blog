---
title: 在文章中嵌入 MP3 音频
published: 2026-09-16
description: 演示如何把 MP3 音频文件嵌入到博客文章里。
tags: [使用说明, 音频]
category: 使用说明
draft: false
---

这是一篇演示文章，展示如何在文章里嵌入 MP3 音频播放器。

## 方法

1. 把 MP3 文件放进仓库的 `public/audio/` 目录，例如 `public/audio/示例.mp3`
2. 在文章的 Markdown 里直接写 HTML 标签引用：

```html
<audio controls controlsList="nodownload" src="/audio/示例.mp3"></audio>
```

`public/` 下的文件在构建后会被原样拷贝到网站根目录，所以引用路径就是 `/audio/文件名`。

## 效果示例

下面这行代码渲染出的播放器（文件不存在时会显示为不可用，属正常现象）：

<audio controls controlsList="nodownload" src="/audio/示例.mp3"></audio>

> 注：`controlsList="nodownload"` 只是隐藏了 Chrome 播放器上的下载按钮，**防君子不防小人**——访客打开 F12 网络面板依然能直接拿到文件。如果在意被别的网站盗用流量，可以用 Cloudflare 做防盗链（见 DEPLOY.md）。

## 小提示

- 文件名建议用英文或拼音，避免中文/空格在某些环境下出现编码问题，例如 `public/audio/episode-01.mp3` → `/audio/episode-01.mp3`
- 加 `controls` 属性才会显示播放控件；去掉则需要自己写 JS 控制
- 如果想自动播放（多数浏览器会拦截），可以加 `autoplay`，但不推荐
