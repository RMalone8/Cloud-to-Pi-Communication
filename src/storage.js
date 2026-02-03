export async function mosaicUpload(env, user_id, content) {
    const path = `data/${user_id}/mosaic/mosaic1.txt`;

    const object = await env.BUCKET.put(path, content, {
        httpMetadata: { contentType: "application/json"}
    });

    console.log(`Successfully uploaded ${object.key} to R2`);
    return object;
}

export async function mosaicRetrieval(env, user_id) {
    const path = `data/${user_id}/mosaic/mosaic1.txt`;

    return await env.BUCKET.get(path);
}