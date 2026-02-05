export async function mosaicMetaDataUpload(env, user_id, content) {


}

export async function waypointsRetrieval(env, user_id) {
    // get from database and then

    const waypoint_obj = {
        "missionId": "uuid-1234-5678",
        "createdAt": "2026-02-05T16:45:00Z", 
        "totalWaypoints": 3,
        "waypoints": [
            {
                "order": 1,
                "lat": 72.992,
                "lng": 42.655
            },
            {
                "order": 2,
                "lat": 72.981,
                "lng": 42.632
            },
            {
                "order": 3,
                "lat": 72.981,
                "lng": 42.632
            }
        ]
    };

    return waypoint_obj;

}