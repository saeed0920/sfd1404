#!/usr/bin/env python3
import os
import sys
import json
import datetime
import subprocess
import urllib.request
from persiantools.jdatetime import JalaliDateTime

AUTH_TOKEN = os.environ.get("AUTH_TOKEN")
DATA_FILE = "data/donations.json"
TEMP_FILE = "data/new_donations.json"

persian_months = [
    "", "فروردین", "اردیبهشت", "خرداد", "تیر",
    "مرداد", "شهریور", "مهر", "آبان", "آذر",
    "دی", "بهمن", "اسفند"
]

def to_persian_numbers(s):
    en_to_fa = str.maketrans("0123456789", "۰۱۲۳۴۵۶۷۸۹")
    return str(s).translate(en_to_fa)

os.makedirs("data", exist_ok=True)

req = urllib.request.Request(
    "https://daramet.com/api/Donates/Messages",
    headers={"Authorization": AUTH_TOKEN},
    method="POST"
)
with urllib.request.urlopen(req) as resp:
    data = json.load(resp)

donations = [
    {
        "donator_name": d["donator"] if isinstance(d["donator"], str) else d["donator"]["donator_name"],
        "amount": d["donator_data"]["amount"],
        "date": f"{to_persian_numbers(JalaliDateTime.fromtimestamp(d['donator_data']['timestamp']).day)} " +
                f"{persian_months[JalaliDateTime.fromtimestamp(d['donator_data']['timestamp']).month]} " +
                f"{to_persian_numbers(JalaliDateTime.fromtimestamp(d['donator_data']['timestamp']).year)}",
        "message": d["donator_data"]["message"],
    }
    for d in data
]

with open(TEMP_FILE, "w", encoding="utf-8") as f:
    json.dump(donations, f, ensure_ascii=False, indent=2)

if os.path.exists(DATA_FILE):
    result = subprocess.run(
        ["diff", "-q", TEMP_FILE, DATA_FILE],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if result.returncode == 0:
        print("no changes in donations.")
        os.remove(TEMP_FILE)
        sys.exit(0)

os.replace(TEMP_FILE, DATA_FILE)

subprocess.run(["git", "config", "user.name", "github-actions[bot]"], check=True)
subprocess.run(["git", "config", "user.email", "github-actions[bot]@users.noreply.github.com"], check=True)
subprocess.run(["git", "add", DATA_FILE], check=True)

subprocess.run(["git", "commit", "-m", "update donations"], check=True)

subprocess.run(["git", "push", "--force-with-lease"], check=True)
print("donations updated and pushed successfully.")
