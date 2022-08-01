import requests

url  =  "http://127.0.0.1:5000"

file = open(r"F:\src\nathacks2022\mne\s07.csv", "rb")
print(requests.post(url, data={"duration": "60"},files={"eeg_file": file}).json())
