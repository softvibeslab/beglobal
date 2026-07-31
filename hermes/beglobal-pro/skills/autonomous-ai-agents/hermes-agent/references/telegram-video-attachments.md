# Telegram video attachment troubleshooting

Session learning: Telegram video messages can be received and cached even when the agent appears not to “detect” the video content.

Useful investigation pattern:

1. Check gateway logs for lines like:
   - `Cached user video at .../cache/videos/video_<id>.mp4`
   - `Cached user video document at .../cache/videos/video_<id>.mp4`
2. If those lines exist, Telegram ingestion is working. The issue is likely the downstream preprocessing path.
3. Current gateway behavior observed in this codebase:
   - images are routed to native vision or `vision_analyze`
   - audio/voice is routed to STT transcription
   - documents get file/document handling
   - video files may be cached as media but are not necessarily automatically converted into frame/audio analysis before the model sees the user message
4. User-facing explanation should distinguish clearly:
   - “Telegram did receive and cache the video”
   - “the analysis pipeline did not automatically turn that video into visual/audio context for the model”
5. Durable fix pattern to implement when needed:
   - preserve `event.media_urls` for video events
   - collect video paths alongside image/audio paths
   - run video analysis or extract keyframes + audio transcript
   - prepend a concise video summary/transcript to `message_text`
   - add tests for captioned and captionless Telegram video messages

Do not record this as “video tools do not work.” The durable lesson is the diagnostic split between platform ingestion and model-visible preprocessing.
