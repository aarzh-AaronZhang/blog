# DEPLOY.md —— 播客 + 博客部署手册

两个仓库，分开管理：

- **播客** `aarzh-AaronZhang/podcast`（GitHub Pages）：`elspod.rss` + MP3 + `cover.jpg` + `scripts/update_rss.py`。feed 地址**永久不变**：`https://aarzh-aaronzhang.github.io/podcast/elspod.rss`
- **博客** `aarzh-AaronZhang/blog`（新建，Cloudflare Pages）：本工程的全部内容。节目页构建时从上面的 feed 地址拉取 RSS 解析。

> ⚠️ 本文档所有步骤都由你**在自己的电脑上**操作。文档里提到的所有文件
> （脚手架 zip 包、`update_rss.py`）都从聊天里下载，不要在你电脑上找
> `~/workspace`——那是 agent 的机器，你访问不到。
> 也不要让 agent 代你 push（它没有你的 GitHub 授权）。

**两种用法，先看你走哪条**：

- **A. 只维护播客**：只看第一节，博客相关的都不用管。
- **B. 部署博客**：先完成第一节（确保播客 feed 能访问），再按第二到第八节操作。

---

## 一、播客仓库（`aarzh-AaronZhang/podcast`）——维持现状

仓库里已有：`elspod.rss`、`tabata.mp3`、`cover.jpg`。新节目流程：

```bash
# 1. 把新 MP3 放进仓库（根目录或 audio/ 子目录，建议用 audio/）
# 2. 把 update_rss.py 放进仓库的 scripts/ 目录（脚本文件从聊天里下载）
# 3. 在仓库根目录运行（只需 Python 3，无需安装依赖）
python scripts/update_rss.py --dry-run   # 先预览
python scripts/update_rss.py             # 确认无误后正式执行

# 4. 打开 elspod.rss，把新节目自动生成的简介占位文字改成真正的文案
# 5. 提交推送
git add -A
git commit -m "新增节目：xxx"
git push
```

几点说明：

- feed 地址永久是 `https://aarzh-aaronzhang.github.io/podcast/elspod.rss`，**不再变动**，各播客平台不用做任何迁移。
- 确认 GitHub Pages 已启用：仓库 Settings → Pages → Source 选 "Deploy from a branch"、分支选 main、目录选 /(root)。push 后 1–2 分钟，在浏览器打开上面的 feed 地址能看到新节目即成功。
- 脚本会自动修正 `enclosure length` 与文件真实大小不符的问题，重复运行不会产生重复条目。

---

## 二、博客：新建 GitHub 仓库并推送

```bash
# 1. 在 GitHub 网页上新建仓库 aarzh-AaronZhang/blog（Public；
# README / .gitignore / license 都不用勾选，保持空仓库）

# 2. 从聊天里下载 blog-scaffold.zip，解压到本地
# 3. 进到解压后的 blog/ 目录，初始化并推送
cd blog
git init
git add -A
git commit -m "博客脚手架：Astro + Fuwari，播客官网"
git branch -M main
git remote add origin https://github.com/aarzh-AaronZhang/blog.git
git push -u origin main
```

**push 前检查清单**

- [] 没有把 `node_modules/`、`dist/`、`.astro/` 传上去（zip 里已排除）
- [] 没有提交任何密钥 / token（本工程不含任何密钥，Giscus 参数是空占位）
- [] 这是**新仓库**，不要推到 `podcast` 仓库里去

**push 后检查**：打开仓库的 Actions 页，确认 `Code quality`（biome）和构建工作流都是绿色 ✅。如果 quality 报红，先在本地跑 `pnpm lint` 修好再 push（脚手架自带的 biome.json 已配好，`pnpm lint` 会自动修复格式问题）。

**救急：如果不小心把脚手架推到了 `podcast` 播客仓库**

```bash
cd podcast
# 1. 找到推脚手架之前的那次提交
git log --oneline -5
# 2. 回到那次提交（把 <commit> 换成那次提交的哈希）
git reset --hard <commit>
# 3. 强制推回去（个人仓库、无协作者时可用；有协作者千万别这么干）
git push --force-with-lease origin main
```

推完后确认：仓库根目录只有 `elspod.rss`、`cover.jpg`、MP3 和 `scripts/`，feed 地址 `https://aarzh-aaronzhang.github.io/podcast/elspod.rss` 能正常访问。然后按本节把脚手架推到新建的 `blog` 仓库。

---

