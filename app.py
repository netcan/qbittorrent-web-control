from flask import Flask, request, render_template
import requests,os
import json

app = Flask(__name__)

# qbittorrent API相关配置
QB_HOST = "http://intel-n100.local:8080"
QB_USERNAME = os.environ.get('QB_USERNAME')
QB_PASSWORD = os.environ.get('QB_PASSWORD')

# 获取qbittorrent API授权
def get_auth_cookie():
    data = {'username': QB_USERNAME, 'password': QB_PASSWORD}
    response = requests.post(QB_HOST + '/api/v2/auth/login', data=data)
    auth_cookie = None
    if response.status_code == 200:
        headers = response.headers
        if 'Set-Cookie' in headers:
            auth_cookie = headers['Set-Cookie'].split('SID=')[1].split(';')[0]
    else:
        print("Failed to get auth token. Response code: ", response.status_code)
        print(response.text)
    return auth_cookie

# 添加下载任务
def add_torrent(url, auth_cookie):
    headers = {
        'Cookie': f"SID={auth_cookie}",
    }
    data = {'urls': url}
    response = requests.post(QB_HOST + '/api/v2/torrents/add', headers=headers, data=data)
    return response.status_code

# 获取下载任务列表
def get_torrent_list(auth_cookie):
    headers = {
        'Cookie': f"SID={auth_cookie}",
    }
    response = requests.get(QB_HOST + '/api/v2/torrents/info', headers=headers)
    json_data = json.loads(response.content.decode('utf-8'))
    return json_data

@app.route('/', methods=['GET', 'POST'])
def index():
    auth_cookie = get_auth_cookie()
    if request.method == 'POST':
        url = request.form['url']
        status_code = add_torrent(url, auth_cookie)
        if status_code == 200:
            message = "Torrent added successfully."
        else:
            message = "Failed to add torrent."
        return render_template('index.html', message=message)
    else:
        torrent_list = get_torrent_list(auth_cookie)
        return render_template('index.html', torrent_list=torrent_list)

if __name__ == '__main__':
    app.run(debug=True)
