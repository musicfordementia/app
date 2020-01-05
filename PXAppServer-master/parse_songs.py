import csv
import os
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
import json

scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"]

modeID = {
    'Major': 1,
    'Minor': 2
}

genreID = {
    'Country': 1,
    'Popular/Easy Listening/RNB/Soundtrack': 2,
    'Folk Music': 3,
    'Jazz & Swing': 4,
    'Hymns & Religion': 5,
    'Classical': 6
}

lyricID = {
    'Positive': 1,
    'Negative': 2,
    'N/A': 2
}

tagID = {
    'Tempo<=60': 1,
    'Tempo<=80': 2,
    'Tempo>=80': 3,
    'Tempo<=120': 4,
    'Mode=Major': 5
}

def init_yt_api():
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    api_service_name = "youtube"
    api_version = "v3"
    client_secrets_file = "client_secret.json"

    # Get credentials and create an API client
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
        client_secrets_file, scopes)
    credentials = flow.run_console()
    return googleapiclient.discovery.build(
        api_service_name, api_version, credentials=credentials
    )

def main():
    youtube = init_yt_api()
    link_count = 0

    with open('track_list.csv') as file:
        lines = file.readlines()[1:]

    count = 1
    sql = 'INSERT INTO Song(id, name, artist, link, tempo, modeID, genreID, length, year, lyricID) VALUES\n'
    tagsSQL = 'INSERT INTO SongTag(songID, tagID) VALUES\n'
    for line in csv.reader(lines, quotechar='"', delimiter=',', quoting=csv.QUOTE_ALL):
        genre = line[0].strip()
        name = f'"{line[1].strip()}"'
        artist = f'"{line[2].strip()}"'
        length = line[3].strip()
        tempo = int(line[4].strip())
        mode = line[5].strip()
        lyric = line[6].strip()
        year = line[7].strip()
        link = 'NULL'
        query = line[1].strip()

        if genre in genreID: genre = genreID[genre]
        else: genre = 'NULL'

        if artist == 'N/A': artist = 'NULL'
        else: query += ' ' + artist

        if link_count < 20:
            request = youtube.search().list(
                part='snippet',
                q=query,
                type='video'
            )
            items = request.execute()['items']
            if len(items) > 0:
                vid = items[0]['id']['videoId']
                link = f'https://youtube.com/watch?v={vid}'
                link_count += 1

        # convert year to int
        if (year == 'N/A'): year = 'NULL'
        else: year = int(year)

        # convert length to seconds
        tokens = length.split(':')
        if (len(tokens) == 2):
            length = 60*int(tokens[0]) + int(tokens[1])

        if mode in modeID: mode = modeID[mode]
        else: mode = 'NULL'

        if lyric in lyricID: lyric = lyricID[lyric]
        else: lyric = 'NULL'

        if tempo <= 60: tagsSQL += f'({count}, {tagID["Tempo<=60"]}), '
        if tempo <= 80: tagsSQL += f'({count}, {tagID["Tempo<=80"]}), '
        if tempo >= 80: tagsSQL += f'({count}, {tagID["Tempo>=80"]}), '
        if tempo <= 120: tagsSQL += f'({count}, {tagID["Tempo<=120"]}), '
        if mode == 'Major': tagsSQL += f'({count}, {tagID["Mode=Major"]}), '

        tagsSQL += '\n'
        if link != 'NULL': link = f'"{link}""'
        sql += f'({count}, {name}, {artist}, {link}, {tempo}, {mode}, {genre}, {length}, {year}, {lyric}),\n'
        count = count + 1

    sql = sql[0:-2] + ';'
    tagsSQL = tagsSQL[0:-3] + ';'

    with open('sql/insert_songs.sql', 'w') as file:
        file.write(sql + '\n\n' + tagsSQL)

if __name__ == '__main__':
    main()