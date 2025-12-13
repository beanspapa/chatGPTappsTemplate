# CLAUDE.md

## Project Overview
ChatGPT Apps SDK widget template - NBA 경기 결과 뷰어 컴포넌트

## Tech Stack
- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- Zod (스키마 검증)
- OpenAI Apps SDK UI

## Project Structure
```
frontend/examples/
├── src/
│   ├── game-result-viewer/        # 메인 게임 뷰어
│   │   ├── index.tsx              # 엔트리포인트
│   │   ├── types.ts               # 공통 타입
│   │   └── sports/
│   │       └── basketball/        # 농구 뷰어
│   │           ├── BasketballViewer.tsx
│   │           ├── types.ts
│   │           └── views/
│   │               ├── BeforeGame.tsx   # 경기전
│   │               ├── LiveGame.tsx     # 경기중
│   │               └── AfterGame.tsx    # 경기종료
│   └── index.css                  # 글로벌 스타일
├── index.html                     # 메인 HTML
├── test-basketball.html           # 경기종료 테스트
├── test-basketball-live.html      # 경기중 테스트
└── test-basketball-before.html    # 경기전 테스트
```

## Commands
```bash
# 개발 서버 (examples 폴더에서)
npm run dev -- --host

# 빌드
npm run build
```

## Key Patterns

### OpenAI Apps SDK 데이터 구조
```typescript
window.openai = {
  theme: 'light' | 'dark',
  toolOutput: GameData  // Zod 스키마로 검증됨
}
```

### 게임 상태별 뷰
- `경기전`: BeforeGame.tsx - 팀 프리뷰, 맞대결 기록
- `경기중`: LiveGame.tsx - 실시간 점수, 쿼터별 점수
- `경기종료`: AfterGame.tsx - 최종 결과, 선수 스탯

### 스타일링
- Tailwind CSS 클래스 사용
- 팀 컬러: LAL(#552583), GSW(#1D428A)
- body padding: 20px (index.css에서 관리)

## Notes
- 테스트 HTML 파일들은 mock 데이터를 window.openai에 주입
- 다크모드는 data-theme 속성으로 제어
