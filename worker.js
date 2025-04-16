
const FILES = {
  "xray-wow": "https://raw.githubusercontent.com/michaelrezza/wow/main/Xray-WoW.json",
  "sing-box": "https://raw.githubusercontent.com/michaelrezza/wow/main/sing-box.json",
  "sing-box-hiddify": "https://raw.githubusercontent.com/michaelrezza/wow/main/sing-box-hiddify.json",
  "warp": "https://raw.githubusercontent.com/michaelrezza/wow/main/warp.json",
  "warp2": "https://raw.githubusercontent.com/michaelrezza/wow/main/warp2.json",
  "warpauto": "https://raw.githubusercontent.com/michaelrezza/wow/main/warpauto.json"
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    const type = url.searchParams.get("type");

    if (!token || !type || !FILES[type]) {
      return new Response("Invalid request", { status: 400 });
    }

    try {
      const [id, exp] = atob(token).split(".");
      const now = Math.floor(Date.now() / 1000);

      if (parseInt(exp) < now) {
        return new Response("Token expired", { status: 403 });
      }

      const fileUrl = FILES[type];
      const res = await fetch(fileUrl);
      const data = await res.text();

      return new Response(data, {
        headers: { "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response("Invalid token", { status: 403 });
    }
  }
};
