#!/usr/bin/env python3
import os

# Fix the space issue in EJS files
files_to_fix = [
    'views/index.ejs',
    'views/post.ejs',
    'views/admin/edit-post.ejs'
]

for filepath in files_to_fix:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace 'layouts /' with 'layouts/'
        # Replace '.. /' with '../'
        original_content = content
        content = content.replace("layouts /", "layouts/")
        content = content.replace(".. /", "../")
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'✅ Fixed: {filepath}')
        else:
            print(f'✔️  Already correct: {filepath}')
    else:
        print(f'❌ Not found: {filepath}')

print('\nDone! Restart your server with: npm start')
