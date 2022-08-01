import requests

url  =  "http://127.0.0.1:5000"

file = open(r"C:\Users\srosa\Documents\EEG_Cat_Study4_II_II_S1.bdf", "rb")
print(requests.post(url, files={"eeg_file": file}).json())
