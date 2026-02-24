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
        if (url.pathname.startsWith("/flightplan")) {
            // handle sending of flight plans
            if (request.method === "POST") {
                const flightplan = await request.json();
                
                console.log(flightplan);
                await storage.flightPlanUpload(env, "1001", flightplan);
                return new Response("Flight Plan Saved", {headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json"
                }});
            }

            if (url.pathname === "/flightplan/latest") // retrieving the latest flight plan
            {
                const flightplan = await storage.flightPlanRetrieval(env, "1001");
                return Response.json(flightplan || "[]", {headers: corsHeaders });
            }

            if (url.pathname === "/flightplan/all") // retrieving all the flight plans
            {
                const flightplans = await storage.allFlightPlanRetrieval(env, "1001");
                return Response.json(flightplans || "[]", {headers: corsHeaders });
            }
        }

        // TELEMETRY (Pi POSTs status, Web App GETs status)
        if (url.pathname === "/telemetry") {
            if (request.method === "POST") {
                const telemetry = await request.json();
                await storage.telemetryUpload(env, "1001", telemetry);
                return new Response("Status Updated", {headers: corsHeaders });
            }

            const telemetry = await storage.telemetryRetrieval(env, "1001");

            if (!telemetry)
                return new Response(JSON.stringify({ error: "Telemetry not found" }), {
                    status: 404,
                    headers: corsHeaders
                });

            return new Response(JSON.stringify(telemetry) || "{}", {headers: corsHeaders });
        }

        // MOSAICS (Pi POSTs data, Web App GETs data)
        if (url.pathname === "/mosaic") {
            if (request.method === "POST") {
                const data = await request.formData();
                const image_file = data.get("mosaic");
                try {
                    await storage.mosaicUpload(env, "1001", image_file);
                    console.log("Complete!");
                } catch (e) {
                    console.error("Mosaic Error: ", e.message);
                }
                
                return new Response("Image Updated", {headers: corsHeaders });
            }
            const data = await storage.mosaicRetrieval(env, "1001");
            return new Response(data.body, {headers: corsHeaders });
        }


        return new Response("Not Found", { status: 404, headers: corsHeaders });
    }
};