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
        // getting metadata file
        const metadata_path = `data/${user_id}/fp/.metadata`;
        const meta_obj = await env.BUCKET.get(metadata_path);
        const now = new Date().toISOString();

        let metadata = {};

        if (!meta_obj) // creating the metadata file for the first time
        {
            metadata = {
                "createdAt": now,
                "lastUpdatedAt": now,
                "currentFlightPlan": null,
                "totalFlightPlans": 0,
                "flightPlanPaths": []
            }
        } else {
            metadata = await meta_obj.json();
        }

        // adjust metadata for new flight plan
        metadata["lastUpdatedAt"] = now;
        metadata["currentFlightPlan"] = metadata["totalFlightPlans"]++;
        const fp_path = `data/${user_id}/fp/fp${metadata["totalFlightPlans"]}.json`;
        metadata["flightPlanPaths"].push(fp_path);

        // write flight plan to storage
        const fp_object = await env.BUCKET.put(fp_path, JSON.stringify(content), {
            httpMetadata: { contentType: "application/json"}
        });
    
        console.log(`Successfully uploaded ${fp_object.key} to R2`);

        // save metadata
        const meta_obj2 = await env.BUCKET.put(metadata_path, JSON.stringify(metadata), {
            httpMetadata: { contentType: "application/json"}
        });

        console.log(`Successfully updated metadata ${meta_obj2.key}`)

        return fp_object;
    },

    async flightPlanRetrieval(env, user_id) {
        // getting metadata file
        const metadata_path = `data/${user_id}/fp/.metadata`;
        const meta_obj = await env.BUCKET.get(metadata_path);
        
        if (!meta_obj) // we don't have any flight plans
        {
            console.error("No Flight Plans to Retrieve");
            return null;
        }

        const metadata = await meta_obj.json();

        // get active flight plan
        const fp_path = metadata["flightPlanPaths"][metadata["currentFlightPlan"]];
    
        const data = await env.BUCKET.get(fp_path);

        return await data.json();
    },

    async allFlightPlanRetrieval(env, user_id) {
        // getting metadata file
        const metadata_path = `data/${user_id}/fp/.metadata`;
        const meta_obj = await env.BUCKET.get(metadata_path);
        
        if (!meta_obj) // we don't have any flight plans
        {
            console.error("No Flight Plans to Retrieve");
            return null;
        }

        metadata = await meta_obj.json();

        // get all of the flight plans
        promises = metadata["flightPlanPaths"].map(fp_path => env.BUCKET.get(fp_path));
        const responses = await Promise.all(promises);
        const flightplans = await Promise.all(responses.map(res => res.json()));

        return flightplans;
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