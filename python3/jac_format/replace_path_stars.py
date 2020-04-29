import re

# paths          -> return_val
# ----------------------------
# interface      -> interface
# samples.*      -> samples.1
# samples.*.item -> samples.1.item
# samples.*      -> samples.2
# metadata       -> metadata

def should_star_increment(path, prefix):
    # Remove initial part of string to see if there's anything at the end e.g.
    # samples.* -> True
    # samples.*.item1 -> False
    
    remaining_string = path.replace(prefix, "")
    remaining_string = re.sub("\*\]?", "", remaining_string)
    return len(remaining_string) == 0

def replace_path_stars(paths):
    new_paths = []

    paths_with_index = enumerate(paths)
    for (path_index, path) in paths_with_index:
        
        if not "*" in path:
            new_paths.append(path)
            continue
        
        prefix = re.sub('\[?\*.*', "", path)
        
        last_number = None
        for already_added_path in new_paths[::-1]:
            if already_added_path.startswith(prefix):
                already_added_path_wo_prefix = already_added_path.replace(prefix, "")
                get_num_re = re.compile("\[?([0-9]+)")
                last_number = int(get_num_re.search(already_added_path_wo_prefix).group(1))
                break
        
        new_path = None
        if last_number is None:
            new_path = path.replace("*", "0")
        elif should_star_increment(path, prefix):
            new_path = path.replace("*", str(last_number + 1))
        else:
            new_path = path.replace("*", str(last_number))
    
        new_paths.append(new_path)
        
    return new_paths