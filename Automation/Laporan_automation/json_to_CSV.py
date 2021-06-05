#!/usr/bin/env python3
import pandas as pd
import sys
nama = sys.argv[1]
csv_nama = nama+'.csv'
print("Input 1:", nama)
df = pd.read_json (r'Laporan_02-June-2021.json', lines=False)
export_csv = df.to_csv (csv_nama, index = None, header=True)