## 三、Cloudflare Pages 部署博客

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages → Create → Pages → Connect to Git
2. 选择 `aarzh-AaronZhang/blog` 仓库
3. Build settings：
- **Framework preset**: `Astro`
- **Build command**: `pnpm run build`
（Cloudflare 检测到 `pnpm-lock.yaml` 会自动用 pnpm；如用 npm 则填 `npm run build`）
- **Build output directory**: `dist`
- **Root directory**: `/`（仓库根目录，不用改）
4. Environment variables → 添加 `NODE_VERSION = 20`
5. 点 Save and Deploy。首次构建约 2–4 分钟，成功后会得到 `https://<项目名>.pages.dev` 域名
6. **拿到正式域名后**，改 `astro.config.mjs` 里的 `site` 为真实域名
（博客自带的 RSS / sitemap 用它生成绝对链接），commit 后 push，会自动重新部署

构建说明：节目页在构建时从播客 feed 地址拉取 RSS（见 `src/utils/podcast.ts`），
所以构建需要能联网；拉取失败不会中断构建，只是节目列表为空并打一条 warning。

日常更新：改文章（`src/content/posts/`）、改配置后，`git push` 即自动重新部署，
无需手动操作。新节目只需要在播客仓库更新，博客下次构建时自动同步。

---

## 四、博客绑定自定义域名（可选）

1. Cloudflare Pages 项目 → Custom domains → Set up a custom domain
2. 输入你的域名（例如 `blog.example.com`），按提示在域名 DNS 处添加 CNAME
（DNS 本来就在 Cloudflare 的话，一键完成）
3. 等证书签发（几分钟），`https://` 生效后，把 `astro.config.mjs` 的 `site`
改成 `https://blog.example.com/` 并 push

---

## 五、Giscus 评论配置（文章页底部评论框）

现在 `src/config.ts` 里的 `giscusConfig` 全是空占位符，评论框不会渲染。
填好参数后才会显示。

1. 打开 https://giscus.app
2. **Repository** 填 `aarzh-AaronZhang/blog`（注意是 blog 仓库，必须是 Public）
3. 按页面指引完成两件事：
- 给仓库安装 [giscus app](https://github.com/apps/giscus)
- 在仓库 Settings → General → Features 里勾选 **Discussions**
4. 页面下方会自动生成带参数的代码，从中抄出四个值：
`data-repo`、`data-repo-id`、`data-category`、`data-category-id`
5. 回到 `src/config.ts`，填进 `giscusConfig`，并把 `enable` 改为 `true`，push 即生效

> 这些只是公开的仓库标识，不是密钥，但也只填在 `src/config.ts` 这一个地方即可。

---

## 六、博客文章音频嵌入说明

- MP3 放进博客仓库的 `public/audio/`，文章里用 `/audio/文件名` 引用，示例见
`src/content/posts/audio-demo.md`
- 播放器写法：`<audio controls controlsList="nodownload" src="/audio/xxx.mp3"></audio>`
- `controlsList="nodownload"` 只是隐藏 Chrome 播放器上的下载按钮，
**防君子不防小人**——访客打开 F12 网络面板依然能拿到文件。
真正在意的是"被别的网站盗用流量"，见下一节。

---

## 七、防盗链

场景：别人网站直接 `<audio src="https://你的域名/xxx.mp3">`，流量算你的。

**博客（Cloudflare Pages，推荐配）**：
域名 → Security → WAF → Custom rules → Create rule：

- Rule name：`block-media-hotlink`
- When incoming requests match…（用 Expression Builder）：
- `URI Path` **contains** `.mp3`（如需保护图片再加 `or URI Path contains .jpg` 等）
- **AND** `Referer` **does not contain** `你的博客域名`
- **AND** `Referer` **is not empty**（放行直接访问/空 Referer，避免误伤）
- Then take action：**Block**

**播客（GitHub Pages，`aarzh-aaronzhang.github.io`）**：
这个域名是 GitHub 的，加不了 Cloudflare 规则。如果哪天发现被严重盗链，
两个选择：给播客仓库绑一个自己的域名走 Cloudflare（然后按上面的方法配规则），
或者接受——个人播客通常到不了被薅流量的量级。

> 能防住什么：别的网站盗链你的 mp3/jpg，请求会被直接拒绝，流量不再算你的。
> 防不住什么：**访客本人**在你网站上播放或下载——这是 HTTP 的本质，
> 浏览器能播就能存，任何防盗链都防不住访客自己。这是预期行为，不是漏洞。

---

## 八、待你提供的东西

- [] 新建 `aarzh-AaronZhang/blog` 仓库并 push（见第二节）
- [] Cloudflare Pages 部署（见第三节）；正式域名决定后改 `astro.config.mjs` 的 `site`
- [] 播客仓库的 GitHub Pages 已启用（见第一节），否则博客节目页拉不到数据
- [] Giscus 四个参数，Repository 填 `aarzh-AaronZhang/blog`（见第五节）
- [] Apple Podcasts / Spotify 节目页链接（填 `src/config.ts` 的 `podcastConfig`，
首页才会显示订阅按钮；没发布就先留空）
- [] 站点头像：现在用的是 Fuwari 演示头像，
换成你自己的图后改 `src/config.ts` → `profileConfig.avatar`
