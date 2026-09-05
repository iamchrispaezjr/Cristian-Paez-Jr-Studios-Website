#!/usr/bin/env python3
"""Fetch the channel's newest upload into youtube-latest.json (GitHub Action)."""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

CHANNEL_ID = "UCWYtgKKmHAml5dol4--5GJQ"
UPLOADS_PLAYLIST_ID = "UU" + CHANNEL_ID[2:]
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "youtube-latest.json"
API = "https://www.googleapis.com/youtube/v3/playlistItems"


def fail(message: str, code: int = 1) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(code)


def main() -> None:
    api_key = (os.environ.get("YOUTUBE_API_KEY") or "").strip()
    if not api_key:
        fail("Missing YOUTUBE_API_KEY secret.")

    query = urllib.parse.urlencode(
        {
            "part": "snippet,contentDetails",
            "playlistId": UPLOADS_PLAYLIST_ID,
            "maxResults": "1",
            "key": api_key,
        }
    )
    url = API + "?" + query

    try:
        with urllib.request.urlopen(url, timeout=30) as response:
            payload = json.load(response)
    except urllib.error.HTTPError as err:
        body = err.read().decode("utf-8", errors="replace")
        fail("YouTube API HTTP %s: %s" % (err.code, body))
    except urllib.error.URLError as err:
        fail("YouTube API request failed: %s" % err)

    items = payload.get("items") or []
    if not items:
        fail("YouTube API returned no uploads.")

    item = items[0]
    snippet = item.get("snippet") or {}
    details = item.get("contentDetails") or {}
    video_id = (details.get("videoId") or snippet.get("resourceId", {}).get("videoId") or "").strip()
    if not video_id:
        fail("Could not read videoId from API response.")

    title = (snippet.get("title") or "").strip()
    published = (
        details.get("videoPublishedAt") or snippet.get("publishedAt") or ""
    ).strip()

    data = {
        "channelId": CHANNEL_ID,
        "videoId": video_id,
        "title": title,
        "publishedAt": published,
        "url": "https://www.youtube.com/watch?v=" + video_id,
        "updatedAt": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
    }

    previous = {}
    if OUT.exists():
        try:
            previous = json.loads(OUT.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            previous = {}

    OUT.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    print("Wrote %s" % OUT)
    print("videoId=%s title=%s" % (video_id, title))

    if previous.get("videoId") == video_id:
        print("No change in latest video id.")
    else:
        print("Latest video id changed.")


if __name__ == "__main__":
    main()
