import json

with open('douyin_data.json', 'r', encoding='utf-8') as f:
    data = json.loads(f.read())

print(json.dumps(data.get('app', {}).get('videoDetail'), indent=2, ensure_ascii=False)[:2000])
