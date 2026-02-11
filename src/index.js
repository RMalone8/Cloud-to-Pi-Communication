import storage from "./storage";

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        const corsHeaders = {
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders
            });
        }

        // Basic Security Check
        if (request.headers.get("Authorization") !== `Bearer ${env.DEVICE_TOKEN}`) {;
            console.log(request.headers.get("Authorization"));
            return new Response("Unauthorized", { status: 401, headers: corsHeaders });
        }

        // FLIGHT PLAN (Web App POSTs them, Pi GETs them)
        if (url.pathname === "/flightplan") {
            if (request.method === "POST") {
                const flightplan = await request.json();
                
                console.log(flightplan);
                await storage.flightPlanUpload(env, "1001", flightplan);
                return new Response("Flight Plan Saved", {headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json"
                }});
            }
            const flightplan = await storage.flightPlanRetrieval(env, "1001");
            return Response.json(flightplan || "[]", {headers: corsHeaders });
        }

        // TELEMETRY (Pi POSTs status, Web App GETs status)
        if (url.pathname === "/telemetry") {
            if (request.method === "POST") {
                const telemetry = await request.json();
                return new Response("Status Updated", {headers: corsHeaders });
            }
            return new Response(telemetry || "{}", {headers: corsHeaders });
        }

        // MOSAICS (Pi POSTs data, Web App GETs data)
        if (url.pathname === "/mosaic") {
            if (request.method === "POST") {
                const data = await request.json();
                try {
                    await storage.mosaicUpload(env, "1001", JSON.stringify(data));
                    console.log("Complete!");
                } catch (e) {
                    console.error("Mosaic Error: ", e.message);
                }
                
                return new Response("Status Updated", {headers: corsHeaders });
            }
            const data = await storage.mosaicRetrieval(env, "1001");
            const text = await data.text();
            return new Response(text || "{}", {headers: corsHeaders });
        }


        return new Response("Not Found", { status: 404, headers: corsHeaders });
    }
};