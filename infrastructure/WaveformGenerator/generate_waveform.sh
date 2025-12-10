#!/bin/bash
# Requires: audiowaveform and ffmpeg installed on the system
# Usage: ./generate_waveform.sh input.mp3 output.png
IN="$1"
OUT="$2"
if [ -z "$IN" ] || [ -z "$OUT" ]; then
  echo "Usage: $0 input.mp3 output.png"
  exit 1
fi
# Generate waveform png (requires audiowaveform)
audiowaveform -i "$IN" -o waveform.png --pixels-per-second 10 --height 135
mv waveform.png "$OUT"
echo "Generated $OUT"
