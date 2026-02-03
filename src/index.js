import { mosaicUpload, mosaicRetrieval } from "./storage";

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Basic Security Check
        if (request.headers.get("Authorization") !== `Bearer ${env.DEVICE_TOKEN}`) {
            console.log(env.DEVICE_TOKEN);
            return new Response("Unauthorized", { status: 401 });
        }

        // 1. WAYPOINTS (Web App POSTs them, Pi GETs them)
        if (url.pathname === "/waypoints") {
            if (request.method === "POST") {
                const waypoints = await request.json();
                return new Response("Waypoints Saved");
            }
            return new Response(waypoints || "[]");
        }

        // 2. TELEMETRY (Pi POSTs status, Web App GETs status)
        if (url.pathname === "/telemetry") {
            if (request.method === "POST") {
                const telemetry = await request.json();
                return new Response("Status Updated");
            }
            return new Response(telemetry || "{}");
        }

        // 3. MOSAICS (Pi POSTs data, Web App GETs data)
        if (url.pathname === "/mosaic") {
            if (request.method === "POST") {
                const data = await request.json();
                try {
                    await mosaicUpload(env, "1001", JSON.stringify(data));
                    console.log("Complete!");
                } catch (e) {
                    console.error("Mosaic Error: ", e.message);
                }
                
                return new Response("Status Updated");
            }
            const data = await mosaicRetrieval(env, "1001");
            const text = await data.text();
            return new Response(text || "{}");
        }


        return new Response("Not Found", { status: 404 });
    }
};