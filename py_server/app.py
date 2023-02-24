from flask import Flask
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

#####################################################################################
# Read data from CSV
df_raw = pd.read_csv('cars.csv')

# Clean and pre-process the data

# 1. Drop categorical columns
cols_to_drop = ["name", "torque", "fuel", "seller_type", "transmission", "owner"]
df_num = df_raw.drop(cols_to_drop, axis=1)

# 2. Drop rows having null values, replace blank with 0
df_cleaned = df_num.dropna(axis=0)
df_cleaned = df_cleaned.replace(np.nan, 0, regex=True)
df_cleaned = df_cleaned.replace('', 0, regex=True)

# 3. Clean the columns that have text and change data type to float
df_cleaned['engine'] = df_cleaned['engine'].apply(lambda x: '0' + x.replace(' CC', ''))
df_cleaned['engine'] = df_cleaned['engine'].astype('float')

df_cleaned['max_power'] = df_cleaned['max_power'].apply(lambda x: '0' + x.replace(' bhp', ''))
df_cleaned['max_power'] = df_cleaned['max_power'].astype('float')

df_cleaned['mileage'] = df_cleaned['mileage'].apply(lambda x: '0' + x.replace(' kmpl', '').replace(' km/kg', ''))
df_cleaned['mileage'] = df_cleaned['mileage'].astype('float')

# 4. Target variable transformation (Continuous to Categorical)
df_cleaned["selling_price"] = pd.qcut(df_cleaned["selling_price"], 4, labels=["Grp 1", "Grp 2", "Grp 3", "Grp 4"])
df_cleaned["selling_price"]

# 5. Scale the values of numerical columns
scaler = StandardScaler()
df_scaled = df_cleaned.copy()

numeric_columns = ["km_driven", "mileage", "engine", "max_power", "seats"]
df_scaled[numeric_columns] = scaler.fit_transform(df_scaled[numeric_columns])

#####################################################################################
# 6. PCA Analysis
pca_model = PCA(n_components=4)
res = pca_model.fit_transform(df_scaled[numeric_columns])

# Scree Plot data
variance_ratio = list(pca_model.explained_variance_ratio_)

# Bi-plot data
bi_plot_points = [[point[0], point[1]] for point in res]
bi_plot_pca_components = np.transpose(pca_model.components_[0:2, :])

bi_plot_data = {
    'bi_plot_points': bi_plot_points,
    'bi_plot_pca_components': bi_plot_pca_components
}

#####################################################################################

app = Flask(__name__)
@app.get("/get_scree_data")
def get_scree_data():
    return variance_ratio

@app.get("/get_bi_plot_data")
def get_bi_plot_data():
    return bi_plot_data

if __name__ == "__main__":
    app.run(debug=True)