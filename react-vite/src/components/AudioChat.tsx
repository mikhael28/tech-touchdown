import React, { useState, useEffect, useRef } from 'react';
import { Device, Call } from '@twilio/voice-sdk';
import { Mic, MicOff, Phone, PhoneCall, Users, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AudioChatProps {
  gameId: string;
  roomName: string;
  onParticipantCountChange?: (count: number) => void;
}

interface AudioChatState {
  isConnected: boolean;
  isConnecting: boolean;
  isMuted: boolean;
  volume: number;
  participantCount: number;
  error: string | null;
}

const AudioChat: React.FC<AudioChatProps> = ({
  gameId,
  roomName,
  onParticipantCountChange
}) => {
  const { user } = useAuth();
  const [device, setDevice] = useState<Device | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [state, setState] = useState<AudioChatState>({
    isConnected: false,
    isConnecting: false,
    isMuted: false,
    volume: 50,
    participantCount: 0,
    error: null
  });

  const deviceRef = useRef<Device | null>(null);
  const callRef = useRef<Call | null>(null);

  // Initialize Twilio Device
  useEffect(() => {
    let mounted = true;

    const initializeDevice = async () => {
      try {
        if (!user?.login) {
          setState(prev => ({ ...prev, error: 'User not authenticated' }));
          return;
        }

        // Get access token from backend
        const response = await fetch('http://localhost:3001/api/twilio/access-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identity: user.login,
            roomName: roomName
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to get access token: ${response.statusText}`);
        }

        const { token } = await response.json();

        if (!mounted) return;

        // Create and setup Twilio Device
        const twilioDevice = new Device(token, {
          logLevel: 'warn',
          // @ts-ignore
          codecPreferences: ['opus', 'pcmu'],
          enableRingingState: true
        });

        // Device event listeners
        twilioDevice.on('ready', () => {
          console.log('Twilio Device Ready');
          if (mounted) {
            setDevice(twilioDevice);
            deviceRef.current = twilioDevice;
            setState(prev => ({ ...prev, error: null }));
          }
        });

        twilioDevice.on('error', (error) => {
          console.error('Twilio Device Error:', error);
          if (mounted) {
            setState(prev => ({
              ...prev,
              error: `Device error: ${error.message}`,
              isConnecting: false
            }));
          }
        });

        twilioDevice.on('incoming', (incomingCall) => {
          console.log('Incoming call from:', incomingCall.parameters.From);
          // Auto-reject incoming calls for this conference setup
          incomingCall.reject();
        });

        // Register the device
        await twilioDevice.register();

      } catch (error) {
        console.error('Failed to initialize Twilio Device:', error);
        if (mounted) {
          setState(prev => ({
            ...prev,
            error: error instanceof Error ? error.message : 'Failed to initialize audio chat'
          }));
        }
      }
    };

    initializeDevice();

    return () => {
      mounted = false;
      if (deviceRef.current) {
        deviceRef.current.destroy();
      }
    };
  }, [user?.login, roomName]);

  // Join conference call
  const joinConference = async () => {
    if (!device || !user?.login) {
      setState(prev => ({ ...prev, error: 'Device not ready or user not authenticated' }));
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Make call to conference
      const params = {
        To: `conference:${roomName}`,
        From: user.login
      };

      const outgoingCall = await device.connect({ params });
      setCall(outgoingCall);
      callRef.current = outgoingCall;

      // Call event listeners
      outgoingCall.on('accept', () => {
        console.log('Call accepted');
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          participantCount: prev.participantCount + 1
        }));
        onParticipantCountChange?.(state.participantCount + 1);
      });

      outgoingCall.on('disconnect', () => {
        console.log('Call disconnected');
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          participantCount: Math.max(0, prev.participantCount - 1)
        }));
        setCall(null);
        callRef.current = null;
        onParticipantCountChange?.(Math.max(0, state.participantCount - 1));
      });

      outgoingCall.on('error', (error) => {
        console.error('Call error:', error);
        setState(prev => ({
          ...prev,
          error: `Call error: ${error.message}`,
          isConnected: false,
          isConnecting: false
        }));
        setCall(null);
        callRef.current = null;
      });

    } catch (error) {
      console.error('Failed to join conference:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to join conference',
        isConnecting: false
      }));
    }
  };

  // Leave conference
  const leaveConference = () => {
    if (call) {
      call.disconnect();
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (call) {
      const newMutedState = !state.isMuted;
      call.mute(newMutedState);
      setState(prev => ({ ...prev, isMuted: newMutedState }));
    }
  };

  // Set volume
  const setVolume = (volume: number) => {
    if (call) {
      // Twilio Voice SDK doesn't directly support output volume control
      // This would need to be implemented with Web Audio API
      setState(prev => ({ ...prev, volume }));
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (callRef.current) {
        callRef.current.disconnect();
      }
      if (deviceRef.current) {
        deviceRef.current.destroy();
      }
    };
  }, []);

  const getConnectionStatus = () => {
    if (state.isConnecting) return 'Connecting...';
    if (state.isConnected) return 'Connected';
    return 'Disconnected';
  };

  const getStatusColor = () => {
    if (state.isConnecting) return 'text-yellow-600';
    if (state.isConnected) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Voice Chat
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
            <div className={`w-2 h-2 rounded-full ${
              state.isConnected ? 'bg-green-500' :
              state.isConnecting ? 'bg-yellow-500' : 'bg-gray-400'
            }`} />
            <span>{getConnectionStatus()}</span>
          </div>
          {state.participantCount > 0 && (
            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
              <Users className="h-3 w-3" />
              <span>{state.participantCount}</span>
            </div>
          )}
        </div>
      </div>

      {state.error && (
        <div className="mb-4 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-400">
          {state.error}
        </div>
      )}

      <div className="space-y-3">
        {/* Connection Controls */}
        <div className="flex space-x-2">
          {!state.isConnected ? (
            <button
              onClick={joinConference}
              disabled={!device || state.isConnecting}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xs font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-1"
            >
              <PhoneCall className="h-3 w-3" />
              <span>{state.isConnecting ? 'Joining...' : 'Join Voice Chat'}</span>
            </button>
          ) : (
            <button
              onClick={leaveConference}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-1"
            >
              <Phone className="h-3 w-3" />
              <span>Leave Voice Chat</span>
            </button>
          )}
        </div>

        {/* Audio Controls */}
        {state.isConnected && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="flex items-center justify-between">
              <button
                onClick={toggleMute}
                className={`p-2 rounded-md transition-colors ${
                  state.isMuted
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
                title={state.isMuted ? 'Unmute' : 'Mute'}
              >
                {state.isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>

              <div className="flex items-center space-x-2 flex-1 ml-3">
                <VolumeX className="h-3 w-3 text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={state.volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="flex-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <Volume2 className="h-3 w-3 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {/* Room Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Room: {roomName}
        </div>
      </div>
    </div>
  );
};

export default AudioChat;