import mne
import numpy as np
import pandas as pd 
from pathlib import Path

def convert_duration(duration):
    try:
        return float(duration)
    except ValueError:
        return None
    

def init_data(path):
    return pd.read_csv(path).transpose()

def init_raw(path):
    try:
        return mne.io.read_raw(path)
    except FileNotFoundError:
        return 1
    except AssertionError:
        return 2
    except:
        return 3

def init_raw_from_data(data, duration):
    #These channel names are meaningless since we will average all channels
    misc_ch_names = [str(i) for i in range(len(data))]

    num_rows = data.shape[1]

    info = mne.create_info(misc_ch_names, num_rows/(duration), ch_types="eeg")

    return mne.io.RawArray(data, info)

def init_freq_dom(raw):
    psds, freqs = mne.time_frequency.psd_welch(raw, tmax=60, fmax=140, n_jobs=-1, n_fft=2048)

    psds = 10 * np.log10(psds)
    psds_mean = psds.mean(0)
    return freqs, psds_mean

def collect_brain_waves(freqs, psd_mean):
    psd_min = abs(min(psd_mean))
    
    dic_waves = {"delta" : 0, "theta" : 0, "alpha" : 0, "beta" : 0, "gamma" : 0}

    i=0
    while(i < len(freqs) and freqs[i] < 4):
        dic_waves["delta"] += psd_mean[i] + psd_min
        i+= 1

    while(i < len(freqs) and freqs[i] < 8):
        dic_waves["theta"] += psd_mean[i] + psd_min
        i+=1

    while(i < len(freqs) and freqs[i] < 13):
        dic_waves["alpha"] += psd_mean[i] + psd_min
        i+=1

    while(i < len(freqs) and freqs[i] < 30):
        dic_waves["beta"] += psd_mean[i] + psd_min
        i+=1

    while(i < len(freqs) and freqs[i] < 140):
        dic_waves["gamma"] += psd_mean[i] + psd_min
        i+=1

    return dic_waves

def process_eeg(path, duration=None):
    #we ask how long the recording is
    #We initialize and load the data
    #Perform verification to check if the columns and rows and everything are the correct length
    #Transform data to raw
    #Transform raw to frequency domain, and convert to db
    #Calculate the most common brain waves
    path = Path(path)
    file_format = Path(path).suffix
    if(file_format == '.csv'):
        duration = convert_duration(duration)
        if(duration == None):
            return {"error": "duration must be a float"}
        data = init_data(path)
        if(isinstance(data, int)):
            return None
        raw = init_raw_from_data(data, duration)
    else:
        raw = init_raw(path)
    if(isinstance(raw, int)):
            if(raw == 1):
                return {"error" : "File not found"}
            elif(raw == 2):
                return {"error" : "File not allowed format"}
            else:
                return {"error" : "Unknown error when reading file"}
    freq, db_mean  = init_freq_dom(raw)
    return collect_brain_waves(freq, db_mean)


if(__name__ == '__main__'):
    path = input("Enter a file that contains eeg data: ")
    print(process_eeg(path))