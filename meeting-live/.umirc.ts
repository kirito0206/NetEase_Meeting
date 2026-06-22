import { defineConfig } from "umi";

const RUN_ENV = process.env.RUN_ENV;

let publicPath = '/';
let base = '/appLive/v2/';
if (RUN_ENV === 'dev') {
  publicPath = 'https://yiyong-qa.netease.im/appLive/'
  base = '/appLive/v2/'
} else if (RUN_ENV === 'prod') {
  publicPath = 'https://yiyong-static.nosdn.127.net/meeting-front-live-v2-prod/'
  base = '/live/'
}

export default defineConfig({
  hash: true,
  base,
  publicPath,
  favicons: [
    '/favicon.ico'
  ],
  scripts: [
    'https://nos.netease.com/vod163/nep.min.js'
  ],
  links: [
    { href: 'https://nos.netease.com/vod163/nep.min.css', rel: 'stylesheet' },
  ],
  routes: [
    { path: '/:meetingCode', component: "@/pages/index/$meetingCode.tsx" },
    { path: '/login/phone', component: "@/pages/login/phone/index.tsx" },
    { path: '/login/sso', component: "@/pages/login/sso/index.tsx" },
  ],
  npmClient: 'pnpm',
  define: {
    'process.env.RUN_ENV': RUN_ENV,
  }
});
