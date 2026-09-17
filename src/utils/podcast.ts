/**
 * 播客数据工具：构建时从播客 feed URL 拉取 RSS 并解析，生成节目列表。
 *
 * feed 地址在 src/config.ts 的 podcastConfig.feedUrl 配置，指向播客仓库
 * （aarzh-AaronZhang/podcast，GitHub Pages），永久不变：
 * https://aarzh-aaronzhang.github.io/podcast/elspod.rss
 *
 * enclosure 本来就是绝对 URL，播放器直接使用，不做任何改写。
 * 拉取失败时打 warning 并返回空节目列表，保证构建不中断
 * （比如播客仓库的 GitHub Pages 还没启用时）。
 */

import { XMLParser } from "fast-xml-parser";
import { podcastConfig } from "@/config";

export type PodcastChannel = {
	title: string;
	link: string;
	description: string;
	language: string;
	author: string;
	image: string;
};

export type PodcastEpisode = {
	title: string;
	description: string;
	pubDate: string;
	audioUrl: string;
	duration: string;
	guid: string;
};

export type PodcastFeed = {
	channel: PodcastChannel;
	episodes: PodcastEpisode[];
};

function emptyFeed(): PodcastFeed {
	return {
		channel: {
			title: "",
			link: "",
			description: "",
			language: "zh-cn",
			author: "",
			image: "",
		},
		episodes: [],
	};
}

let cache: PodcastFeed | null = null;

export async function getPodcastFeed(): Promise<PodcastFeed> {
	if (cache) return cache;

	try {
		const res = await fetch(podcastConfig.feedUrl);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const xml = await res.text();
		const parser = new XMLParser({
			ignoreAttributes: false,
			attributeNamePrefix: "",
		});
		const doc = parser.parse(xml);
		const channel = doc.rss.channel;

		const rawItems = Array.isArray(channel.item)
			? channel.item
			: channel.item
				? [channel.item]
				: [];

		cache = {
			channel: {
				title: channel.title ?? "",
				link: channel.link ?? "",
				description: channel.description ?? "",
				language: channel.language ?? "zh-cn",
				author: channel["itunes:author"] ?? "",
				image: channel["itunes:image"]?.href ?? "",
			},
			episodes: rawItems.map((item: Record<string, unknown>) => {
				const enclosure = (item.enclosure ?? {}) as Record<string, string>;
				const guid = item.guid;
				return {
					title: String(item.title ?? ""),
					description: String(item.description ?? ""),
					pubDate: String(item.pubDate ?? ""),
					audioUrl: String(enclosure.url ?? ""),
					duration: String(item["itunes:duration"] ?? ""),
					guid:
						typeof guid === "object"
							? String((guid as Record<string, string>)["#text"] ?? "")
							: String(guid ?? ""),
				};
			}),
		};
	} catch (err) {
		console.warn(
			`[podcast] 拉取播客 feed 失败（${podcastConfig.feedUrl}）：${err instanceof Error ? err.message : err}，节目列表将为空，构建继续。`,
		);
		cache = emptyFeed();
	}
	return cache;
}
