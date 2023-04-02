from db import DBClient
import json
from bson import json_util

# Replace with your MongoDB connection info
client = DBClient('localhost', 27017, 'admin', 'q4m92DT%!EvsEd', 'admin')
client.check_connection()

# CRUD operations for Projects
def create_project(name, products):
    """
    Creates a new project document with the given name and products array.
    Returns the inserted project
    """
    return client.add_project(name, products)

def get_project_by_name(name):
    """
    Returns the project document with the given name, or None if not found.
    """
    docs = client.get_projects({"name": name})
    return docs[0] if len(docs) > 0 else None

def get_all_projects():
    return client.get_projects()

def update_project(name, products):
    """
    Updates the project document with the given name, setting the products array to the new value.
    Returns the Updated Project if the document was updated, or False if not found.
    """
    return client.update_project(name, {"$addToSet": {"products": products}})

def delete_project(name):
    """
    Deletes the project document with the given name.
    Returns True if the document was deleted, or False if not found.
    """
    return client.delete_project(name)


# CRUD operations for Products

def create_product(upc, name, count, amount, template_name, width, height, depth, add_height=None, add_info=None, drc_upc=None):
    """
    Creates a new product document with the given properties.
    Returns the inserted document's ID.
    """
    product = {
        "upc": upc,
        "drc_upc": drc_upc,
        "name": name,
        "count": count,
        "amount": amount,
        "template_name": template_name,
        "width": width,
        "height": height,
        "depth": depth,
        "add_height": add_height,
        "add_info": add_info,
    }
    return client.add_product(product)


def get_product_by_upc(upc):
    """
    Returns the product document with the given UPC, or None if not found.
    """
    docs = client.get_products({"upc": upc})
    return docs[0] if len(docs) > 0 else None


def update_product(upc, updates):
    """
    Updates the product document with the given UPC, setting the properties in the `updates` dictionary.
    Returns True if the document was updated, or False if not found.
    """
    return client.update_product(upc, {"$set": updates})

def delete_product(upc):
    """
    Deletes the product document with the given UPC.
    Returns True if the document was deleted, or False if not found.
    """
    return client.delete_product(upc)

def delete_product_from_project(project_name, product_upc):
    '''
    Removes the given product UPC from the project's product array.
    Returns True if the product was removed, or false if not found.
    '''
    return client.update_project(project_name, {"$pull": {"products": {"upc": product_upc}}})

# CRUD operations for Templates

def create_template(name, type_, workflow, donor_shape, product_upc, notes, form_desc, gltf):
    """
    Creates a new template document with the given properties.
    Returns the inserted document's ID.
    """
    template = {
        "name": name,
        "type": type_,
        "workflow": workflow,
        "donor_shape": donor_shape,
        "product_upc": product_upc,
        "notes": notes,
        "form_desc": form_desc,
        "gltf": gltf,
    }
    return client.add_template(template)

def get_template_by_name(name):
    """
    Returns the template document with the given name, or None if not found.
    """
    docs = client.get_templates({"name": name})
    return docs[0] if len(docs) > 0 else None

def update_template(name, updates):
    """
    Updates the template document with the given name, setting the properties in the `updates` dictionary.
    Returns True if the document was updated, or False if not found.
    """
    return client.update_template(name, {"$set": updates})


def delete_template(name):
    """
    Deletes the template document with the given name.
    Returns True if the document was deleted, or False if not found.
    """
    return client.delete_template(name)
