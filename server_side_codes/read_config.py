import configparser
import json

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

def get_section(config_file_path, section_id):
    config = configparser.ConfigParser()
    config.read(config_file_path)

    if section_id not in config:
        raise ValueError("Section id " + section_id + " doesn't exist.")
    else:
        config_dict = {s:dict(config.items(s)) for s in config.sections()}
        return config_dict[section_id]


 
# read_ini("./config.ini")
# print(get_key("./config.ini", "ONE_SIGNAL_CONFIG", "AUTHORIZATION_ID"))
# print(get_section("./config.ini", "ONE_SIGNAL_CONFIG"))
# print(get_section("./config.ini", "MYSQL_DATABASE"))

mysql_config = get_section("./config.ini", "MYSQL_DATABASE")
f = open("./mysql_config.json", "w")
f.write(json.dumps(mysql_config, indent=4))
f.close()


aws_config = get_section("./config.ini", "AWS_CONFIG")
f = open("./aws_config.json", "w")
f.write(json.dumps(aws_config, indent=4))
f.close()


# instantiate
config = configparser.RawConfigParser()
config.read("./config.ini")
config_mysql_user_reg = configparser.ConfigParser()

# add a new section and some values
config_mysql_user_reg.add_section('DATABASE')
config_mysql_user_reg.set('DATABASE', 'HOST', config["MYSQL_DATABASE"]["DB_HOST"])
config_mysql_user_reg.set('DATABASE', 'USERNAME', config["MYSQL_DATABASE"]["DB_USER"])
config_mysql_user_reg.set('DATABASE', 'PASSWORD', config["MYSQL_DATABASE"]["DB_PASSWORD"])
config_mysql_user_reg.set('DATABASE', 'DB', config["MYSQL_DATABASE"]["DB_DATABASE"])
config_mysql_user_reg.set('DATABASE', 'PORT', config["MYSQL_DATABASE"]["DB_PORT"])

# save to a file
with open('mysql_config_ini_user_reg.ini', 'w') as configfile:
    config_mysql_user_reg.write(configfile)

