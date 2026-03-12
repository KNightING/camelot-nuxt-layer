# use this theme

## Basic

in `package.json`

```json
  "devDependencies": {
    "@nuxt/eslint": "^0.7.5",
    "@nuxtjs/i18n": "9.1.1",
    "@nuxtjs/tailwindcss": "^6.13.1",
    "@vueuse/core": "^12.4.0",
    "@vueuse/nuxt": "^12.4.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.18.0",
    "nuxt": "3.15.1",
    "postcss": "^8.5.0",
    "tailwindcss": "^3.4.17",
    "unplugin-icons": "^22.0.0",
    "unplugin-vue-components": "^28.0.0"
  },
  "dependencies": {
    "@pinia/nuxt": "^0.9.0",
    "pinia-plugin-persistedstate": "^4.2.0",
    "@vueuse/components": "^12.4.0",
    "@vueuse/integrations": "^12.4.0",
    "change-case": "^5.4.4"
  }
```

in `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  ...
  extends: [
      "github:KNightING/camelot-nuxt3-layer", // GitHub Remote Source
  ],
});
```

## TailwindCSS v4

Tailwind v4 不適用於 Safari 15

Tailwind v4 使用 css color-mix 目前 webview on safari 尚未支援

## TailwindCSS v3

> [!WARNING]  
> Tailwind CSS V3 only works with Camelot versions 3.15.1.0 or older.

1. copy `tailwind.config.js` to root folder
2. copy `assets` folder to root folder
3. in `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  ...
  css: [
    "@/assets/css/global.css",
    "@/assets/css/tailwind-base.css",
    "@/assets/css/tailwind-components.css",
    "@/assets/css/tailwind-utilities.css",
  ],});
```

## i18n

1. in `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  ...
  i18n: {
    locales: [
      {
        name: 'English',
        code: 'en-us',
        file: 'en-us.json',
      },
      {
        name: '正體中文',
        code: 'zh-tw',
        file: 'zh-tw.json',
      },
    ],
    lazy: true,
    defaultLocale: 'zh-tw',
    restructureDir: false,
    langDir: 'lang',

    // lang路由 https://v8.i18n.nuxtjs.org/options/routing#strategy
    strategy: 'no_prefix',

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      cookieCrossOrigin: true,
      cookieSecure: true,
      redirectOn: 'root', // recommended
    },
    vueI18n: './i18n.config.ts',
  },
})
```

   2. copy `lang` folder and `i18n.config.ts` to root folder


## Drop Code

Build with drop code

drop `console` and `debugger` or some code.

just add `--drop-code` to command like:

not working on `nuxt dev`

```bash
pnpm generate --drop-code
```

if what to drop some code then write `DEV` label with target function like:

```js
function example() {
  DEV: doAnExpensiveCheck()
  return normalCodePath()
}
```

then will become to

```js
function example() {
  return normalCodePath();
}
```

more in [ESBuild](https://esbuild.github.io/api/#drop-labels)
