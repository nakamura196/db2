import pandas as pd
from rdflib import URIRef, BNode, Literal, Graph
from rdflib.namespace import RDF, RDFS, FOAF, XSD
from rdflib import Namespace
import numpy as np
import math
import sys
import argparse
import json
import html

with open("data/itaiji.json") as f:
    dd = json.load(f)


def itaiji(data):
    for key in dd:
        for v in dd[key]:
            data = data.replace(v, key)

    return data

#####

with open("../static/data.json") as f:
    df = json.load(f)

actions = []

for item in df:

    基 = item["ex:基本情報"][0]
    経典 = 基["ex:経典"][0]

    勘同目録 = item["ex:勘同目録"][0]

    脚注 = item["ex:脚注"][0]

    item2 = {
        "objectID": item["ex:基本情報"][0]["ex:No."],
        "label": item["ex:基本情報"][0]["ex:経典"][0]["ex:経典名"],
        
        
        "No.": int(item["ex:基本情報"][0]["ex:No."]),
        

        "基-経典番号": 経典["ex:経典番号"],
        "基-枝番": 経典["ex:枝番"],
        "基-経典名": 経典["ex:経典名"],
        "基-収録巻次": 経典["ex:収録巻次"],
        "基-部門": 経典["ex:部門"],
        "基-配本": 経典["ex:配本"],
        "基-年月日": 経典["ex:出版年月日"],

        "sat_uri": item["ex:sat"][0]["ex:url"],
        
        "勘-底本/校本": item["ex:勘同目録"][0]["ex:底本/校本"] if "ex:底本/校本" in item["ex:勘同目録"][0] else [],

        "勘-❹": 勘同目録["ex:❹"] if "ex:❹" in 勘同目録 else [],
        
    }

    texts_k = item["ex:勘同目録"][0]["ex:texts"]
    
    q_texts_k = []
    for text in texts_k:
        name = text["ex:標準名称"]
        if name not in q_texts_k:
            q_texts_k.append(name)
    item2["勘同目録-テキスト"] = q_texts_k

    ####

    texts_f = item["ex:脚注"][0]["ex:texts"]

    q_texts_f = []
    for text in texts_f:
        name = text["ex:標準名称"]
        if name not in q_texts_f:
            q_texts_f.append(name)
    item2["脚注-テキスト"] = q_texts_f

    if "ex:❼" in 勘同目録:
        item2["勘-❼"] = 勘同目録["ex:❼"]

    if "ex:❼備考" in 勘同目録:
        item2["勘-備考❼"] = 勘同目録["ex:❼備考"]

    if "ex:❼備考" in 勘同目録:
        item2["勘-備考❼"] = 勘同目録["ex:❼備考"]

    '''
    '''

    if "ex:底本/校本" in 脚注:
        item2["脚-底本/校本"] = 脚注["ex:底本/校本"]

    if "ex:新添" in 脚注:
        item2["脚-新添部分"] = 脚注["ex:新添"]

    if "ex:テキスト" in 脚注:
        item2["脚-テキスト"] = 脚注["ex:テキスト"]

    if "ex:備考" in 脚注:
        item2["脚-備考"] = 脚注["ex:備考"]

    '''

    if not pd.isnull(df.iloc[j, 18]):
        qdata["脚-底本/校本"] = df.iloc[j, 18]

    if not pd.isnull(df.iloc[j, 19]):
        qdata["脚-新添部分"] = df.iloc[j, 19]

    if not pd.isnull(df.iloc[j, 20]):
        qdata["脚-テキスト"] = df.iloc[j, 20]

    if not pd.isnull(df.iloc[j, 21]):
        qdata["脚-備考"] = df.iloc[j, 21]

    '''

    yus = item["ex:酉目"]

    # qdata["酉目"] = []
    item2["酉目"] = []

    if len(yus) > 0:
        
        arr = item2["酉目"]

        for obj in yus:
            '''
            arr.append({
                "id" : obj["ex:通番"],
                "url" : obj["ex:url"]
            })
            '''
            arr.append(obj["ex:url"])

    '''

    if len(yus) > 0:
        qdata["酉目"] = []
        for obj in yus:
            qdata["酉目"].append(obj["ex:通番"])

    '''

    yu_i = item["ex:酉蓮社本IIIコレクション"]

    
    item2["酉蓮社本IIIFコレクション"] = []

    if len(yu_i) > 0:
        arr =item2["酉蓮社本IIIFコレクション"]

        for obj in yu_i:
            
            arr.append({
                "label" : obj["ex:経典名"],
                "url" : obj["ex:url"]
            })

    '''

    if len(yu_i) > 0:
        qdata["酉蓮社本IIIコレクション_経典名"] = []
        qdata["酉蓮社本IIIコレクション_画像フォルダ"] = []
        qdata["酉蓮社本IIIコレクション_from"] = []
        for obj in yu_i:
            qdata["酉蓮社本IIIコレクション_経典名"].append(obj["ex:経典名"])
            qdata["酉蓮社本IIIコレクション_画像フォルダ"].append(obj["ex:画像フォルダ"])
            qdata["酉蓮社本IIIコレクション_from"].append(obj["ex:from"])

    if not pd.isnull(df.iloc[j, 126]):
        qdata["画像"] = "あり"

    # search.append(qdata)



    with open("../static/data.json", 'w') as f:
        json.dump(data, f, ensure_ascii=False, indent=4,
        sort_keys=True, separators=(',', ': '))

    '''

    if len(item2["酉蓮社本IIIFコレクション"]) > 0:
        item2["画像"] = "あり"
    else:
        item2["画像"] = "なし"

    fulltext = ""
    for key in item2:
        if key in ["画像"]:
            continue

        value = item2[key]

        if type(value) is str:

            if "http" in value:
                continue

            fulltext += ", " + value

    for obj in item2["酉蓮社本IIIFコレクション"]:
        fulltext += ", " + obj["label"]

    # 変換
    fulltext = itaiji(fulltext)

    item2["fulltext"] = fulltext

    actions.append(item2)
    
with open("../static/index.json", 'w') as f:
    json.dump(actions, f, ensure_ascii=False, indent=4,
    sort_keys=True, separators=(',', ': '))