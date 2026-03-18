import browser_cookie3
import requests
import re
import json

url = "https://www.douyin.com/video/7611832064693816576"
try:
    cookies = browser_cookie3.chrome(domain_name='douyin.com')
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.douyin.com/',
    }
    response = requests.get(url, cookies=cookies, headers=headers)
    
    match = re.search(r'id="RENDER_DATA" type="application/json">(.*?)</script>', response.text)
    if match:
        raw_json = requests.utils.unquote(match.group(1))
        # Find where the actual video data starts
        # Search for the video ID "7611832064693816576"
        video_id = "7611832064693816576"
        
        # Write the whole JSON to a file for better inspection
        with open('douyin_data.json', 'w', encoding='utf-8') as f:
            f.write(raw_json)
        
        print("JSON data written to douyin_data.json. Parsing...")
        
        data = json.loads(raw_json)
        
        def search_key(obj, target_key):
            if isinstance(obj, dict):
                for k, v in obj.items():
                    if k == target_key:
                        return v
                    res = search_key(v, target_key)
                    if res: return res
            elif isinstance(obj, list):
                for item in obj:
                    res = search_key(item, target_key)
                    if res: return res
            return None

        # Look for the video description/summary
        # Try finding 'awemeInfo' or 'aweme_detail'
        aweme = None
        for k in data.keys():
            if 'aweme' in k.lower():
                aweme = data[k]
                break
        
        if not aweme:
            # Look inside 'app' -> 'videoDetail' etc.
            aweme = search_key(data, 'aweme') or search_key(data, 'awemeDetail')
            
        if aweme:
            desc = aweme.get('desc')
            print(f"TITLE: {desc}")
            # Try to get statistics
            stats = aweme.get('statistics', {})
            print(f"STATS: {stats}")
        else:
            print("Could not find aweme object in JSON.")
            # Print first 10 keys of the root to see structure
            print(f"Root keys: {list(data.keys())}")
            if 'app' in data:
                print(f"App keys: {list(data['app'].keys())}")
    else:
        print("Could not find RENDER_DATA.")
except Exception as e:
    print(f"Error: {e}")
