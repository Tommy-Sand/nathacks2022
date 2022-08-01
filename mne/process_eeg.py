import mne
import numpy as np
import pandas as pd 
from pathlib import Path

#Function convert_duration - This function is only ran if the user uploads a .csv file
#Parameter:
#   duration(str): A string representing a float that is the amount of time
# it took to record the eeg
#Return (float/None): A float is returned, else None is returned if duration was not a float
def convert_duration(duration):
    try:
        return float(duration)
    except ValueError:
        return None
    
#Function init_data - reads a .csv file and returns the contents in a pandas dataframe. Contents is the raw eeg data
#for all the channels
#Parameter:
#   path(pathlib.Path): A path to the .csv file
#Return (pandas.DataFrame/None): Pandas DataFrame one succesfull read of the contents stored
#at path, else None is returned if unable to read file at path
def init_data(path):
    try: 
        return pd.read_csv(path).transpose()
    except:
        return None

#Function init_raw - reads a file supported by mne.io.read_raw() 
#Parameter:
#   path(pathlib.Path): A path to a file supported by mne.io.read_raw()
#Return (mne.io.Raw/int): On a succesfull read of the file at path return the mne.Raw, else
#return an integer relating to why the file couldn't be opened
def init_raw(path):
    try:
        return mne.io.read_raw(path)
    except FileNotFoundError:
        return 1
    except AssertionError:
        return 2
    except:
        return 3

#Funtion init_raw_from_data - creates a mne.io.Raw object given pandas data frame and duration of the eeg.
#This function is only called if the file uploaded is .csv
#Parameters:
#   data (pandas.DataFrame): obtained from init_data() contains the raw eeg data from channels
#   duration (float): obtained from convert_duration. The duration over which the eeg data was collected
#Return (mne.io.Raw): Returns the a mne.io.Raw object if successful
def init_raw_from_data(data, duration):
    #These channel names are meaningless since we will average all channels
    misc_ch_names = [str(i) for i in range(len(data))]

    num_rows = data.shape[1]

    info = mne.create_info(misc_ch_names, num_rows/(duration), ch_types="eeg")

    return mne.io.RawArray(data, info)
#Function -
#Parameter:
#
#Return ():
def init_freq_dom(raw):
    tmax = int(raw.times[len(raw.times)-1])
    if(tmax > 60):
        tmax = 60
    raw.crop(tmax=tmax)
    epochs = mne.make_fixed_length_epochs(raw, duration=1, preload=True)
    
    epoch_duration = 1
    psd_epochs = []
    for i in range(len(epochs)):
        fmax = epochs[i].info["lowpass"]
        if(fmax > 140):
            fmax = 140
        epoch = epochs[i]
        psds, freqs = mne.time_frequency.psd_welch(epoch, tmax=epoch_duration, fmax=fmax, n_jobs=-1)
        psds = psds[0]
        psds = 10 * np.log10(psds)
        psds_mean = psds.mean(0)
        psd_epochs.append((freqs, psds_mean))
    return psd_epochs

#Function -
#Parameter:
#
#Return ():
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

#Function -
#Parameter:
#
#Return ():
def collect_brain_waves_loop(psd_epochs):
    epochs_dic_waves = []
    for i in range(len(psd_epochs)):
        freqs = psd_epochs[i][0]
        psd_mean = psd_epochs[i][1]
        dic_waves = collect_brain_waves(freqs, psd_mean)
        dic_waves["second"] = i
        epochs_dic_waves.append(dic_waves)
    return epochs_dic_waves

#Function process_eeg - The main function that is entered by main.py to calculate the 
#Parameter:
#
#Return ():
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
    psd_epochs  = init_freq_dom(raw)
    return collect_brain_waves_loop(psd_epochs)

if(__name__ == '__main__'):
    #path = input("Enter a file that contains eeg data: ")
    #duration = input("Enter duration: ")
    #print(process_eeg(path, duration))
    print(process_eeg("F:\\src\\nathacks2022\\mne\\Subject00_1.edf"))