# tag_presets.py

safe_route = [
    ({"highway": "street_lamp"}, +8),         # 街灯がある場所は安全
    ({"highway": "traffic_signals"}, -5),     # 信号は少し避けたい
    ({"highway": "steps"}, -8),               # 階段は危ない
    ({"highway": "crossing"}, -4),            # 横断歩道も少し避けたい
]

scenic_route = [
    ({"natural": "wood"}, +10),               # 森は景観良し
    ({"natural": "water"}, +10),              # 水辺も魅力的
    ({"leisure": "park"}, +10),               # 公園も見どころ
    ({"tourism": "viewpoint"}, +15),          # 景勝地
]

comfortable_route = [
    ({"amenity": "bench"}, +8),               # 休憩できる
    ({"amenity": "toilets"}, +5),             # トイレ
    ({"leisure": "park"}, +10),               # 公園
    ({"highway": "residential"}, +4),         # 静かな道
    ({"highway": "steps"}, -10),              # 階段は避けたい
]

preset_map = {
    "default":[],
    "safety": safe_route,
    "scenic": scenic_route,
    "comfort": comfortable_route,
}
