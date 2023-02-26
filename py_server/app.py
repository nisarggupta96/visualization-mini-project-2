from flask import Flask
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans

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

# 4. Scale the values of numerical columns
scaler = StandardScaler()
df_scaled = df_cleaned.copy()

numeric_columns = ["km_driven", "mileage", "engine", "max_power", "seats", "selling_price",]
df_scaled[numeric_columns] = scaler.fit_transform(df_scaled[numeric_columns])

#####################################################################################
# 5. PCA Analysis
pca_model = PCA(n_components=5)
res = pca_model.fit_transform(df_scaled[numeric_columns])

# Scree Plot data
variance_ratio = list(pca_model.explained_variance_ratio_)
cumulative_variance_ratio = list(np.cumsum(variance_ratio))
scree_plot_data = {
    'variance_ratio': variance_ratio,
    'cumulative_variance_ratio': cumulative_variance_ratio
}

# Bi-plot data
bi_plot_points = [[point[0], point[1]] for point in res.tolist()]
bi_plot_pca_components = np.transpose(pca_model.components_[0:2, :]).tolist()

for i in range(len(bi_plot_pca_components)):
    curr_feature = bi_plot_pca_components[i]
    curr_feature.append(np.sqrt(curr_feature[0]**2 + curr_feature[1]**2))
    curr_feature.append(numeric_columns[i])

bi_plot_pca_components.sort(key=lambda x: x[2], reverse=True)
bi_plot_columns = numeric_columns.copy()
bi_plot_pca_sorted = [{'attr_name': x[3], 'pc1_val': x[0], 'pc2_val': x[1], 'ssl' : x[2]} for x in bi_plot_pca_components]

bi_plot_data = {
    'bi_plot_points': bi_plot_points,
    'bi_plot_pca_sorted': bi_plot_pca_sorted
}

# Scatter Plot Matrix Data
scatter_plot_data = {
    'bi_plot_pca_sorted': bi_plot_pca_sorted,
    'scatter_data': df_cleaned.to_dict()
}

# Elbow Plot Data

kmeans_kwargs = {
    "init": "random",
    "n_init": 10,
    "random_state": 1,
    "max_iter": 300,
}

# Create list to hold SSE values for each k
sse_vs_clusters = []
for k in range(1, 11):
    kmeans = KMeans(n_clusters=k, **kmeans_kwargs)
    kmeans.fit(df_scaled[numeric_columns])
    sse_vs_clusters.append(kmeans.inertia_)

elbow_plot_data = {
    'sse_vs_clusters': sse_vs_clusters
}

print(elbow_plot_data)

#####################################################################################

app = Flask(__name__)
@app.get("/get_scree_data")
def get_scree_data():
    return scree_plot_data

@app.get("/get_bi_plot_data")
def get_bi_plot_data():
    return bi_plot_data

@app.get("/get_scatter_data")
def get_scatter_data():
    return scatter_plot_data

@app.get("/get_elbow_plot_data")
def get_elbow_plot_data():
    return elbow_plot_data

if __name__ == "__main__":
    app.run(debug=True)