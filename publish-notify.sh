#!/bin/bash
# publish-notify.sh - 브리핑 발행 + Slack 알림
# publish.sh 실행 후 Slack webhook으로 알림 전송
set -e

cd "$(dirname "$0")"

# 1. 배포
./publish.sh

# 2. Slack 알림
latest_file=$(ls -r src/content/ko/briefing-*.md 2>/dev/null | head -1)
if [ -z "$latest_file" ]; then
  exit 0
fi
latest_date=$(basename "$latest_file" | sed 's/briefing-//;s/.md//')

source .env 2>/dev/null
if [ -z "$SLACK_WEBHOOK_URL" ]; then
  echo "SLACK_WEBHOOK_URL not set. Skipping Slack notification."
  exit 0
fi

# 브리핑에서 주요 헤드라인 추출
headlines=$(grep -E '^### [0-9]+\.' "$latest_file" | sed 's/^### [0-9]*\. /- /' | head -6)
if [ -z "$headlines" ]; then
  headlines="- 새로운 브리핑이 발행되었습니다."
fi

payload=$(cat <<EOF
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "Claude Code 데일리 브리핑 - ${latest_date}"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*오늘의 주요 내용:*\n${headlines}"
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "전체 브리핑 보기"
          },
          "url": "https://claude-news.today/briefings/briefing-${latest_date}",
          "style": "primary"
        }
      ]
    }
  ]
}
EOF
)

response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$SLACK_WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  -d "$payload")

if [ "$response" = "200" ]; then
  echo "Slack notification sent."
else
  echo "Slack notification failed (HTTP ${response})."
fi
