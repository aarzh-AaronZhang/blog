import type {
	ExpressiveCodeConfig,
	GiscusConfig,
	LicenseConfig,
	NavBarConfig,
	PodcastConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	// ⚠️ 站点标题：在这里修改（与播客 feed 的频道名保持一致）
	title: "我的私人播客",
	subtitle: "技术、生活与思考的音频记录",
	lang: "zh_CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: false,
		src: "assets/images/demo-banner.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		// {
		//   src: '/favicon/icon.png',    // Path of the favicon, relative to the /public directory
		//   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		//   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		// }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		{ name: "节目", url: "/episodes/" }, // 播客节目列表（构建时从播客 feed 拉取生成）
		LinkPreset.Archive,
		LinkPreset.About,
		// 部署后可在这里加自己的外部链接，例如：
		// {
		//   name: "GitHub",
		//   url: "https://github.com/yourname", // TODO: 换成你的 GitHub 主页
		//   external: true,
		// },
	],
};

export const profileConfig: ProfileConfig = {
	// ⚠️ 作者信息：在这里修改（用户：Aaron）
	avatar: "assets/images/demo-avatar.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "Aaron Zhang",
	bio: "技术管理者 / 工程师，记录折腾与思考。",
	links: [
		// TODO: 换成你自己的社交链接（icon 代码见 https://icones.js.org/）
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};

/**
 * 评论系统（Giscus）配置
 * ------------------------------------------------------------------
 * Giscus 需要的 repo / repoId / category / categoryId 参数，
 * 在 https://giscus.app 上按页面指引获取（详见 DEPLOY.md）。
 *
 * 拿到参数后，把下面空字符串填上，并把 enable 设为 true，
 * 文章页底部就会自动渲染评论框。
 */
export const giscusConfig: GiscusConfig = {
	enable: false, // 参数填好后改为 true
	repo: "", // 例如 "yourname/blog"，必须是 Public 仓库
	repoId: "", // 在 https://giscus.app 获取
	category: "", // 例如 "Announcements"
	categoryId: "", // 在 https://giscus.app 获取
	mapping: "pathname",
	theme: "preferred_color_scheme",
	lang: "zh-CN",
};

/**
 * 播客配置
 * ------------------------------------------------------------------
 * feedUrl 是播客仓库（aarzh-AaronZhang/podcast，GitHub Pages）的 feed 地址，
 * 永久不变，节目页构建时从这里拉取 RSS 解析：
 * https://aarzh-aaronzhang.github.io/podcast/elspod.rss
 *
 * 在 Apple Podcasts / Spotify 搜到自己的节目后，把节目页分享链接填进来，
 * 首页播客展示区就会显示对应订阅按钮。留空则不显示。
 */
export const podcastConfig: PodcastConfig = {
	feedUrl: "https://aarzh-aaronzhang.github.io/podcast/elspod.rss",
	coverUrl: "", // 留空则用 feed 里 itunes:image 的封面图
	applePodcastsUrl: "", // 例如 "https://podcasts.apple.com/us/podcast/xxxx/id123456789"
	spotifyUrl: "", // 例如 "https://open.spotify.com/show/xxxx"
};
