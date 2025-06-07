import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'app')))

from app.api import app  # ← 修正
app.run(port=8000, debug=True)