# CSE-564 - Visualization

# Mini Project 2

### Technologies Used

-   Next.js
-   D3.js
-   Chakra-UI
-   Python
-   Flask
-   Scikit-learn

### Data Source

-   https://www.kaggle.com/datasets/abdulrahmankhaled1/1983-2020-used-cars

### About Data

The Kaggle dataset on sold used cars in the period 1983-2020 contains information on over 370,000 used cars sold in the United States. The dataset includes details on various features of the cars, such as make, model, year, mileage, price, and location of sale. This dataset is frequently used for analysis and modeling tasks such as predicting the price of a used car based on its features or identifying trends in the used car market over time.

### Capabilities

-   Scree-plot - Plot of number of principal components vs the explained variance by them respectively. There is slider provided for the user to select the dimensionality index
-   BiPlot - Scatter plot of the PC1 vs PC2 along with eigen values of the attributes as per their contribution in PC1 and PC2
-   PCA Loadings - Depending on the dimensionality index choses, a table is displayed with sum-squared loading for the attributes present in our dataset and their corresponding PC contributions
-   Scatter Plot Matrix - Depending on the best values for sum-squared loading, we select 4 attributes and display the scatter-plot matrix for those
-   Elbow Plot - This method is used to find the optimum number of clusters for our dataset. We plot the sum squared error vs number of clusters and pick the best k.
-   Clustering - The points are clustered with K-means algorithm with best k chosen from elbow plot and plotted in the bi-plot with color coding to annotate the group which they belong to.

### Steps to run

-   Requires
    -   Node.js installed with npm
    -   Python (dependencies listed requirements.txt)
-   Clone the repo and run `npm install` from terminal
-   To start the python server, navigate to the py_server directory and run `python index.py`
-   Change server hostname and port in `constants.tsx` file to `localhost` and `5000`
-   To start the next server, run `npm run dev` from terminal from root directory
-   Open http://localhost:3000 on local browser

### Demo

-   https://visualization-mini-project-2.vercel.app/
