export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicons/android-chrome-192x192.png","favicons/android-chrome-512x512.png","favicons/apple-touch-icon.png","favicons/favicon-16x16.png","favicons/favicon-32x32.png","favicons/favicon.ico","favicons/site.webmanifest","fonts/Oxanium-Bold.ttf","fonts/Oxanium-ExtraBold.ttf","fonts/Oxanium-ExtraLight.ttf","fonts/Oxanium-Light.ttf","fonts/Oxanium-Medium.ttf","fonts/Oxanium-Regular.ttf","fonts/Oxanium-SemiBold.ttf","socials/github.png","socials/instagram.png","socials/paypal.png","socials/reddit.png","socials/youtube.png"]),
	mimeTypes: {".png":"image/png",".webmanifest":"application/manifest+json",".ttf":"font/ttf"},
	_: {
		client: {"start":"_app/immutable/entry/start.D5CfL9yS.js","app":"_app/immutable/entry/app.CyLqDjB1.js","imports":["_app/immutable/entry/start.D5CfL9yS.js","_app/immutable/chunks/entry.DMGu1VUl.js","_app/immutable/chunks/utils.D4X0fo_M.js","_app/immutable/chunks/index.4UdGpfs7.js","_app/immutable/entry/app.CyLqDjB1.js","_app/immutable/chunks/utils.D4X0fo_M.js","_app/immutable/chunks/render.-poWLBMC.js","_app/immutable/chunks/misc.B9QI8j-U.js","_app/immutable/chunks/disclose-version.pfXmSEhd.js","_app/immutable/chunks/props.CRBH536E.js","_app/immutable/chunks/index-client.NmN1UXmv.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/play",
				pattern: /^\/play\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/style",
				pattern: /^\/style\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
