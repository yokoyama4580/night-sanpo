#suggest_theme.py
import google.generativeai as genai
from .tag_map import osm_tag_map
from .settings import API_KEY
import logging
import json

genai.configure(api_key=API_KEY)

# 推論用プロンプトテンプレート
PROMPT_TEMPLATE = """
あなたは、ユーザーの文章から心理的なニーズ（感情的・身体的欲求）を読み取り、
それに合致する環境心理のカテゴリ（最大3つ）を選ぶアシスタントです。

以下は、環境心理に基づく心理的ニーズのカテゴリです。
ユーザーが「どんな状態で、何を求めているのか」に基づいて、最も当てはまるカテゴリを1〜3個選んでください。

### 心理ニーズ一覧：

- ease（落ち着きたい）
  → 心を落ち着かせたい
  → 対応する気分語例：「そわそわする」「落ち着かない」「不安を感じる」「緊張する」「考えがまとまらない」

- mollify（苛立ちを鎮めたい）
  → 怒りを鎮めたい
  → 対応する気分語例：「イライラする」「腹が立つ」「怒りが収まらない」

- restore（癒したい・回復したい）
  → 精神的・身体的に疲れていて、エネルギーを回復したい
  → 対応する気分語例：「今日はすごく疲れた」「何もする気が起きない」「頭が回らない」「頭がぼーっとする」「体が重い」「疲れが取れない」

- liberate（逃れたい・解放されたい）
  → 閉塞感や圧迫感、ストレス源から離れ、解放されたい、一時的に現実を忘れたい
  → 対応する気分語例：「息が詰まる」「逃げ出したい」「人間関係に疲れた」「苦しい」「つらい」「肩身がせまい」「居場所がない」

- connect（つながりたい）
  → 自分以外との関係性（人・社会）を感じたい
  → 対応する気分語例：「寂しい」「孤独」「誰かといたい」「愛されたい」「悲しい」

- discover（発見したい）
  → 新鮮な刺激や未知の景色を見たい
  → 対応する気分語例：「飽きた」「退屈」「冒険したい」「刺激が足りない」「つまらない」

- belong（馴染みたい）
  → 親しみのある場所・状況に身を置いて安心したい  
  → 対応する気分語例：「知らない場所は不安」「慣れた場所がいい」「迷いたくない」「安心できる道がいい」


---

### 入力文（ユーザーの日記）：
「{user_input}」

この文章から、ユーザーの状態や求めているものを読み取り、
上記カテゴリの中から最も当てはまるものを1〜3個、Pythonのlist[str]形式で出力してください。
なぜそのカテゴリを選んだのか，ユーザーにどのようになってほしいのかを文章で出力してください
最後は「〜散歩ルートを提案します。」で閉めてください。

### 出力形式：
```json
{{
  "categories": ["mollify", "liberate"],
  "comment": "あなたは日々のストレスから、自然の中で静かに過ごして癒されたいと感じているのではないでしょうか。"
}}
```
出力されるcomment文は以下の構成を参考にしてください：

- 1文目：ユーザーの体験や出来事から読み取れる感情（例：「〜な出来事から、〜と感じているようです。」）
- 2文目：その背景にある心理的欲求の推測（例：「〜したいという気持ちがあるのではないでしょうか。」）
- 3文目：そのニーズに応じた環境的な提案（例：「〜なので、〜（ができる / 促される / に効果がある）散歩ルートを提案致します。」）

全体を通じて、「〜ようです」「〜ではないでしょうか」など丁寧な推測表現と、「〜を提案します」「〜が役立ちます」といった控えめな締め方を心がけてください。
※出力は上記のJSON形式だけにしてください。解説や補足は不要です。
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
    print(response.text)
    clean_output = extract_code_block(response.text)
    try:
        parsed_json = json.loads(clean_output)
        return parsed_json
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