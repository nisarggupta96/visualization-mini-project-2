from flask import Flask, request
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
cols_to_drop = ["name", "torque", "fuel",
                "seller_type", "transmission", "owner", "year"]
df_num = df_raw.drop(cols_to_drop, axis=1)

# 2. Drop rows having null values, replace blank with 0
df_cleaned = df_num.dropna(axis=0)
df_cleaned = df_cleaned.replace(np.nan, 0, regex=True)
df_cleaned = df_cleaned.replace('', 0, regex=True)

# 3. Clean the columns that have text and change data type to float
df_cleaned['engine'] = df_cleaned['engine'].apply(
    lambda x: '0' + x.replace(' CC', ''))
df_cleaned['engine'] = df_cleaned['engine'].astype('float')

df_cleaned['max_power'] = df_cleaned['max_power'].apply(
    lambda x: '0' + x.replace(' bhp', ''))
df_cleaned['max_power'] = df_cleaned['max_power'].astype('float')

df_cleaned['mileage'] = df_cleaned['mileage'].apply(
    lambda x: '0' + x.replace(' kmpl', '').replace(' km/kg', ''))
df_cleaned['mileage'] = df_cleaned['mileage'].astype('float')

# 4. Scale the values of numerical columns
scaler = StandardScaler()
df_scaled = df_cleaned.copy()

numeric_columns = ["km_driven", "mileage", "engine",
                   "max_power", "seats", "selling_price", ]
df_scaled[numeric_columns] = scaler.fit_transform(df_scaled[numeric_columns])

#####################################################################################
# 5. PCA Analysis
pca_model = PCA(n_components=6)
res = pca_model.fit_transform(df_scaled[numeric_columns])

# Scree Plot data
variance_ratio = list(pca_model.explained_variance_ratio_)
cumulative_variance_ratio = list(np.cumsum(variance_ratio))
scree_plot_data = {
    'variance_ratio': variance_ratio,
    'cumulative_variance_ratio': cumulative_variance_ratio
}

# Bi-plot data


def compute_bi_plot_data(dim_index=2):
    bi_plot_points = [[point[0], point[1]] for point in res.tolist()]

    bi_plot_pca_components = np.transpose(
        pca_model.components_[0:dim_index, :]).tolist()

    bi_plot_pca_sorted = []

    for i in range(len(bi_plot_pca_components)):
        curr_feature = bi_plot_pca_components[i]
        current_row = {'attr_name': numeric_columns[i]}
        ssl = 0
        for j in range(dim_index):
            current_row['pca_component_{}'.format(j+1)] = curr_feature[j]
            ssl += curr_feature[j]**2
        current_row['ssl'] = np.sqrt(ssl)
        bi_plot_pca_sorted.append(current_row)

    bi_plot_pca_sorted.sort(key=lambda x: x['ssl'], reverse=True)

    bi_plot_data = {
        'bi_plot_points': bi_plot_points,
        'bi_plot_pca_sorted': bi_plot_pca_sorted
    }

    return bi_plot_data


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

# K-Means Clustering on PC1 and PC2
kmeans_pca = KMeans(n_clusters=3, init="k-means++", random_state=6)
kmeans_pca.fit(res)

df_cleaned_grped = pd.concat(
    [df_cleaned.reset_index(drop=True), pd.DataFrame(res)], axis=1)
df_cleaned_grped.columns.values[-6:] = ['Component 1',
                                        'Component 2', 'Component 3', 'Component 4', 'Component 5', 'Component 6']
df_cleaned_grped['Segment PCA'] = kmeans_pca.labels_
# Scatter Plot Matrix Data


def compute_scatter_plot_data(dim_index=2):
    bi_plot_data = compute_bi_plot_data(dim_index)
    scatter_plot_data = {
        'bi_plot_pca_sorted': bi_plot_data['bi_plot_pca_sorted'],
        'scatter_data': df_cleaned_grped.to_dict()
    }
    return scatter_plot_data


df_pca_kmeans = pd.concat(
    [df_scaled.reset_index(drop=True), pd.DataFrame(res)], axis=1)
df_pca_kmeans.columns.values[-6:] = ['Component 1',
                                     'Component 2', 'Component 3', 'Component 4', 'Component 5', 'Component 6']
df_pca_kmeans['Segment PCA'] = kmeans_pca.labels_

df_selected_data = df_pca_kmeans[[
    'Component 1', 'Component 2', 'Segment PCA']].to_dict()

kmeans_pca_data = {
    'clustered_data': df_selected_data
}

#####################################################################################

app = Flask(__name__)


@app.get("/get_scree_data")
def get_scree_data():
    return scree_plot_data


@app.get("/get_bi_plot_data")
def get_bi_plot_data():
    args = request.args.to_dict()
    n = 2
    if 'di' in args:
        n = args['di']
    return compute_bi_plot_data(int(n))


@app.get("/get_scatter_data")
def get_scatter_data():
    args = request.args.to_dict()
    n = 2
    if 'di' in args:
        n = args['di']
    return compute_scatter_plot_data(int(n))


@app.get("/get_elbow_plot_data")
def get_elbow_plot_data():
    return elbow_plot_data


@app.get("/get_kmeans_pca_data")
def get_kmeans_pca_data():
    return kmeans_pca_data


if __name__ == "__main__":
    app.run(debug=True)
