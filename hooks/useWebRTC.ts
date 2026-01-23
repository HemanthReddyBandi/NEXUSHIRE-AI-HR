import { useState, useCallback, useRef, useEffect } from 'react';
import WebRTCService from '../services/webrtcService';

export interface UseInterviewHookReturn {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  startCall: () => Promise<MediaStream | null>;
  answerCall: (offer: RTCSessionDescriptionInit) => Promise<void>;
  endCall: () => void;
  sendMessage: (message: string) => void;
  connectionState: RTCPeerConnectionState | null;
}

export const useWebRTC = (): UseInterviewHookReturn => {
  return useWebRTCInterview();
};

export const useWebRTCInterview = (): UseInterviewHookReturn => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState | null>(null);

  const webrtcServiceRef = useRef<WebRTCService | null>(null);

  // Initialize WebRTC service
  useEffect(() => {
    webrtcServiceRef.current = new WebRTCService();

    return () => {
      webrtcServiceRef.current?.close();
    };
  }, []);

  const startCall = useCallback(async (): Promise<MediaStream | null> => {
    if (!webrtcServiceRef.current) {
      setError('WebRTC service not initialized');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Initialize peer connection
      webrtcServiceRef.current.initializePeerConnection();

      // Register callbacks
      webrtcServiceRef.current.onRemoteStream((stream) => {
        setRemoteStream(stream);
        setIsConnected(true);
      });

      webrtcServiceRef.current.onConnectionStateChange((state) => {
        setConnectionState(state);
        if (state === 'connected' || state === 'completed') {
          setIsConnected(true);
        } else if (state === 'failed' || state === 'disconnected' || state === 'closed') {
          setIsConnected(false);
        }
      });

      // Get user media
      const stream = await webrtcServiceRef.current.getUserMedia();
      setLocalStream(stream);
      setIsLoading(false);
      
      return stream;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start call';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, []);

  const answerCall = useCallback(
    async (offer: RTCSessionDescriptionInit) => {
      if (!webrtcServiceRef.current) {
        setError('WebRTC service not initialized');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Initialize peer connection if not already done
        if (!webrtcServiceRef.current) {
          webrtcServiceRef.current.initializePeerConnection();
        }

        // Register callbacks
        webrtcServiceRef.current.onRemoteStream((stream) => {
          setRemoteStream(stream);
          setIsConnected(true);
        });

        webrtcServiceRef.current.onConnectionStateChange((state) => {
          setConnectionState(state);
          if (state === 'connected' || state === 'completed') {
            setIsConnected(true);
          } else if (state === 'failed' || state === 'disconnected' || state === 'closed') {
            setIsConnected(false);
          }
        });

        // Get user media
        const stream = await webrtcServiceRef.current.getUserMedia();
        setLocalStream(stream);

        // Set remote description and create answer
        await webrtcServiceRef.current.setRemoteDescription(offer);

        setIsLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to answer call';
        setError(errorMessage);
        setIsLoading(false);
      }
    },
    []
  );

  const endCall = useCallback(() => {
    if (webrtcServiceRef.current) {
      webrtcServiceRef.current.close();
    }
    setLocalStream(null);
    setRemoteStream(null);
    setIsConnected(false);
    setConnectionState(null);
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (webrtcServiceRef.current) {
      webrtcServiceRef.current.sendMessage(message);
    }
  }, []);

  return {
    localStream,
    remoteStream,
    isConnected,
    isLoading,
    error,
    startCall,
    answerCall,
    endCall,
    sendMessage,
    connectionState,
  };
};

export default useWebRTCInterview;
