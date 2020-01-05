sql_files = [
    '2_insert_questionnaires.sql', 
    '3_insert_songs.sql', 
    '4_insert_playlists.sql', 
    '5_insert_rules.sql'
]

sql = ''

for f in sql_files:
    with open(f) as file:
        sql += file.read() + '\n\n'

with open('2_insert_data.sql', 'w') as file:
    file.write(sql[0:-2])