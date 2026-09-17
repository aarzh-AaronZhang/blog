import type { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants";

export type SiteConfig = {
	title: string;
	subtitle: string;

	lang:
		| "en"
		| "zh_CN"
		| "zh_TW"
		| "ja"
		| "ko"
		| "es"
		| "th"
		| "vi"
		| "tr"
		| "id";

	themeColor: {
		hue: number;
		fixed: boolean;
	};
	banner: {
		enable: boolean;
		src: string;
		position?: "top" | "center" | "bottom";
		credit: {
			enable: boolean;
			text: string;
			url?: string;
		};
	};
	toc: {
		enable: boolean;
		depth: 1 | 2 | 3;
	};

	favicon: Favicon[];
};

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
}

export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
};

export type NavBarConfig = {
	links: (NavBarLink | LinkPreset)[];
};

export type ProfileConfig = {
	avatar?: string;
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
	}[];
};

export type LicenseConfig = {
	enable: boolean;
	name: string;
	url: string;
};

export type LIGHT_DARK_MODE =
	| typeof LIGHT_MODE
	| typeof DARK_MODE
	| typeof AUTO_MODE;

export type BlogPostData = {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
};

export type ExpressiveCodeConfig = {
	theme: string;
};

// 播客配置类型
export type PodcastConfig = {
	/**
	 * 播客 feed 地址（播客仓库 aarzh-AaronZhang/podcast 的 GitHub Pages 地址，
	 * 永久不变）。节目页构建时从这里拉取 RSS 解析。
	 */
	feedUrl: string;
	/** 播客封面图 URL，留空则用 feed 里 itunes:image 的图 */
	coverUrl: string;
	/** Apple Podcasts 节目页链接，空则首页不显示该按钮 */
	applePodcastsUrl: string;
	/** Spotify 节目页链接，空则首页不显示该按钮 */
	spotifyUrl: string;
};

// 评论系统（Giscus）配置类型
export type GiscusConfig = {
	/** repo 填好且 enable 为 true 时，文章页底部才渲染评论框 */ enable: boolean;
	/** GitHub 仓库，例如 "yourname/blog"（Public 仓库） */
	repo: string;
	/** 在 https://giscus.app 获取 */
	repoId: string;
	/** Discussions 分类名，例如 "Announcements" */
	category: string;
	/** 在 https://giscus.app 获取 */
	categoryId: string;
	mapping: "pathname" | "url" | "title" | "og:title";
	theme: string;
	lang: string;
};
