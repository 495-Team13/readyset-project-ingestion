"""Functions for exporting documents to CSV.

Export function names should be formatted as 'export_<document type>'.
This is so that export functions can be retrieved via getattr().
"""

import pandas as pd
import CRUD

def product_convert_nested(product):
    """Converted count and amount fields to single value.

    Args:
      product: Original product document.
    """
    product['count'] = ('' if product['count']['num'] < 0 else
                        f"{product['count']['num']}{product['count']['unit']}")
    product['amount'] = (f"{product['amount']['measurement']}" +
                         {product['amount']['unit']})

def export_project(project):
    """Export project to CSV.

    Args:
      project: Project to export.

    Returns:
      CSV as a string.
    """
    products = CRUD.client.get_products({'upc': {'$in': project['products']}})
    drc_upc = []
    for product in products:
        product_convert_nested(product)
        if product['drc_upc'] != '':
            drc_upc.append(product['drc_upc'])

    drc = CRUD.client.get_products({'upc': {'$in': drc_upc}})
    for product in drc:
        product_convert_nested(product)
    products += drc

    df = pd.DataFrame(products)
    return df.to_csv(index=False)

def export_category(category):
    """Export category to CSV.

    Args:
      category: Category to export.

    Returns:
      CSV as a string.
    """
    templates = CRUD.client.get_templates(
        {'name': {'$in': category['templates']}}
    )
    df = pd.DataFrame(templates)
    return df.to_csv(index=False)
