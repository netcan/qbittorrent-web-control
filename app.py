import os
import requests
from flask import Flask, render_template

app = Flask(__name__)

QB_BASE_URL = "http://intel-n100.local:8080"
QB_USERNAME = os.environ.get('QB_USERNAME')
QB_PASSWORD = os.environ.get('QB_PASSWORD')


def get_sid():
    login_url = QB_BASE_URL + "/api/v2/auth/login"
    data = {"username": QB_USERNAME, "password": QB_PASSWORD}
    response = requests.post(login_url, data=data)
    cookie = response.cookies.get("SID")
    return {"SID": cookie}


def torrents_info():
    url = QB_BASE_URL + "/api/v2/torrents/info"
    response = requests.get(url, cookies=get_sid())
    torrents = response.json()
    return torrents


def get_torrents(torrents):
    downloading_torrents = []
    completed_torrents = []

    for torrent in torrents:
        if torrent['state'] == 'downloading':
            downloading_torrents.append(torrent)
        elif torrent['state'] == 'pausedUP' and torrent['progress'] == 1:
            completed_torrents.append(torrent)

    return downloading_torrents, completed_torrents

@app.route("/")
def index():
    torrents = torrents_info()
    downloading_files = []
    downloaded_files = []

    for torrent in torrents:
        progress = torrent['progress']
        if progress < 1:
            downloading_files.append(torrent)
        else:
            downloaded_files.append(torrent)

    return render_template('index.html', downloading_files=downloading_files, downloaded_files=downloaded_files)


if __name__ == "__main__":
    app.run(debug=True)
