# -*- coding: utf-8 -*-
"""
Prepare deployment JSON payload for Vercel create_deployment MCP tool
"""

import json
import os
import base64

files = []

# List of root config files
root_files = ['package.json', 'tsconfig.json', 'tailwind.config.ts', 'postcss.config.mjs']
for rf in root_files:
    if os.path.exists(rf):
        with open(rf, 'r', encoding='utf-8') as f:
            files.append({
                "file": rf,
                "data": f.read(),
                "encoding": "utf-8"
            })

# Traverse src/
for root, _, filenames in os.walk('src'):
    for fname in filenames:
        fpath = os.path.join(root, fname)
        rel_path = os.path.relpath(fpath, '.').replace('\\', '/')
        with open(fpath, 'r', encoding='utf-8') as f:
            files.append({
                "file": rel_path,
                "data": f.read(),
                "encoding": "utf-8"
            })

# Traverse public/
for root, _, filenames in os.walk('public'):
    for fname in filenames:
        fpath = os.path.join(root, fname)
        rel_path = os.path.relpath(fpath, '.').replace('\\', '/')
        with open(fpath, 'rb') as f:
            content_bytes = f.read()
            files.append({
                "file": rel_path,
                "data": base64.b64encode(content_bytes).decode('ascii'),
                "encoding": "base64"
            })

print(f"Total deployment files prepared: {len(files)}")
payload = {
    "name": "mpc-studio",
    "project": "prj_q1bM3Jxy0hEhsAkaHugcIDzN3sfc",
    "target": "production",
    "projectSettings": {
        "framework": "nextjs",
        "nodeVersion": "24.x"
    },
    "files": files
}

with open('.vercel_deploy_payload.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f)

print(f"Payload size: {os.path.getsize('.vercel_deploy_payload.json') / 1024:.1f} KB")
