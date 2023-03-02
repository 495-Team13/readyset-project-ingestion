import pymongo
import json
from bson import json_util

# Replace with your MongoDB connection string
client = pymongo.MongoClient("mongodb://admin:password@192.168.1.28:27017?authSource=admin")
db = client["pi"]
# Collection for Projects
projects_col = db["projects"]
# Collection for Products
products_col = db["products"]
# Collection for Templates
templates_col = db["templates"]

# CRUD operations for Projects
def create_project(name, products):
    """
    Creates a new project document with the given name and products array.
    Returns the inserted project
    """
    project = {"name": name, "products": products}
    result = projects_col.insert_one(project)
    inserted_id = result.inserted_id
    inserted_project = projects_col.find_one({"_id": inserted_id})
    return inserted_project

def get_project_by_name(name):
    """
    Returns the project document with the given name, or None if not found.
    """
    return projects_col.find_one({"name": name})

def get_all_projects():
    return projects_col.find()

def update_project(name, products):
    """
    Updates the project document with the given name, setting the products array to the new value.
    Returns the Updated Project if the document was updated, or False if not found.
    """
    result = projects_col.update_one({"name": name}, {"$addToSet": {"products": products}})
    if result.modified_count > 0:
        updated_project = projects_col.find_one({"name": name})
        return updated_project
    else:
        return False


def delete_project(name):
    """
    Deletes the project document with the given name.
    Returns True if the document was deleted, or False if not found.
    """
    result = projects_col.delete_one({"name": name})
    return result.deleted_count > 0


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
    result = products_col.insert_one(product)
    new_product_id = result.inserted_id
    inserted_product = products_col.find_one({"_id" : new_product_id})
    return inserted_product


def get_product_by_upc(upc):
    """
    Returns the product document with the given UPC, or None if not found.
    """
    return products_col.find_one({"upc": upc})


def update_product(upc, updates):
    """
    Updates the product document with the given UPC, setting the properties in the `updates` dictionary.
    Returns True if the document was updated, or False if not found.
    """
    result = products_col.update_one({"upc": upc}, {"$set": updates})
    if result.modified_count > 0:
        return products_col.find_one({"upc":upc})
    else:
        return None


def delete_product(upc):
    """
    Deletes the product document with the given UPC.
    Returns True if the document was deleted, or False if not found.
    """
    result = products_col.delete_one({"upc": upc})
    return result.deleted_count > 0


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
    result = templates_col.insert_one(template)
    return templates_col.find_one({"_id": result.inserted_id})


def get_template_by_name(name):
    """
    Returns the template document with the given name, or None if not found.
    """
    return templates_col.find_one({"name": name})


def update_template(name, updates):
    """
    Updates the template document with the given name, setting the properties in the `updates` dictionary.
    Returns True if the document was updated, or False if not found.
    """
    result = templates_col.update_one({"name": name}, {"$set": updates})
    return result.modified_count > 0


def delete_template(name):
    """
    Deletes the template document with the given name.
    Returns True if the document was deleted, or False if not found.
    """
    result = templates_col.delete_one({"name": name})
    return result.deleted_count > 0
