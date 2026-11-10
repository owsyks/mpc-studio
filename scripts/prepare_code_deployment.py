# -*- coding: utf-8 -*-
import json
import os

with open('.vercel_deploy_payload.json', encoding='utf-8') as f:
    full = json.load(f)

# Keep code files and config files
code_files = [f for f in full['files'] if not f['file'].endswith('.pdf')]

payload = {
    "name": "mpc-studio",
    "project": "prj_q1bM3Jxy0hEhsAkaHugcIDzN3sfc",
    "target": "production",
    "projectSettings": {
        "framework": "nextjs"
    },
    "files": code_files
}

with open('.vercel_code_payload.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f)

print(f"Code payload written: {len(code_files)} files, {os.path.getsize('.vercel_code_payload.json') / 1024:.1f} KB")
