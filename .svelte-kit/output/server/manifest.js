export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicons/android-chrome-192x192.png","favicons/android-chrome-512x512.png","favicons/apple-touch-icon.png","favicons/favicon-16x16.png","favicons/favicon-32x32.png","favicons/favicon.ico","favicons/site.webmanifest","fonts/Oxanium-Bold.ttf","fonts/Oxanium-ExtraBold.ttf","fonts/Oxanium-ExtraLight.ttf","fonts/Oxanium-Light.ttf","fonts/Oxanium-Medium.ttf","fonts/Oxanium-Regular.ttf","fonts/Oxanium-SemiBold.ttf","socials/github.png","socials/instagram.png","socials/reddit.png","socials/youtube.png"]),
	mimeTypes: {".png":"image/png",".webmanifest":"application/manifest+json",".ttf":"font/ttf"},
	_: {
		client: {"start":"_app/immutable/entry/start.CT3GTe7t.js","app":"_app/immutable/entry/app.DdHk11sr.js","imports":["_app/immutable/entry/start.CT3GTe7t.js","_app/immutable/chunks/entry.CGdip2YU.js","_app/immutable/chunks/utils.F7Ud3tqr.js","_app/immutable/chunks/index.tACDdagU.js","_app/immutable/entry/app.DdHk11sr.js","_app/immutable/chunks/utils.F7Ud3tqr.js","_app/immutable/chunks/render.D1eHs-lP.js","_app/immutable/chunks/disclose-version.C1SOfMqQ.js","_app/immutable/chunks/props.D0-1OT6q.js","_app/immutable/chunks/index-client.DDb0GLON.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
