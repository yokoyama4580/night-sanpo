#suggest_theme.py

import google.generativeai as genai
from .tag_map import psychological_tag_map
from .settings import API_KEY
import logging

genai.configure(api_key=API_KEY)
category_list=list(psychological_tag_map.keys())

# 推論用プロンプトテンプレート
PROMPT_TEMPLATE = """
あなたは、散歩ルートを心理的に心地よいものに調整するためのアシスタントです。

以下は、環境心理学に基づく6つの空間カテゴリとその心理効果です：

- nature_connection（自然との接触）: 木々や水辺といった自然要素はストレスを軽減し、精神的な回復を促します。
- openness（開放性）: 広い視野を確保できる空間は安心感や解放感をもたらします。
- safety_refuge（安全・安心）: 静かで安全な空間は緊張を和らげ、心理的な落ち着きを生みます。
- attention_restoration（注意の回復）: 落ち着いた公園やベンチなどは、精神的疲労からの回復を助けます。
- exploration_diversity（探索・多様性）: 少しの冒険心や発見を刺激する道は、気分をリフレッシュします。
- legibility（わかりやすさ・親しみ）: 分かりやすく構造化された空間は安心感とルート理解のしやすさにつながります。

ユーザーの発話：「{user_input}」

この発話に基づいて、ユーザーの心理状態を読み解き，
上記心理効果を参考にしてその人にとって効果があるカテゴリを1〜3個以下のカテゴリリストから厳密に選んでください．

##カテゴリリスト
{categories}

##重要
プロンプトの出力は選んだカテゴリ(List[str])のみにしてください．
"""

def extract_code_block(text: str) -> str:
    """Geminiなどの出力から不要なコードブロックマークを除去する"""
    if text.startswith("```"):
        return "\n".join(line for line in text.splitlines() if not line.strip().startswith("```")).strip()
    return text.strip()

def predict_categories(user_input: str) -> list:
    prompt = PROMPT_TEMPLATE.format(categories=", ".join(category_list), user_input=user_input)
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    clean_output = extract_code_block(response.text)
    try:
        return eval(clean_output)
    except:
        logging.error(f"出力のパースに失敗")
 
def get_tag_score_list(categories: list) -> list:
    return [entry for cat in categories for entry in psychological_tag_map.get(cat, [])]


if __name__=="__main__":
    # 推論と使用例
    user_input = "わくわくしています．全く疲れてない"
    categories = predict_categories(user_input)
    print("カテゴリ:", categories)

    tag_score_list = get_tag_score_list(categories)
    print("タグスコアリスト:", tag_score_list)