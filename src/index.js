export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Basic Security Check
        if (request.headers.get("Authorization") !== `Bearer ${env.DEVICE_TOKEN}`) {
            return new Response("Unauthorized", { status: 401 });
        }

        // 1. WAYPOINTS (Web App POSTs them, Pi GETs them)
        if (url.pathname === "/waypoints") {
            if (request.method === "POST") {
                const data = await request.json();
                await env.DRONE_DATA.put("mission_waypoints", JSON.stringify(data));
                return new Response("Waypoints Saved");
            }
            const waypoints = await env.DRONE_DATA.get("mission_waypoints");
            return new Response(waypoints || "[]");
        }

        // 2. TELEMETRY (Pi POSTs status, Web App GETs status)
        if (url.pathname === "/telemetry") {
            if (request.method === "POST") {
                const stats = await request.json();
                await env.DRONE_DATA.put("latest_status", JSON.stringify(stats));
                return new Response("Status Updated");
            }
            const status = await env.DRONE_DATA.get("latest_status");
            return new Response(status || "{}");
        }

        return new Response("Not Found", { status: 404 });
    }
};