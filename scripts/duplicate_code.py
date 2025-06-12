from PIL import Image
import os
import pandas as pd
from pdf2image import convert_from_path
import shutil
from datetime import date
import distance
import numpy as np
import math
from itertools import combinations
import json, base64
import sys
# Load paths from config

raw = base64.b64decode(sys.argv[1]).decode('utf-8')
config = json.loads(raw)

# script_dir = os.getcwd()
# config_path = os.path.join(script_dir, "duplicate_forgery_config.json")


# with open(config_path, "r") as f:
#     config = json.load(f)

current_folder = config['paths']['current_folder']
input_folder = config['paths']['input_folder']
image_folder = config['paths']['image_folder']
output_excel_path = config['paths']['output_excel']
poppler_path = config['paths']['poppler_path']


try:
    # Step 1: Prepare input_folder and image_folder
    shutil.rmtree(input_folder, ignore_errors=True)
    os.makedirs(input_folder, exist_ok=True)

    shutil.rmtree(image_folder, ignore_errors=True)
    os.makedirs(image_folder, exist_ok=True)

    # Step 2: Copy only supported files into input_folder
    for file in os.listdir(current_folder):
        ext = file.split('.')[-1].upper()
        if ext in ("PNG", "JPEG", "JPG", "PDF"):
            shutil.copy(os.path.join(current_folder, file), os.path.join(input_folder, file))

    # Step 3: From input_folder, copy images or split PDFs into image_folder
    for file in os.listdir(input_folder):
        file_path = os.path.join(input_folder, file)
        try:
            ext = file.split('.')[-1].upper()
            if ext in ("PNG", "JPEG", "JPG"):
                shutil.copy(file_path, image_folder)
            elif ext == "PDF":
                pages = convert_from_path(file_path, poppler_path=poppler_path)
                for idx, page in enumerate(pages):
                    page.save(os.path.join(image_folder, f"{file.split('.')[0]}^page{idx+1}.jpg"), 'JPEG')
        except Exception as e:
            print(f"[ERROR] Splitting {file}: {e}")
    # Step 4: Base Data Preparation
    files = os.listdir(image_folder)
    base_data = pd.DataFrame(files, columns=["Image_Name"])
    base_data["Scan_Date"] = date.today()
except Exception as e:
    print(f"[ERROR] Main Function: {e}")

df=pd.DataFrame()
output_file = output_excel_path + "/" + "Meta_Data_Output.xlsx"
df.to_excel(output_file, index=False)
print(output_file)