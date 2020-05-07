import json

def get_cell_value(cell):
    if cell == "":
        return None
    try:
        return json.loads(cell)
    except:
        return cell