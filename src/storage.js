export default {

    // mosaic functions
    async mosaicRetrieval(env, user_id) {
        const path = `data/${user_id}/mosaic/mosaic1.txt`;
    
        return await env.BUCKET.get(path);
    },

    async mosaicUpload(env, user_id, content) {
        const path = `data/${user_id}/mosaic/mosaic1.txt`;
    
        const object = await env.BUCKET.put(path, content, {
            httpMetadata: { contentType: "application/json"}
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
    }

}