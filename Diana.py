import base64
import datetime
import ipaddress
import logging
import os
import subprocess
import sys
import random

logging.basicConfig(level=logging.INFO)

IRAN_SYMBOL = "🇮🇷"
FOREIGN_SYMBOL = "🇩🇪"

IR_TAG = f"Darknessm427{IRAN_SYMBOL}"
SW_TAG = f"ÐΛɌ₭ᑎΞ𐒡𐒡{FOREIGN_SYMBOL}WoW"

warp_cidr = [
    "8.6.112.0/24",
#   "8.34.70.0/24",
    "8.34.146.0/24",
    "8.35.211.0/24",
    "8.39.125.0/24",
    "8.39.204.0/24",
    "8.47.69.0/24",
    "162.159.192.0/24",
#   "162.159.195.0/24",
#   "188.114.96.0/24",
    "188.114.97.0/24",
    "188.114.98.0/24",
#   "188.114.99.0/24",
]

ports_str = os.environ.get(
    "AVAILABLE_PORTS",
    "854 859 864 878 880 890 891 894 903 908 928 934 939 942 943 945 946 955 968 987 988 1002 1010 1014 1018 1070 1074 1180 1387 1701 1843 2371 2408 2506 3138 3476 3581 3854 4177 4198 4233 4500 5279 5956 7103 7152 7156 7281 7559 8319 8742 8854 8886",
)
available_ports = [int(p) for p in ports_str.split()]


def generate_warp_endpoint():
    cidr = random.choice(warp_cidr)
    network = ipaddress.IPv4Network(cidr)
    ip = network.network_address + random.randint(1, network.num_addresses - 2)
    port = random.choice(available_ports)
    endpoint = f"{ip}:{port}"
    logging.info(f"Generated WARP endpoint: {endpoint}")
    return endpoint


script_directory = os.path.dirname(os.path.abspath(__file__))
main_directory = script_directory
output_warp_path = os.path.join(main_directory, "warp2.json")
output_bestip_path = os.path.join(main_directory, "Bestip2.txt")


def export_hiddify_config(t_ips):
    config_prefix = f"warp://{t_ips[0]}/?ifp=40-80&ifps=50-100&ifpd=2-4&ifpm=m4#{IR_TAG}&&detour=warp://{t_ips[1]}/?ifp=50-100&ifps=30-60&ifpd=2-4&ifpm=m6#{SW_TAG}\nwarp://{t_ips[0]}/?ifp=50-100&ifps=30-60&ifpd=2-4&ifpm=m3#{IR_TAG}&&detour=warp://{t_ips[1]}/?ifp=50-100&ifps=30-60&ifpd=2-4&ifpm=m6#{SW_TAG}\nwarp://@auto6/?ifp=30-60&ifps=30-60&ifpd=2-4&ifpm=m4#LocalV6&&detour=warp://@auto4/?ifp=50-100&ifps=30-60&ifpd=2-4&ifpm=m4#WoWV4_v6"
    return config_prefix


def main():
    try:
        title = (
            "//profile-title: base64:"
            + base64.b64encode("ʷᵃʳᵖ〘⬳𓄂𓆃⟿〙ʷᵃʳᵖ".encode("utf-8")).decode("utf-8")
            + "\n"
        )
        update_interval = "//profile-update-interval: 3\n"
        sub_info = "//subscription-userinfo: upload=0; download=0; total=10737418240000000; expire=2546249531\n"
        profile_web = "//profile-web-page-url: https://github.com/darknessm427\n"
        last_modified = "//last update on: " + datetime.datetime.now().strftime("%a, %H:%M:%S") + "\n"

        best_ips = [generate_warp_endpoint() for _ in range(10)]
        
        with open(output_bestip_path, "w") as f:
            for ip_port in best_ips:
                f.write(f"{ip_port}\n")
        logging.info(f"Successfully created {output_bestip_path} with 10 endpoints.")

        with open(output_warp_path, "w") as op:
            op.write(
                title
                + update_interval
                + sub_info
                + profile_web
                + last_modified
                + export_hiddify_config(best_ips)
            )
        logging.info(f"Successfully created Hiddify config at {output_warp_path}")

    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
