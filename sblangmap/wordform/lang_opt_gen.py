import json

with open("language_data.json") as json_file:
    json_data = json.load(json_file)
    
for lang in json_data:
    print '<option value="' + lang['code'] + '">' + lang['language'] + '</option>'
