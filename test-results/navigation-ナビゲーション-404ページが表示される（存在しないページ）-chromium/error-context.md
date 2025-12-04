# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e5]:
        - link "個人ブログ" [ref=e6] [cursor=pointer]:
          - /url: /
        - generic [ref=e7]:
          - textbox "記事を検索..." [ref=e8]
          - button "検索" [ref=e9] [cursor=pointer]
    - main [ref=e10]:
      - generic [ref=e11]:
        - heading "404" [level=1] [ref=e12]
        - paragraph [ref=e13]: ページが見つかりませんでした
        - link "トップページに戻る" [ref=e14] [cursor=pointer]:
          - /url: /
    - contentinfo [ref=e15]:
      - paragraph [ref=e17]: © 2025 個人ブログサイト. All rights reserved.
  - alert [ref=e18]
```