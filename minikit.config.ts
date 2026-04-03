const ROOT_URL = "https://mythara-zeta.vercel.app";

export const minikitConfig = {
  accountAssociation: {
    header: "eyJmaWQiOjIzNzk2NzMsInR5cGUiOiJhdXRoIiwia2V5IjoiMHhCM0M5OEU5RWY0M2Y3ODJEZWIwOTVjMGM1NTcyRjZCNjQ4QzZENDExIn0",
    payload: "eyJkb21haW4iOiJteXRoYXJhLXpldGEudmVyY2VsLmFwcCJ9",
    signature: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEEyOFZGB86NWiCzCdVBidoWcqslVo7FW12CYqapteFt_ld4xlJinP9oh6_o7HNgXKjvGnz_lFfjXSgjzOJ44hMKGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  },
  miniapp: {
    version: "1",
    name: "Mythara",
    subtitle: "Mystery Game",
    description: "A mystery box game",
    screenshotUrls: ["https://mythara-zeta.vercel.app/image.png"],
    iconUrl: "https://mythara-zeta.vercel.app/image.png",
    splashImageUrl: "https://mythara-zeta.vercel.app/image.png",
    splashBackgroundColor: "#7739ea",
    homeUrl: ROOT_URL,
    webhookUrl: "https://mythara-zeta.vercel.app/api/webhook",
    primaryCategory: "games",
    tags: ["mystery", "miniapp", "adventure"],
    heroImageUrl: "https://mythara-zeta.vercel.app/image.png",
    tagline: "Open Mystery Boxes!",
    ogTitle: "Mythara",
    ogDescription: "A mystery box game",
    ogImageUrl: "https://mythara-zeta.vercel.app/image.png",
    "noindex": true

  },
} as const;
