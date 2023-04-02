import pandas as pd
import CRUD

def export_project(project):
    query = {'upc': {'$in': project['products']}}
    products = CRUD.client.get_products(query)
    df = pd.DataFrame(products)
    return df.to_csv(index=False)
