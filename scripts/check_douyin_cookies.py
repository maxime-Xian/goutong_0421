import browser_cookie3
import requests

try:
    cookies = browser_cookie3.chrome(domain_name='douyin.com')
    print(f"Found {len(cookies)} cookies for douyin.com")
    for cookie in cookies:
        if cookie.name in ['passport_csrf_token', 'sid_guard', 'sid_tt', 'uid_tt', 'sessionid', 'sessionid_ss']:
            print(f"Found important cookie: {cookie.name}")
except Exception as e:
    print(f"Error: {e}")
