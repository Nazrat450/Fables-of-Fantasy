import React, { useRef, useState, useEffect } from 'react';
import './BlacksmithMiniGame.css';
import Papa from 'papaparse';

const BAR_WIDTH = 500;
const BEAT_RADIUS = 24;
const HAMMER_ZONE = 80;
const TRACK_DURATION = 3;
const LANES = 4;
const LANE_KEYS = ['W', 'A', 'S', 'D'];
const LANE_KEYCODES = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
const LANE_Y = [8, 68, 128, 188];
const TRACK_HEIGHT = 240;
const SONG_START_BUFFER = 1.5;


export default function BlacksmithMiniGame({ onResult }) {
  const audioRef = useRef();
  const [trackName, setTrackName] = useState(null);
  const [beatTimes, setBeatTimes] = useState([]);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [hammerAnim, setHammerAnim] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const startTimestampRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);

  // Load track list and pick one at random
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/Rythem/tracks.json')
      .then(res => res.json())
      .then(list => {
        const pick = list[Math.floor(Math.random() * list.length)];
        setTrackName(pick);
      });
  }, []);

  // Load beat times for selected track
  useEffect(() => {
    if (!trackName) return;
    fetch(process.env.PUBLIC_URL + `/Rythem/${trackName}beat.csv`)
      .then(res => res.text())
      .then(text => {
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        const beats = parsed.data
          .map(row => {
            const timeKey = Object.keys(row).find(k => k.trim().toLowerCase() === 'time');
            const laneKey = Object.keys(row).find(k => k.trim().toLowerCase() === 'lane');
            const time = parseFloat(row[timeKey]);
            const lane = laneKey ? parseInt(row[laneKey]) : Math.floor(Math.random() * LANES);
            return { time, lane };
          })
          .filter(b => !isNaN(b.time) && b.lane >= 0 && b.lane < LANES);
        setBeatTimes(beats);
      })
      .catch(err => console.error("Beat file load error:", err));
  }, [trackName]);

  useEffect(() => {
    if (hammerAnim) {
      const timer = setTimeout(() => setHammerAnim(false), 300);
      return () => clearTimeout(timer);
    }
  }, [hammerAnim]);

  useEffect(() => {
    if (countdown === null || countdown === 0) return;
    const timer = setTimeout(() => {
      if (countdown === 1) {
        setCountdown(0);
        setStarted(true);
        setCurrentTime(-SONG_START_BUFFER);
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else {
        setCountdown(countdown - 1);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Calculate beat positions
  const beats = beatTimes
    .filter(beat => beat.time > (elapsed - SONG_START_BUFFER) && beat.time < (elapsed - SONG_START_BUFFER + TRACK_DURATION))
    .map(beat => {
      const progress = (TRACK_DURATION - (beat.time - (elapsed - SONG_START_BUFFER))) / TRACK_DURATION;
      const left = HAMMER_ZONE + (1 - progress) * (BAR_WIDTH - HAMMER_ZONE - BEAT_RADIUS);
      const top = LANE_Y[beat.lane];
      return { lane: beat.lane, left, top, time: beat.time };
    });

  const handleHammer = () => {
    setHammerAnim(true);
    const now = audioRef.current.currentTime;
    const isOnBeat = beatTimes.some(beat => Math.abs(now - beat.time) < 0.25);
    if (isOnBeat) {
      setScore(prev => prev + 1);
      setMessage("Great timing! 🔨");
      onResult?.(true);
    } else {
      setMessage("Missed the beat!");
      onResult?.(false);
    }
  };

  const handleStart = () => {
    setScore(0);
    setMessage('');
    setCountdown(5);
    setStarted(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  useEffect(() => {
  let raf;
  const update = () => {
    if (!startTimestampRef.current) return;
    const now = performance.now();
    const delta = (now - startTimestampRef.current) / 1000;
    setElapsed(delta);

    // Start audio after buffer time
    if (delta >= SONG_START_BUFFER && audioRef.current.paused) {
      audioRef.current.play();
    }

    raf = requestAnimationFrame(update);
  };
  if (started) {
    startTimestampRef.current = performance.now();
    raf = requestAnimationFrame(update);
  }
  return () => raf && cancelAnimationFrame(raf);
}, [started]);

  // Keyboard input handling
  useEffect(() => {
    if (!started) return;
    const handleKeyDown = (e) => {
  const laneIdx = LANE_KEYCODES.indexOf(e.code);
  if (laneIdx === -1) return;
  setHammerAnim(laneIdx);

  const now = audioRef.current?.currentTime;
  if (now == null) return;

  const hits = beatTimes
    .filter(b => b.lane === laneIdx)
    .map(b => ({
      diff: Math.abs(b.time - now),
      beat: b
    }))
    .sort((a, b) => a.diff - b.diff);

  if (hits.length && hits[0].diff < 0.25) {
    const diff = hits[0].diff;
    let rating, points;

    if (diff < 0.05) {
      rating = "Perfect";
      points = 3;
    } else if (diff < 0.12) {
      rating = "Good";
      points = 2;
    } else {
      rating = "Okay";
      points = 1;
    }

    setScore(prev => prev + points);
    setMessage(`${rating} hit on ${LANE_KEYS[laneIdx]}! (+${points})`);
    onResult?.(true);
  } else {
    setMessage(`Missed the beat on ${LANE_KEYS[laneIdx]}!`);
    onResult?.(false);
  }
};
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [started, beatTimes, audioRef]);

  return (
    <div className="blacksmith-game">
      <h3 style={{ fontSize: '2em', color: '#ff9800', marginBottom: 10 }}>Blacksmith Rhythm Mini-Game</h3>
      {!started && countdown === null && (
        <button className="fantasy-button" onClick={handleStart} style={{ fontSize: '1.4em', marginBottom: 18 }}>
          Start Mini-Game
        </button>
      )}
      {countdown > 0 && (
        <div className="countdown-overlay">
          <div className="countdown-number">{countdown}</div>
          <div className="countdown-text">Get Ready!</div>
        </div>
      )}
      <audio
        ref={audioRef}
        src={trackName ? require(`./Rythem/${trackName}.mp3`) : undefined}
        style={{ display: 'none' }}
      />
      {started && (
        <>
          <div className="rythm-track" style={{ width: BAR_WIDTH, height: TRACK_HEIGHT, position: 'relative' }}>
            {LANE_Y.map((y, laneIdx) => (
              <div key={laneIdx} className="hammer-zone" style={{
                left: HAMMER_ZONE, top: y, width: BEAT_RADIUS * 2, height: BEAT_RADIUS * 2, position: 'absolute'
              }}>
                <span className={`hammer-icon${hammerAnim === laneIdx ? ' hammer-hit' : ''}`}>{LANE_KEYS[laneIdx]}</span>
              </div>
            ))}
            {beats.map((beat, idx) => (
              <div
                key={idx}
                className="rythm-beat"
                style={{
                  left: beat.left,
                  top: beat.top,
                  background: Math.abs((beat.left + BEAT_RADIUS) - (HAMMER_ZONE + BEAT_RADIUS)) < 12 ? '#39ff14' : '#ffe066',
                  position: 'absolute'
                }}
              />
            ))}
            {LANE_Y.slice(1).map((y, idx) => (
              <div key={idx} className="lane-divider" style={{ top: y - 8, left: HAMMER_ZONE, width: BAR_WIDTH - HAMMER_ZONE, height: 2, position: 'absolute' }} />
            ))}
          </div>
          <div style={{ margin: '18px 0' }}>
          </div>
          <div className="blacksmith-score">Score: {score}</div>
          <div className="blacksmith-message">{message}</div>
          <div className="blacksmith-instructions">
            Slam the hammer when a beat enters the green zone!
          </div>
        </>
      )}
    </div>
  );
}
