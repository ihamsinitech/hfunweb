import React from "react";
import "../App.css";
import introVideo from "./assets/intro.mp4";

export default function IntroVideo() {
  return (
    <div className="video-intro">
      <video
        src={introVideo}
        autoPlay
        muted
        playsInline
      />

      {/* FLOATING TEXT */}
      <div className="video-overlay">
        <h1 className="float-text">Welcome to HFUN</h1>
        <p className="float-subtext">Scroll. Smile. Repeat.</p>
      </div>
    </div>
  );
}
