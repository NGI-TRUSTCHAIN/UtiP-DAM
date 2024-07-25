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
    
    result = audit(k, file_name)
    return print(result)

def preprocess_data(data):
    location_id = 'region_id' if 'region_id' in data.columns else 'location_id'
    start_time = 'first_time_seen' if 'first_time_seen' in data.columns else 'start_time'
    end_time = 'last_time_seen' if 'last_time_seen' in data.columns else 'end_time'
    unique_id = 'visitor_id' if 'visitor_id' in data.columns else 'anonymized_unique_id'
    
    try:
        data[[start_time, end_time]] = data[[start_time, end_time]].apply(pd.to_datetime)
        data['duration'] = (data[end_time] - data[start_time])/ pd.Timedelta(seconds=1)
        data = data[data[location_id] != 0].reset_index(drop=True)
        data = data.sort_values([start_time,end_time,location_id]).reset_index(drop=True)
    except:
        print("error in columns")
        pass
    
    return data,location_id,start_time,end_time,unique_id

def audit(k, file_name):
    #data = pd.read_csv(StringIO(file_name))
    data = pd.read_csv(file_name)
    data,location_id,start_time,end_time,unique_id = preprocess_data(data)
    
    
    if len(data[location_id].unique().tolist()) < 2:
        print('Number of mobility points must be more than 2')
        
    else:
        trace = data.groupby(unique_id).agg({location_id: lambda x: tuple(x),
                                            }).rename(columns={location_id:'seq'}).reset_index()
        n_trace = trace.groupby('seq',as_index=False)[[unique_id]].count().rename(columns={unique_id:'count'})
        
        minK = n_trace['count'].min()
        unique_count = n_trace[n_trace['count'] <= minK]['count'].count()

        target_traces = n_trace[n_trace['count'] <= minK]['seq'].apply(lambda x: list(x)).tolist()
        target_id = trace[trace['seq'].isin(target_traces)][unique_id].tolist()
        counts = n_trace[n_trace['count'] <= minK]['count'].tolist()
        
    # create output    
    if k > minK:
        
        output = {
            "result": "fail",
            "data":[],
            "minK": minK
        }
        
        output['data'].append({f"{target_traces[i]}": counts[i] for i in range(len(target_traces))})
        
    elif k <= minK:
    
        output = {
            "result": "success",
            "data":[],
            "minK": minK
        }
        
        output['data'].append({f"{target_traces[i]}": counts[i] for i in range(len(target_traces))})
    
    return output

if __name__ == '__main__' :
    main()
