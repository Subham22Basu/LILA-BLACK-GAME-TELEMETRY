import os
import pandas as pd
import json

def process_telemetry(data_folder, output_file):
    all_data = []
    print("🚀 Starting High-Precision Sync...")
    
    for root, dirs, files in os.walk(data_folder):
        folder_name = os.path.basename(root)
        for filename in files:
            file_path = os.path.join(root, filename)
            if os.path.isfile(file_path) and "nakama" in filename:
                try:
                    df = pd.read_parquet(file_path, engine='fastparquet')
                    df['event'] = df['event'].apply(lambda x: x.decode('utf-8') if isinstance(x, bytes) else str(x))
                    
                    # 1. Clean Date for Dropdown
                    clean_date = folder_name.replace("_", " ")
                    df['match_date'] = clean_date
                    
                    # 2. Flag Bots
                    df['is_bot'] = df['user_id'].apply(lambda x: len(str(x)) < 15 or str(x).isnumeric())
                    
                    # 3. HIGH PRECISION TIME (Keep Decimals)
                    # We convert to float so 1770.1 and 1770.2 stay separate!
                    df['ts'] = pd.to_datetime(df['ts']).astype('int64') / 10**6
                    
                    all_data.append(df)
                except Exception as e:
                    print(f"❌ Error: {e}")

    if not all_data: return
    combined_df = pd.concat(all_data, ignore_index=True)
    
    # 4. SORT BY DATE THEN TIME (Fixes jumbled dropdown + chronological flow)
    # This ensures Feb 10 comes before Feb 11
    combined_df = combined_df.sort_values(by=['match_date', 'ts'])
    
    combined_df.to_json(output_file, orient='records')
    print(f"✅ DONE! First TS: {combined_df['ts'].iloc[0]} | Last TS: {combined_df['ts'].iloc[-1]}")
    print("The decimals are now preserved. Your slider will be smooth.")

if __name__ == "__main__":
    process_telemetry("player_data", "database.json")