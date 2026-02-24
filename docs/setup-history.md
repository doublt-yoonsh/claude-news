# Claude News - 셋업 및 작업 히스토리

## 개요

Claude Code 관련 최신 정보를 매일 자동으로 수집하여 GitHub Pages로 공개하는 브리핑 사이트.

- **사이트**: https://doublt-yoonsh.github.io/claude-news/
- **레포**: https://github.com/doublt-yoonsh/claude-news
- **자동화**: runCLAUDErun (macOS 앱)으로 매일 스케줄 실행

## 아키텍처

```
runCLAUDErun (스케줄)
  → Claude Code (프롬프트 실행)
    → 웹 검색 (WebSearch/WebFetch)
    → 이전 브리핑 읽기 (Read, 중복 배제)
    → briefings/briefing-YYYY-MM-DD.md 저장 (Write)
    → publish.sh 실행 (Bash)
      → _sidebar.md 재생성
      → _coverpage.md 최신 링크 업데이트
      → index.html JS 날짜 업데이트
      → git add → commit → push
      → GitHub Pages 자동 배포
```

## 기술 스택

| 구성 요소 | 기술 | 이유 |
|----------|------|------|
| 정적 사이트 | Docsify v4 | 빌드 없음, CDN만 사용, md 파일만 추가하면 됨 |
| 테마 | docsify-themeable (simple-dark) | 다크 테마, 가독성 |
| 호스팅 | GitHub Pages | 무료, push만 하면 자동 배포 |
| 검색 | docsify search plugin | 클라이언트 사이드 전문 검색 |
| 스케줄러 | runCLAUDErun | macOS 네이티브, Claude Code 구독으로 동작 |

## 파일 구조

```
claude-news/
├── index.html          # Docsify SPA (테마, 플러그인, 커버 버튼 JS)
├── _coverpage.md       # 랜딩 페이지 (최신 브리핑 링크 자동 업데이트)
├── _sidebar.md         # 사이드바 네비게이션 (publish.sh가 자동 생성)
├── README.md           # 홈 페이지
├── .nojekyll           # GitHub Pages Jekyll 비활성화
├── .gitignore          # .DS_Store, .omc/ 제외
├── publish.sh          # 사이드바/커버/JS 업데이트 + git push 자동화
├── docs/
│   └── setup-history.md  # 이 파일
└── briefings/
    └── briefing-YYYY-MM-DD.md  # 일별 브리핑
```

## publish.sh 동작

1. `briefings/` 내 최신 파일 날짜 감지
2. `_sidebar.md` 재생성 (월별 그룹, 최신순)
3. `_coverpage.md`의 버튼 링크를 최신 날짜로 업데이트
4. `index.html`의 JS 플러그인 날짜를 최신으로 업데이트
5. `git add -A` → `git commit` → `git push origin main`

## runCLAUDErun 설정

| 항목 | 값 |
|-----|---|
| Model | Sonnet |
| Working Directory | `/Users/yoon/Desktop/OTTFStudio/claude-news` |
| Schedule | Daily |
| Allowed Tools | WebSearch, WebFetch, Read, Write, Bash |

## 프롬프트 주요 기능

- **중복 배제**: 최근 5개 브리핑 파일을 읽어 이미 다룬 주제 스킵
- **7일 제한**: 최근 7일 이내 발행된 글만 수집
- **필수 소스**: hada.io, GitHub anthropics/claude-code, Anthropic 공식 블로그
- **문체 가이드**: 해요체, 항목당 2문장, 출처는 화살표(→)로 분리
- **중복 실행 방지**: 오늘 파일이 이미 있으면 종료

## 작업 히스토리 (2026-02-24)

| 순서 | 작업 | 비고 |
|-----|------|------|
| 1 | Maestro + Claude Code 연동 가능성 조사 | MCP 서버 내장 확인 |
| 2 | Claude Code 스케줄 실행 방법 조사 | runCLAUDErun, claudecron 등 |
| 3 | runCLAUDErun 프롬프트 초안 작성 | 웹 검색 → md 저장 구조 |
| 4 | 첫 브리핑 생성 (briefing-2026-02-24.md) | runCLAUDErun으로 실행 |
| 5 | Docsify + GitHub Pages 사이트 구축 | 빌드 없는 정적 사이트 |
| 6 | GitHub 레포 생성 + Pages 활성화 | doublt-yoonsh/claude-news |
| 7 | 커버페이지 디자인 수정 | 다크 테마, 가독성 개선 |
| 8 | 버튼 클릭 이슈 수정 (3회) | CSS 선택자 → 절대 URL → 이벤트 캡처 |
| 9 | 검색 결과에 날짜 표시 | search depth: 1 |
| 10 | publish.sh 고도화 | 커버/JS 날짜 자동 업데이트 추가 |
| 11 | 프롬프트 문체 개선 | 해요체, 구조화된 항목 형식 |

## 알려진 제한사항

- runCLAUDErun은 맥이 켜져 있어야 동작
- 커버페이지 "최신 브리핑 보기" 버튼의 날짜는 publish.sh 실행 시 갱신됨
- 검색 인덱스는 클라이언트 사이드라 브리핑이 수백 개 쌓이면 초기 로드 느려질 수 있음
