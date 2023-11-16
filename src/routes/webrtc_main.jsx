import React, { useEffect, useRef, useState } from "react";

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function WebRTCPage() {
  const [pc, setPc] = useState();
  const ws = useRef();
  const [roomId, setRoomId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [localDescription, setLocalDescription] = useState(null);
  const [offer, setOffer] = useState(null);
  const [offerCandidates, setOfferCandidates] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const webcamVideo = useRef();
  const remoteVideo = useRef();

  // Use the useEffect hook to setup the WebSocket connection and WebRTC peer connection when the component mounts
  useEffect(() => {
    setPc(new RTCPeerConnection(servers));
    ws.current = new WebSocket("ws://192.168.178.76:8080");

    ws.current.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    return () => {
      ws.current.close();
    };
  }, []); // Only run this hook once, when the component is first mounted

  // 1. Setup media sources
  const setupMedia = async () => {
    console.log("setup media");
    const local = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    const remote = new MediaStream();

    // Push tracks from local stream to peer connection
    local.getTracks().forEach((track) => {
      pc.addTrack(track, local);
    });

    // Pull tracks from remote stream, add to video stream
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remote.addTrack(track);
      });
    };

    setLocalStream(local);
    setRemoteStream(remote);
    // setWebcamButtonDisabled(true);
    // setCallButtonDisabled(false);
    // setAnswerButtonDisabled(false);
  };

  useEffect(() => {
    if (webcamVideo.current && localStream) {
      webcamVideo.current.srcObject = localStream;
    }
    if (remoteVideo.current && remoteStream) {
      remoteVideo.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  const createOffer = () => {
    // b1 creates offer and sents to ws thats saves in db
    pc.createOffer().then((offer) => {
      pc.setLocalDescription(offer);
      setLocalDescription(offer);
      setOffer({
        type: offer.type,
        sdp: offer.sdp,
      });
      ws.current.send(JSON.stringify(offer));
    });

    pc.onicecandidate = (event) => {
      console.log(event.candidate.toJSON());
      if (event.candidate) {
        ws.current.send(
          JSON.stringify({
            type: "setOfferCandidates",
            data: event.candidate.toJSON(),
          })
        );
      }
    };
  };

  const handleAnswer = (answer) => {
    // b1 gets answer back from b2
    console.log("set remote description");
    const answerDescription = new RTCSessionDescription(answer);
    pc.setRemoteDescription(answerDescription);
  };

  const handleAnswerCandidates = (answerCandidates) => {
    // b1 gets answer back from b2
    console.log("get answerCandidates", answerCandidates);
    // pc.addIceCandidate(new RTCIceCandidate(answerCandidates));
  };

  const handleOfferCandidates = (offerCandidates) => {
    // b1 sends candidates to b2
    console.log("get offerCandidates", offerCandidates);
    // pc.addIceCandidate(new RTCIceCandidate(offerCandidates));
  };

  const getDatabaseState = () => {
    ws.current.send(JSON.stringify({ type: "getDatabaseState" }));
  };

  const createAnswer = () => {
    ws.current.send(JSON.stringify({ type: "getOffer", roomId: roomId }));
  };

  const getOfferCandidates = () => {
    ws.current.send(JSON.stringify({ type: "getOfferCandidates" }));
  };

  useEffect(() => {
    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log("data", data);
      switch (data.type) {
        case "offer": {
          console.log("got offer", data);
          console.log("set remote description");
          pc.setRemoteDescription(new RTCSessionDescription(data));
          console.log("send answer");
          pc.createAnswer().then((answer) => {
            console.log("create answer", answer);
            console.log("set local description");
            pc.setLocalDescription(answer);
            ws.current.send(JSON.stringify(answer));
          });
          break;
        }
        case "answer": {
          // b1 gets answer back from b2
          console.log("get answer", data);
          handleAnswer(data);
          break;
        }
        case "answerCandidates": {
          console.log("got answerCandidates", data);
          pc.addIceCandidate(new RTCIceCandidate(data));
          break;
        }
        case "offerCandidates": {
          console.log("got offerCandidates", data);
          pc.addIceCandidate(new RTCIceCandidate(data.data));
          break;
        }
        case "getOfferCandidates": {
          console.log("get offerCandidates", data);
          for (const candidate of data.candidates) {
            pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
          break;
        }
        default: {
          break;
        }
      }
    };
  }, [ws.current]);

  return (
    <div>
      <h1>WebRTC Receiver</h1>
      <div className="m-5">
        <h1>local video</h1>
        <video ref={webcamVideo} autoPlay></video>
      </div>
      <div className="m-5">
        <h1>remote video</h1>
        <video ref={remoteVideo} autoPlay></video>
      </div>

      <p>{JSON.stringify(pc?.connectionState)}</p>
      <button
        className="p-1 rounded-md bg-gray-100 ring-1 ring-black m-2"
        onClick={() => createOffer()}
      >
        Create Offer
      </button>
      <button
        className="p-1 rounded-md bg-gray-100 ring-1 ring-black m-2"
        onClick={() => setupMedia()}
      >
        Start Webcam
      </button>
      <button
        className="p-1 rounded-md bg-gray-100 ring-1 ring-black m-2"
        onClick={() => getDatabaseState()}
      >
        Get DB State
      </button>
      <div>
        <input type="text" onChange={(e) => setRoomId(e.target.value)} />
      </div>
      <button
        className="p-1 rounded-md bg-gray-100 ring-1 ring-black m-2"
        onClick={() => createAnswer()}
      >
        Answer
      </button>
      <button
        className="p-1 rounded-md bg-gray-100 ring-1 ring-black m-2"
        onClick={() => getOfferCandidates()}
      >
        Get Offer Candidates
      </button>
    </div>
  );
}
