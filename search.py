pip install requests beutifulsoup4

import requests
from bs4 import BeautifulSoup
import json

def crawl_recipes():
    url = "https://www.10000recipe.com/recipe/list.html"  # 만개의 레시피 목록 페이지
    headers = {
        "User-Agent": "Mozilla/5.0"  # 웹사이트에서 봇 차단을 방지하기 위한 헤더
    }
    
    response = requests.get(url, headers=headers)  # 웹페이지 요청
    soup = BeautifulSoup(response.text, "html.parser")  # HTML 파싱

    recipes = []  # 레시피 정보를 저장할 리스트
    
    # 레시피 리스트에서 각 항목을 선택
    for item in soup.select(".common_sp_list_ul .common_sp_list_li"):
        title = item.select_one(".common_sp_caption_tit").text.strip()  # 제목 가져오기
        description = item.select_one(".common_sp_caption_desc").text.strip()  # 설명 가져오기
        image = item.select_one(".common_sp_thumb img")["src"]  # 이미지 URL 가져오기
        link = "https://www.10000recipe.com" + item.select_one("a")["href"]  # 상세 페이지 링크 가져오기
        
        recipes.append({
            "title": title,
            "description": description,
            "image": image,
            "link": link
        })

    # JSON 파일로 저장
    with open("recipes.json", "w", encoding="utf-8") as f:
        json.dump(recipes, f, ensure_ascii=False, indent=4)
    
    print("✅ 레시피 데이터 저장 완료!")

# 함수 실행
crawl_recipes()
