import configparser

def read_ini(file_path):
    config = configparser.ConfigParser()
    config.read(file_path)
    for section in config.sections():
        print("\n"+ section)
        for key in config[section]:
            print((key, config[section][key]))

def get_key(config_file_path, section_id, key_id):
    config = configparser.ConfigParser()
    config.read(config_file_path)

    if section_id not in config:
        raise ValueError("Section id " + section_id + " doesn't exist.")
    elif key_id not in config[section_id]:
        raise ValueError("Key id " + key_id + " doesn't exist.")
    else:
        return config[section_id][key_id]
 
read_ini("./config.ini")
print(get_key("./config.ini", "ONE_SIGNAL_CONFIG", "AUTHORIZATION_ID"))