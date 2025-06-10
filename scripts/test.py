import shutil

import os

import pandas as pd

import json
import sys

# Load paths from config
if len(sys.argv) < 2:
    print("Usage: python script.py '<json_string>'")
    sys.exit(1)
print(sys.argv[1])
try:
    config = json.loads(sys.argv[1])
except json.JSONDecodeError as e:
    print(f"[ERROR] Invalid JSON input: {e}")
    sys.exit(1)

current_folder = config["current_folder"]

input_folder = config["input_folder"]

output_excel_path = config["output_excel_path"]

 

try:

    # Step 1: Prepare input_folder and image_folder

    shutil.rmtree(input_folder, ignore_errors=True)

    os.makedirs(input_folder, exist_ok=True)

 

    # Step 2: Copy only supported files into input_folder

    for file in os.listdir(current_folder):

        ext = file.split('.')[-1].upper()

        if ext in ("PNG", "JPEG", "JPG", "PDF"):

            shutil.copy(os.path.join(current_folder, file), os.path.join(input_folder, file))

except Exception as e:

    print(f"[ERROR] Main Function: {e}")

 

 

current_folder_path=input_folder

 

df=pd.DataFrame()

 
output_file = output_excel_path + "\\" + "Meta_Data_Output.xlsx"
df.to_excel(output_file, index=False)
print(output_file)