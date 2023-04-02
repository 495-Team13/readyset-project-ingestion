import pandas as pd
import CRUD

def product_convert_nested(product):
    product['count'] = '' if product['count']['num'] < 0 else str(product['count']['num'])+product['count']['unit']
    product['amount'] = str(product['amount']['measurement'])+product['amount']['unit'] 

def export_project(project):
    query = {'upc': {'$in': project['products']}}
    products = CRUD.client.get_products(query)

    drc_upc = []
    for product in products:
        product_convert_nested(product)
        if product['drc_upc'] == '':
            drc_upc.append(product['drc_upc'])

    query = {'upc': {'$in': drc_upc}}
    drc = CRUD.client.get_products(query)

    for product in drc:
        product_convert_nested(product)

    products += drc

    df = pd.DataFrame(products)
    return df.to_csv(index=False)
