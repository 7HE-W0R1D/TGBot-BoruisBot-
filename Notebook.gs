/////Weather response "/weathernow Beijing"
/*
{
    "HeWeather6": [
        {
            "basic": {
                "cid": "CN101010100", 
                "location": "北京", 
                "parent_city": "北京", 
                "admin_area": "北京", 
                "cnty": "中国", 
                "lat": "39.90498734", 
                "lon": "116.4052887", 
                "tz": "+8.00"
            }, 
            "update": {
                "loc": "2020-02-10 13:03", 
                "utc": "2020-02-10 05:03"
            }, 
            "status": "ok", 
            "now": {
                "cloud": "0", 
                "cond_code": "100", 
                "cond_txt": "晴", 
                "fl": "6", 
                "hum": "37", 
                "pcpn": "0.0", 
                "pres": "1015", 
                "tmp": "9", 
                "vis": "10", 
                "wind_deg": "186", 
                "wind_dir": "南风", 
                "wind_sc": "2", 
                "wind_spd": "10"
            }
        }
    ]
}

/////Webhook response "test"
{
    "parameter": { }, 
    "contextPath": "", 
    "contentLength": 322, 
    "queryString": "", 
    "parameters": { }, 
    "postData": {
        "type": "application/json", 
        "length": 322, 
        "contents": {
            "update_id": 385079481, 
            "message": {
                "message_id": 59, 
                "from": {
                    "id": 651615754, 
                    "is_bot": false, 
                    "first_name": "Ichigo", 
                    "last_name": "Kujo", 
                    "username": "KujoXJotaro", 
                    "language_code": "zh-hans"
                }, 
                "chat": {
                    "id": 651615754, 
                    "first_name": "Ichigo", 
                    "last_name": "Kujo", 
                    "username": "KujoXJotaro", 
                    "type": "private"
                }, 
                "date": 1581222100, 
                "text": "test"
            }
        }, 
        "name": "postData"
    }
}

/////Webhook response command "/love"
{
    "parameter": { }, 
    "contextPath": "", 
    "contentLength": 376, 
    "queryString": "", 
    "parameters": { }, 
    "postData": {
        "type": "application/json", 
        "length": 376, 
        "contents": {
            "update_id": 385079497, 
            "message": {
                "message_id": 77, 
                "from": {
                    "id": 651615754, 
                    "is_bot": false, 
                    "first_name": "Ichigo", 
                    "last_name": "Kujo", 
                    "username": "KujoXJotaro", 
                    "language_code": "en"
                }, 
                "chat": {
                    "id": 651615754, 
                    "first_name": "Ichigo", 
                    "last_name": "Kujo", 
                    "username": "KujoXJotaro", 
                    "type": "private"
                }, 
                "date": 1581238329, 
                "text": "/love", 
                "entities": [
                    {
                        "offset": 0, 
                        "length": 5, 
                        "type": "bot_command"
                    }
                ]
            }
        }, 
        "name": "postData"
    }
}


*/


///Response of doGetme
/*
{
    "ok": true, 
    "result": {
        "id": 953394954, 
        "is_bot": true, 
        "first_name": "草莓酱", 
        "username": "BoruisBot", 
        "can_join_groups": true, 
        "can_read_all_group_messages": false, 
        "supports_inline_queries": false
    }
}
*/