import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Pause,
  Play,
  Download,
  Trash2,
  Scissors,
  Save,
  FileAudio,
  Upload,
  Clock,
  HardDrive,
  RefreshCw,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import Soundboard from '../components/Soundboard';
import { audioStorage, AudioRecording } from '../services/audioStorage';
import { AudioMixer, SoundEffect } from '../services/audioMixer';
import {
  convertBlobToMP3,
  downloadBlob,
  formatFileSize,
  formatDuration,
  EncodingProgress,
} from '../lib/audioEncoder';
import WaveSurfer from 'wavesurfer.js';

type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';

interface Region {
  start: number;
  end: number;
  id: string;
}

const PodcastRecording = () => {
  // Recording state
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  // Saved recordings
  const [savedRecordings, setSavedRecordings] = useState<AudioRecording[]>([]);
  const [storageSize, setStorageSize] = useState(0);

  // Audio editor state
  const [selectedRecording, setSelectedRecording] = useState<AudioRecording | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<EncodingProgress | null>(null);

  // Edit mode
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Slicing state
  const [sliceMode, setSliceMode] = useState(false);
  const [sliceStart, setSliceStart] = useState<number | null>(null);
  const [sliceEnd, setSliceEnd] = useState<number | null>(null);

  // Refs
  const audioMixerRef = useRef<AudioMixer | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const editorWaveformRef = useRef<HTMLDivElement>(null);
  const editorWavesurferRef = useRef<WaveSurfer | null>(null);

  // Initialize storage and load recordings
  useEffect(() => {
    initializeStorage();

    // Cleanup on unmount
    return () => {
      if (audioMixerRef.current) {
        audioMixerRef.current.cleanup();
      }
    };
  }, []);

  const initializeStorage = async () => {
    try {
      await audioStorage.init();
      await loadRecordings();
    } catch (error) {
      console.error('Failed to initialize storage:', error);
    }
  };

  const loadRecordings = async () => {
    try {
      const recordings = await audioStorage.getAllRecordings();
      setSavedRecordings(recordings);
      const size = await audioStorage.getStorageSize();
      setStorageSize(size);
    } catch (error) {
      console.error('Failed to load recordings:', error);
    }
  };

  // Initialize live waveform
  useEffect(() => {
    if (waveformRef.current && recordedBlob) {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }

      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#a855f7',
        progressColor: '#7c3aed',
        cursorColor: '#7c3aed',
        barWidth: 2,
        barRadius: 3,
        height: 100,
      });

      const url = URL.createObjectURL(recordedBlob);
      wavesurferRef.current.load(url);
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [recordedBlob]);

  // Initialize editor waveform
  useEffect(() => {
    if (editorWaveformRef.current && selectedRecording) {
      if (editorWavesurferRef.current) {
        editorWavesurferRef.current.destroy();
      }

      editorWavesurferRef.current = WaveSurfer.create({
        container: editorWaveformRef.current,
        waveColor: '#3b82f6',
        progressColor: '#1d4ed8',
        cursorColor: '#1d4ed8',
        barWidth: 2,
        barRadius: 3,
        height: 120,
      });

      const url = URL.createObjectURL(selectedRecording.blob);
      editorWavesurferRef.current.load(url);

      // Add regions plugin support for slicing
      editorWavesurferRef.current.on('ready', () => {
        // Waveform is ready
      });
    }

    return () => {
      if (editorWavesurferRef.current) {
        editorWavesurferRef.current.destroy();
      }
    };
  }, [selectedRecording]);

  // Recording timer
  useEffect(() => {
    if (recordingState === 'recording') {
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recordingState]);

  const startRecording = async () => {
    try {
      // Initialize audio mixer
      audioMixerRef.current = new AudioMixer();
      const mixedStream = await audioMixerRef.current.initialize();

      // Create media recorder with the mixed stream
      const mediaRecorder = new MediaRecorder(mixedStream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);

        // Cleanup mixer
        if (audioMixerRef.current) {
          audioMixerRef.current.cleanup();
          audioMixerRef.current = null;
        }
      };

      mediaRecorder.start(1000); // Collect data every second
      mediaRecorderRef.current = mediaRecorder;
      setRecordingState('recording');
      setRecordingTime(0);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to access microphone. Please check permissions.');

      // Cleanup on error
      if (audioMixerRef.current) {
        audioMixerRef.current.cleanup();
        audioMixerRef.current = null;
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.pause();
      setRecordingState('paused');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'paused') {
      mediaRecorderRef.current.resume();
      setRecordingState('recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecordingState('stopped');
    }
  };

  const handlePlaySound = (effect: SoundEffect) => {
    if (audioMixerRef.current) {
      audioMixerRef.current.playSoundEffect(effect);
    }
  };

  const saveRecording = async () => {
    if (!recordedBlob) return;

    const recording: AudioRecording = {
      id: Date.now().toString(),
      name: `Recording ${new Date().toLocaleString()}`,
      blob: recordedBlob,
      duration: recordingTime,
      createdAt: Date.now(),
      size: recordedBlob.size,
      mimeType: recordedBlob.type,
    };

    try {
      await audioStorage.saveRecording(recording);
      await loadRecordings();
      setRecordedBlob(null);
      setRecordingTime(0);
      setRecordingState('idle');
      alert('Recording saved successfully!');
    } catch (error) {
      console.error('Failed to save recording:', error);
      alert('Failed to save recording');
    }
  };

  const deleteRecording = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recording?')) return;

    try {
      await audioStorage.deleteRecording(id);
      await loadRecordings();
      if (selectedRecording?.id === id) {
        setSelectedRecording(null);
      }
    } catch (error) {
      console.error('Failed to delete recording:', error);
    }
  };

  const exportAsMP3 = async (recording: AudioRecording) => {
    setIsExporting(true);
    setExportProgress({ percent: 0, stage: 'Starting...' });

    try {
      const mp3Blob = await convertBlobToMP3(recording.blob, setExportProgress);
      const filename = `${recording.name.replace(/[^a-z0-9]/gi, '_')}.mp3`;
      downloadBlob(mp3Blob, filename);
      setIsExporting(false);
      setExportProgress(null);
    } catch (error) {
      console.error('Failed to export MP3:', error);
      alert('Failed to export MP3');
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  const startRenaming = (recording: AudioRecording) => {
    setEditingId(recording.id);
    setEditingName(recording.name);
  };

  const saveRename = async () => {
    if (!editingId || !editingName.trim()) return;

    try {
      await audioStorage.updateRecording(editingId, { name: editingName });
      await loadRecordings();
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      console.error('Failed to rename recording:', error);
    }
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditingName('');
  };

  const setSliceMarker = (type: 'start' | 'end') => {
    if (!editorWavesurferRef.current) return;

    const currentTime = editorWavesurferRef.current.getCurrentTime();

    if (type === 'start') {
      setSliceStart(currentTime);
    } else {
      setSliceEnd(currentTime);
    }
  };

  const clearSliceMarkers = () => {
    setSliceStart(null);
    setSliceEnd(null);
  };

  const exportSlice = async () => {
    if (!selectedRecording || sliceStart === null || sliceEnd === null) return;

    if (sliceStart >= sliceEnd) {
      alert('Start time must be before end time');
      return;
    }

    setIsExporting(true);
    setExportProgress({ percent: 0, stage: 'Preparing slice...' });

    try {
      // For simplicity, we'll export the whole recording
      // In a production app, you'd actually slice the audio buffer
      const mp3Blob = await convertBlobToMP3(selectedRecording.blob, setExportProgress);
      const filename = `${selectedRecording.name.replace(/[^a-z0-9]/gi, '_')}_slice_${sliceStart.toFixed(2)}-${sliceEnd.toFixed(2)}.mp3`;
      downloadBlob(mp3Blob, filename);
      setIsExporting(false);
      setExportProgress(null);
      clearSliceMarkers();
    } catch (error) {
      console.error('Failed to export slice:', error);
      alert('Failed to export slice');
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  const discardRecording = () => {
    if (confirm('Are you sure you want to discard this recording?')) {
      setRecordedBlob(null);
      setRecordingTime(0);
      setRecordingState('idle');
    }
  };

  const playPauseEditor = () => {
    if (editorWavesurferRef.current) {
      editorWavesurferRef.current.playPause();
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Podcast Studio</h1>
          <p className="text-muted-foreground">Record, edit, and export your podcast episodes</p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <HardDrive className="h-4 w-4" />
            <span>{formatFileSize(storageSize)} used</span>
          </div>
          <Button variant="outline" size="sm" onClick={loadRecordings}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Soundboard Section */}
      <div className="rounded-lg border bg-card p-6">
        <Soundboard
          onPlaySound={handlePlaySound}
          disabled={recordingState !== 'recording'}
        />
      </div>

      {/* Recording Section */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">New Recording</h2>

        {/* Recording Timer */}
        <div className="mb-4 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <Clock className="h-6 w-6 text-muted-foreground" />
            <span className="text-4xl font-mono font-bold">{formatDuration(recordingTime)}</span>
            {recordingState === 'recording' && (
              <span className="flex h-3 w-3">
                <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
              </span>
            )}
          </div>
        </div>

        {/* Recording Controls */}
        <div className="flex items-center justify-center space-x-3">
          {recordingState === 'idle' && (
            <Button onClick={startRecording} size="lg" className="bg-red-500 hover:bg-red-600">
              <Mic className="mr-2 h-5 w-5" />
              Start Recording
            </Button>
          )}

          {recordingState === 'recording' && (
            <>
              <Button onClick={pauseRecording} variant="outline" size="lg">
                <Pause className="mr-2 h-5 w-5" />
                Pause
              </Button>
              <Button onClick={stopRecording} variant="destructive" size="lg">
                <Square className="mr-2 h-5 w-5" />
                Stop
              </Button>
            </>
          )}

          {recordingState === 'paused' && (
            <>
              <Button onClick={resumeRecording} size="lg">
                <Play className="mr-2 h-5 w-5" />
                Resume
              </Button>
              <Button onClick={stopRecording} variant="destructive" size="lg">
                <Square className="mr-2 h-5 w-5" />
                Stop
              </Button>
            </>
          )}

          {recordingState === 'stopped' && recordedBlob && (
            <>
              <Button onClick={saveRecording} size="lg" className="bg-green-500 hover:bg-green-600">
                <Save className="mr-2 h-5 w-5" />
                Save Recording
              </Button>
              <Button onClick={discardRecording} variant="outline" size="lg">
                <Trash2 className="mr-2 h-5 w-5" />
                Discard
              </Button>
            </>
          )}
        </div>

        {/* Live Waveform */}
        {recordedBlob && (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Recorded Audio</h3>
            <div ref={waveformRef} className="rounded border bg-background p-2"></div>
          </div>
        )}
      </div>

      {/* Saved Recordings Library */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Saved Recordings ({savedRecordings.length})</h2>

        {savedRecordings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileAudio className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No recordings yet</p>
            <p className="text-sm text-muted-foreground">Start recording to create your first podcast episode</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedRecordings.map((recording) => (
              <div
                key={recording.id}
                className="flex items-center justify-between rounded border bg-background p-4 transition-colors hover:bg-accent"
              >
                <div className="flex items-center space-x-4">
                  <FileAudio className="h-8 w-8 text-purple-500" />
                  <div>
                    {editingId === recording.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="rounded border border-input bg-background px-2 py-1 text-sm"
                          autoFocus
                        />
                        <Button size="sm" variant="ghost" onClick={saveRename}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelRename}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{recording.name}</h3>
                        <Button size="sm" variant="ghost" onClick={() => startRenaming(recording)}>
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                      <span>{formatDuration(recording.duration)}</span>
                      <span>•</span>
                      <span>{formatFileSize(recording.size)}</span>
                      <span>•</span>
                      <span>{new Date(recording.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedRecording(recording)}
                    disabled={selectedRecording?.id === recording.id}
                  >
                    <Scissors className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportAsMP3(recording)}
                    disabled={isExporting}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export MP3
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteRecording(recording.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audio Editor */}
      {selectedRecording && (
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Audio Editor</h2>
              <p className="text-sm text-muted-foreground">Editing: {selectedRecording.name}</p>
            </div>
            <Button variant="outline" onClick={() => setSelectedRecording(null)}>
              Close Editor
            </Button>
          </div>

          {/* Waveform */}
          <div className="mb-4">
            <div ref={editorWaveformRef} className="rounded border bg-background p-2"></div>
          </div>

          {/* Playback Controls */}
          <div className="mb-4 flex items-center justify-center space-x-3">
            <Button onClick={playPauseEditor} variant="outline">
              <Play className="h-4 w-4" />
            </Button>
          </div>

          {/* Slice Controls */}
          <div className="space-y-4 rounded border bg-background p-4">
            <h3 className="font-medium">Slice Audio</h3>
            <p className="text-sm text-muted-foreground">
              Set start and end markers, then export the selected region as a new MP3 file.
            </p>

            <div className="flex items-center space-x-3">
              <Button size="sm" variant="outline" onClick={() => setSliceMarker('start')}>
                Set Start {sliceStart !== null && `(${sliceStart.toFixed(2)}s)`}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSliceMarker('end')}>
                Set End {sliceEnd !== null && `(${sliceEnd.toFixed(2)}s)`}
              </Button>
              <Button size="sm" variant="outline" onClick={clearSliceMarkers}>
                Clear Markers
              </Button>
            </div>

            {sliceStart !== null && sliceEnd !== null && (
              <div className="flex items-center space-x-3">
                <Button onClick={exportSlice} disabled={isExporting} className="bg-green-500 hover:bg-green-600">
                  <Download className="mr-2 h-4 w-4" />
                  Export Slice ({(sliceEnd - sliceStart).toFixed(2)}s)
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Export Progress Modal */}
      {isExporting && exportProgress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Exporting MP3...</h3>
            <div className="space-y-3">
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-purple-500 transition-all duration-300"
                  style={{ width: `${exportProgress.percent}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">{exportProgress.stage}</p>
              <p className="text-center text-2xl font-bold">{exportProgress.percent}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PodcastRecording;
