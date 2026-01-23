/**
 * WebRTC Service
 * Handles peer-to-peer video/audio connection setup and management
 */

export interface WebRTCConfig {
  iceServers: RTCIceServer[];
  videoConstraints: MediaStreamConstraints;
  audioConstraints: MediaStreamConstraints;
}

export interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'start' | 'end';
  data?: any;
  from: string;
  to: string;
  sessionId: string;
}

export const DEFAULT_WEBRTC_CONFIG: WebRTCConfig = {
  iceServers: [
    { urls: ['stun:stun.l.google.com:19302'] },
    { urls: ['stun:stun1.l.google.com:19302'] },
    { urls: ['stun:stun2.l.google.com:19302'] },
    { urls: ['stun:stun3.l.google.com:19302'] },
    { urls: ['stun:stun4.l.google.com:19302'] },
  ],
  videoConstraints: {
    audio: true,
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 },
    },
  },
  audioConstraints: {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
    video: false,
  },
};

class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private config: WebRTCConfig;

  private onRemoteStreamCallback: ((stream: MediaStream) => void) | null = null;
  private onConnectionStateChangeCallback: ((state: RTCPeerConnectionState) => void) | null = null;
  private onIceCandidateCallback: ((candidate: RTCIceCandidate) => void) | null = null;
  private onDataChannelCallback: ((channel: RTCDataChannel) => void) | null = null;

  constructor(config: Partial<WebRTCConfig> = {}) {
    this.config = { ...DEFAULT_WEBRTC_CONFIG, ...config };
  }

  /**
   * Initialize peer connection
   */
  initializePeerConnection(): RTCPeerConnection {
    const peerConnection = new RTCPeerConnection({
      iceServers: this.config.iceServers,
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.onIceCandidateCallback?.(event.candidate);
      }
    };

    peerConnection.onconnectionstatechange = () => {
      this.onConnectionStateChangeCallback?.(peerConnection.connectionState);
    };

    peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      this.onRemoteStreamCallback?.(this.remoteStream);
    };

    peerConnection.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      this.setupDataChannel();
      this.onDataChannelCallback?.(event.channel);
    };

    this.peerConnection = peerConnection;
    return peerConnection;
  }

  /**
   * Get user media (camera and microphone)
   */
  async getUserMedia(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: this.config.audioConstraints.audio,
        video: this.config.videoConstraints.video,
      });

      this.localStream = stream;

      // Add tracks to peer connection
      if (this.peerConnection) {
        stream.getTracks().forEach((track) => {
          this.peerConnection!.addTrack(track, stream);
        });
      }

      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  /**
   * Create offer
   */
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      this.initializePeerConnection();
    }

    try {
      const offer = await this.peerConnection!.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });

      await this.peerConnection!.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  }

  /**
   * Create answer
   */
  async createAnswer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      this.initializePeerConnection();
    }

    try {
      const answer = await this.peerConnection!.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });

      await this.peerConnection!.setLocalDescription(answer);
      return answer;
    } catch (error) {
      console.error('Error creating answer:', error);
      throw error;
    }
  }

  /**
   * Set remote description
   */
  async setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      this.initializePeerConnection();
    }

    try {
      await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(description));
    } catch (error) {
      console.error('Error setting remote description:', error);
      throw error;
    }
  }

  /**
   * Add ICE candidate
   */
  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) {
      return;
    }

    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }

  /**
   * Create data channel
   */
  createDataChannel(label: string = 'chat'): RTCDataChannel {
    if (!this.peerConnection) {
      this.initializePeerConnection();
    }

    const channel = this.peerConnection!.createDataChannel(label);
    this.setupDataChannel(channel);
    this.dataChannel = channel;
    return channel;
  }

  /**
   * Setup data channel event listeners
   */
  private setupDataChannel(channel?: RTCDataChannel): void {
    const dc = channel || this.dataChannel;
    if (!dc) return;

    dc.onopen = () => {
      console.log('Data channel opened');
    };

    dc.onclose = () => {
      console.log('Data channel closed');
    };

    dc.onerror = (error) => {
      console.error('Data channel error:', error);
    };
  }

  /**
   * Send message via data channel
   */
  sendMessage(message: string): void {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(message);
    } else {
      console.warn('Data channel not ready');
    }
  }

  /**
   * Get local stream
   */
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  /**
   * Get remote stream
   */
  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  /**
   * Get connection state
   */
  getConnectionState(): RTCPeerConnectionState | null {
    return this.peerConnection?.connectionState || null;
  }

  /**
   * Register remote stream callback
   */
  onRemoteStream(callback: (stream: MediaStream) => void): void {
    this.onRemoteStreamCallback = callback;
  }

  /**
   * Register connection state change callback
   */
  onConnectionStateChange(callback: (state: RTCPeerConnectionState) => void): void {
    this.onConnectionStateChangeCallback = callback;
  }

  /**
   * Register ICE candidate callback
   */
  onIceCandidate(callback: (candidate: RTCIceCandidate) => void): void {
    this.onIceCandidateCallback = callback;
  }

  /**
   * Register data channel callback
   */
  onDataChannel(callback: (channel: RTCDataChannel) => void): void {
    this.onDataChannelCallback = callback;
  }

  /**
   * Stop all streams and close connection
   */
  close(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.remoteStream = null;
  }

  /**
   * Get connection statistics
   */
  async getStats(): Promise<RTCStatsReport> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }
    return await this.peerConnection.getStats();
  }
}

export default WebRTCService;
