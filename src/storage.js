export default {

    // mosaic functions
    async mosaicRetrieval(env, user_id) {
        const path = `data/${user_id}/mosaic/mosaic1.jpg`;
    
        return await env.BUCKET.get(path);
    },

    async mosaicUpload(env, user_id, content) {
        const path = `data/${user_id}/mosaic/mosaic1.jpg`;
    
        const object = await env.BUCKET.put(path, content, {
            httpMetadata: { contentType: "image/jpeg"}
        });
    
        console.log(`Successfully uploaded ${object.key} to R2`);
        return object;
    },

    //flight plan functions
    async flightPlanUpload(env, user_id, content) {
        const path = `data/${user_id}/fp/fp1.json`;
    
        const object = await env.BUCKET.put(path, JSON.stringify(content), {
            httpMetadata: { contentType: "application/json"}
        });
    
        console.log(`Successfully uploaded ${object.key} to R2`);
        return object;
    },

    async flightPlanRetrieval(env, user_id) {
        const path = `data/${user_id}/fp/fp1.json`;
    
        const data = await env.BUCKET.get(path);

        return await data.json();
    },

    //telemetry functions
    async telemetryUpload(env, user_id, content) {
        const path = `data/${user_id}/telemetry.json`;
    
        const object = await env.BUCKET.put(path, JSON.stringify(content), {
            httpMetadata: { contentType: "application/json"}
        });
    
        console.log(`Successfully uploaded ${object.key} to R2`);
        return object;
    },

    async telemetryRetrieval(env, user_id) {
        const path = `data/${user_id}/telemetry.json`;
        const data = await env.BUCKET.get(path);

        if (!data)
            return null;

        try {
            return await data.json();
        } catch (e) {
            console.error("Parsing Error: ", e);
            return null;
        }
    }

}