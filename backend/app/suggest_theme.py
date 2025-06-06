#suggest_theme.py

import google.generativeai as genai
from .tag_map import osm_tag_map
from .settings import API_KEY
import logging

genai.configure(api_key=API_KEY)

# 推論用プロンプトテンプレート
PROMPT_TEMPLATE = """
あなたは、ユーザーの文章から心理的なニーズ（感情的・身体的欲求）を読み取り、
それに合致する環境心理のカテゴリ（最大3つ）を選ぶアシスタントです。

以下は、環境心理に基づく心理的ニーズのカテゴリです。
ユーザーが「どんな状態で、何を求めているのか」に基づいて、最も当てはまるカテゴリを1〜3個選んでください。

### 心理ニーズ一覧：

- calmness（落ち着き）: 騒がしい環境から離れ、静かに心を整えたい状態
- recovery（回復）: 肉体的・精神的な疲れから癒されたい状態
- safety（安心・安全）: 不安や緊張を避け、守られている感覚が欲しい状態
- freedom（開放感）: 圧迫感や閉塞感から解放され、自由を感じたい状態
- exploration（探索・刺激）: 退屈を避け、新鮮さや驚き、軽い冒険を求めている状態
- familiarity（親しみ）: 知っている場所や迷いにくい場所で安心したい状態
- nature_connection（自然とのつながり）: 緑や水、風など自然の要素と触れ合いたい気分

---

### 入力文（ユーザーの日記）：
「{user_input}」

この文章から、ユーザーの状態や求めているものを読み取り、
上記カテゴリの中から最も当てはまるものを1〜3個、Pythonのlist[str]形式で出力してください。

### 出力形式(例)：
["calmness", "recovery", "nature_connection"]

※出力は list[str] 形式のみ、理由説明や追加の文章は不要です。
"""

def extract_code_block(text: str) -> str:
    """Geminiなどの出力から不要なコードブロックマークを除去する"""
    if text.startswith("```"):
        return "\n".join(line for line in text.splitlines() if not line.strip().startswith("```")).strip()
    return text.strip()

def predict_categories(user_input: str) -> list:
    prompt = PROMPT_TEMPLATE.format(user_input=user_input)
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    clean_output = extract_code_block(response.text)
    try:
        return eval(clean_output)
    except:
        logging.error(f"出力のパースに失敗")
 
def get_tag_score_list(categories: list) -> list:
    return [entry for cat in categories for entry in osm_tag_map.get(cat, [])]


if __name__=="__main__":
    # 推論と使用例
    user_input = "わくわくしています．全く疲れてない"
    categories = predict_categories(user_input)
    print("カテゴリ:", categories)

    tag_score_list = get_tag_score_list(categories)
    print("タグスコアリスト:", tag_score_list)