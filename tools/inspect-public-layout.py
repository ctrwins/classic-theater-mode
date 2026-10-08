"""Read public YouTube code only. No browser profiles, cookies or account data."""
import json
import re
from pathlib import Path
import requests

root = Path(__file__).resolve().parents[1]
page = requests.get('https://www.youtube.com/watch?v=ZK3U92URi_c', timeout=30)
page.raise_for_status()
scripts = re.findall(r'<script[^>]+src="([^"]+)"', page.text)
url = next(u for u in scripts if 'kevlar_base_module' in u)
response = requests.get(url, timeout=40)
response.raise_for_status()
text = response.text
needles = ['web_watch_theater_chat', 'kevlar_watch_grid', 'is-watch-grid', 'is-two-columns_', 'i-max-theater-mode', 'is-mweb-watch', 'web_watch_rounded_player_large', 'web_watch_']
excerpts = {}
for needle in needles[:-1]:
    hits = list(re.finditer(re.escape(needle), text))
    excerpts[needle] = [text[max(0,m.start()-250):m.end()+300] for m in hits[:8]]
flags = sorted(set(re.findall(r'"([a-z_]*(?:theater|watch_grid|watch_panel|watch_layout|watch_page|mweb_watch)[a-z_]*)"', text)))
result = {'source': url, 'flags': flags, 'excerpts': excerpts}
(root / 'research').mkdir(exist_ok=True)
(root / 'research/public-layout.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(result, ensure_ascii=True, indent=2))
