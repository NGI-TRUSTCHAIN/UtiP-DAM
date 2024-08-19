import pandas as pd
import numpy as np
from datetime import datetime, time, date, timedelta
import sys,argparse
#from io import StringIO

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--k', type=int)
    parser.add_argument('--input', type=str)
    args = parser.parse_args()

    k = args.k
    file_name = args.input
    
    result,anonymized_total,original_total,target_total,trace_total = anonymization(k,file_name)
    
    if result.columns.isin(['dataset_id','location_id','anonymized_unique_id','start_time','end_time','distance']).any():
        result = result[['dataset_id','location_id','anonymized_unique_id','start_time','end_time','distance']]
    else:
        result = rearrange(result)
    
    output = performance(anonymized_total,original_total,target_total,trace_total)
    
    return output, result.to_csv(sys.stdout,index=False)

def preprocess_data(data):
    location_id = 'region_id' if 'region_id' in data.columns else 'location_id'
    start_time = 'first_time_seen' if 'first_time_seen' in data.columns else 'start_time'
    end_time = 'last_time_seen' if 'last_time_seen' in data.columns else 'end_time'
    unique_id = 'visitor_id' if 'visitor_id' in data.columns else 'anonymized_unique_id'
    
    try:
        data[[start_time, end_time]] = data[[start_time,end_time]].apply(pd.to_datetime)
        data['duration'] = (data[end_time] - data[start_time])/ pd.Timedelta(seconds=1)
        data = data[data[location_id] != 0].reset_index(drop=True)
        data = data.sort_values([start_time,end_time,location_id]).reset_index(drop=True)
    except:
        print("error in columns")
        pass
    
    return data,location_id,start_time,end_time,unique_id

def rearrange(result):
    bins = [-100,-90, -80, -70, -50, -1]
    labels = ['80m_to_100m', '60m_to_80m', '40m_to_60m','20m_to_40m', '5m_to_20m']
    
    for i in range(0, len(bins)-1):
        result.loc[(result['rssi_avg'] >= bins[i]) & (result['rssi_avg'] < bins[i+1]), 'distance'] = labels[i]
    
    result = result[['site_id','region_id','visitor_id','first_time_seen','last_time_seen','distance']]
    result.columns = ['dataset_id','location_id','anonymized_unique_id','start_time','end_time','distance']
        
    return result  

def anonymization(k,file_name):
    #data = pd.read_csv(StringIO(file_name))
    data = pd.read_csv(file_name)
    data,location_id,start_time,end_time,unique_id = preprocess_data(data)
    
    if len(data[location_id].unique().tolist()) < 2:
        print('Number of mobility points must be more than 2')
        
    else:
        trace = data.groupby(unique_id).agg({location_id: lambda x: tuple(x),
                                            }).rename(columns={location_id:'seq'}).reset_index()
    
        n_trace = trace.groupby('seq',as_index=False)[[unique_id]].count().rename(columns={unique_id:'count'})
        
        #unique_count = n_trace[n_trace['count'] <= k]['count'].count()

        target_traces = n_trace[n_trace['count'] <= k]['seq'].tolist()
        target_id = trace[trace['seq'].isin(target_traces)][unique_id].tolist()
                
        result = data[~data[unique_id].isin(target_id)]
        
        anonymized_total = result.shape[0]
        original_total = data[data[location_id] != 0].shape[0]

        trace_total = trace.shape[0]
        target_total = trace_total - result.groupby(unique_id).agg({location_id: lambda x: tuple(x),
                                    }).rename(columns={location_id:'seq'}).shape[0]
        
    return result, anonymized_total,original_total,target_total,trace_total

def performance(anonymized_total,original_total,target_total,trace_total):
    output = {"data":
                [
            {"Percentage of information deleted": np.round(target_total / trace_total *100,2),
            "Percentage of records deleted": np.round(100 - (anonymized_total / original_total*100),2),
            "No. of records deleted": original_total- anonymized_total,
            "No. of information deleted": target_total
            }
                ]
        }
    return print(output)

if __name__ == '__main__' :
    main()
