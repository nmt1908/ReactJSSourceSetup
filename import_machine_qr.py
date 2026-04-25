import pandas as pd
from sqlalchemy import create_engine
import sys

def import_data():
    try:
        # Configuration
        EXCEL_PATH = '/home/gmo044/Desktop/Excel/DI_PADINPUT/Machine_QR.xlsx'
        # DB_URL format: postgresql://user:password@host:port/database_name
        # Updated database name to 'f1_iot' based on your screenshot
        DB_URL = 'postgresql://postgres:abcd%401234@10.13.34.166:6974/f1_iot'
        
        print(f"Reading Excel: {EXCEL_PATH}")
        df = pd.read_excel(EXCEL_PATH)
        
        # Mapping columns: Excel might have different headers, so we enforce our DB column names
        # Based on your image: 1st column is Machine Number, 2nd is Property Code
        df.columns = ['machine_number', 'property_code']
        df['machine_number'] = df['machine_number'].astype(str)
        
        print(f"Connecting to DB: {DB_URL}")
        engine = create_engine(DB_URL)
        
        # Import to table 'machine_qr' in 'public' schema
        print("Importing data...")
        df.to_sql('machine_qr', engine, if_exists='append', index=False, schema='public')
        
        print("✅ Success! All rows imported to 'machine_qr' table.")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    import_data()
