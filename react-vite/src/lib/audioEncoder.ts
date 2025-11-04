/**
 * Audio encoding utilities for converting audio to MP3 format
 * Uses lamejs for MP3 encoding
 */

// @ts-ignore - @breezystack/lamejs has better ES module support
import * as lamejs from "@breezystack/lamejs";

export interface EncodingProgress {
  percent: number;
  stage: string;
}

/**
 * Convert an audio blob to WAV format (if needed)
 */
async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

/**
 * Decode audio data to get PCM samples
 */
async function decodeAudioData(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
  const audioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)();
  return await audioContext.decodeAudioData(arrayBuffer);
}

/**
 * Convert Float32Array to Int16Array for MP3 encoding
 */
function floatTo16BitPCM(float32Array: Float32Array): Int16Array {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return int16Array;
}

/**
 * Encode audio buffer to MP3
 */
export async function encodeToMP3(
  audioBuffer: AudioBuffer,
  onProgress?: (progress: EncodingProgress) => void
): Promise<Blob> {
  const channels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const samples = audioBuffer.length;

  onProgress?.({ percent: 10, stage: "Preparing audio data..." });

  // Get channel data
  const leftChannel = audioBuffer.getChannelData(0);
  const rightChannel =
    channels > 1 ? audioBuffer.getChannelData(1) : leftChannel;

  // Convert to 16-bit PCM
  const leftPCM = floatTo16BitPCM(leftChannel);
  const rightPCM = floatTo16BitPCM(rightChannel);

  onProgress?.({ percent: 30, stage: "Initializing MP3 encoder..." });

  // Validate lamejs is loaded
  if (!lamejs || !lamejs.Mp3Encoder) {
    throw new Error(
      "lamejs library not loaded correctly. Mp3Encoder not found."
    );
  }

  // Initialize MP3 encoder
  const mp3Encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128); // 128 kbps bitrate
  if (!mp3Encoder) {
    throw new Error("Failed to initialize MP3 encoder");
  }
  const mp3Data: Int8Array[] = [];

  // Encode in chunks
  const chunkSize = 1152; // Standard MP3 frame size
  const totalChunks = Math.ceil(samples / chunkSize);

  for (let i = 0; i < samples; i += chunkSize) {
    const leftChunk = leftPCM.subarray(i, i + chunkSize);
    const rightChunk = rightPCM.subarray(i, i + chunkSize);

    const mp3buf = mp3Encoder.encodeBuffer(leftChunk, rightChunk);
    if (mp3buf.length > 0) {
      // @ts-ignore
      mp3Data.push(mp3buf);
    }

    // Report progress
    const chunkIndex = Math.floor(i / chunkSize);
    const percent = 30 + Math.floor((chunkIndex / totalChunks) * 60);
    onProgress?.({
      percent,
      stage: `Encoding... ${chunkIndex}/${totalChunks}`,
    });
  }

  // Flush remaining data
  onProgress?.({ percent: 90, stage: "Finalizing MP3..." });
  const mp3buf = mp3Encoder.flush();
  if (mp3buf.length > 0) {
    // @ts-ignore
    mp3Data.push(mp3buf);
  }

  onProgress?.({ percent: 100, stage: "Complete!" });

  // Create blob from MP3 data
  // Concatenate all Int8Array chunks into a single Uint8Array
  const totalLength = mp3Data.reduce((sum, chunk) => sum + chunk.length, 0);
  const combinedArray = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of mp3Data) {
    combinedArray.set(chunk, offset);
    offset += chunk.length;
  }

  const mp3Blob = new Blob([combinedArray], { type: "audio/mpeg" });
  return mp3Blob;
}

/**
 * Convert an audio blob to MP3 format
 * @param blob - The audio blob to convert
 * @param onProgress - Progress callback
 * @param startTime - Optional start time in seconds for slicing
 * @param endTime - Optional end time in seconds for slicing
 */
export async function convertBlobToMP3(
  blob: Blob,
  onProgress?: (progress: EncodingProgress) => void,
  startTime?: number,
  endTime?: number
): Promise<Blob> {
  try {
    onProgress?.({ percent: 0, stage: "Reading audio file..." });

    // Convert blob to array buffer
    const arrayBuffer = await blobToArrayBuffer(blob);

    onProgress?.({ percent: 5, stage: "Decoding audio..." });

    // Decode audio data
    let audioBuffer = await decodeAudioData(arrayBuffer);

    // Slice audio if time range is provided
    if (startTime !== undefined && endTime !== undefined) {
      onProgress?.({ percent: 10, stage: "Slicing audio..." });
      audioBuffer = sliceAudioBuffer(audioBuffer, startTime, endTime);
    }

    // Encode to MP3
    const mp3Blob = await encodeToMP3(audioBuffer, onProgress);

    return mp3Blob;
  } catch (error) {
    console.error("Error converting to MP3:", error);
    throw new Error("Failed to convert audio to MP3");
  }
}

/**
 * Slice an audio buffer
 */
export function sliceAudioBuffer(
  audioBuffer: AudioBuffer,
  startTime: number,
  endTime: number
): AudioBuffer {
  const sampleRate = audioBuffer.sampleRate;
  const channels = audioBuffer.numberOfChannels;

  const startSample = Math.floor(startTime * sampleRate);
  const endSample = Math.floor(endTime * sampleRate);
  const length = endSample - startSample;

  // Create new audio buffer
  const audioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)();
  const newBuffer = audioContext.createBuffer(channels, length, sampleRate);

  // Copy channel data
  for (let channel = 0; channel < channels; channel++) {
    const sourceData = audioBuffer.getChannelData(channel);
    const newData = newBuffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      newData[i] = sourceData[startSample + i];
    }
  }

  return newBuffer;
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}
