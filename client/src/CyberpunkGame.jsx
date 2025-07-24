import { useEffect, useRef, useState } from 'react';
import laserSound from './assets/laser.mp3';
import explosionSound from './assets/explosion.mp3';
import deathSound from './assets/death.mp3';

const ASPECT_RATIO = 4 / 3;
const BASE_WIDTH = 400;
const BASE_HEIGHT = 300;

const CyberpunkGame = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const player = useRef({ x: 180, y: 270, width: 40, height: 10, bullets: [] });
  const enemies = useRef([]);
  const keys = useRef({});
  const animationRef = useRef();
  const score = useRef(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [triggeredSound, setTriggeredSound] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: BASE_WIDTH, height: BASE_HEIGHT });

  const laserAudio = useRef(null);
  const explosionAudio = useRef(null);
  const deathAudio = useRef(null);

  const updateCanvasSize = () => {
    if (containerRef.current) {
      const maxWidth = containerRef.current.offsetWidth;
      const width = Math.min(maxWidth, BASE_WIDTH);
      const height = width / ASPECT_RATIO;
      setCanvasSize({ width, height });
    }
  };

  const resetGame = () => {
    player.current = { x: 180, y: 270, width: 40, height: 10, bullets: [] };
    enemies.current = [];
    keys.current = {};
    score.current = 0;
    setGameOver(false);
    setHasStarted(true);
  };

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    if (laserAudio.current) laserAudio.current.volume = 0.2;
    if (explosionAudio.current) explosionAudio.current.volume = 0.2;
    if (deathAudio.current) deathAudio.current.volume = 0.2;
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = BASE_WIDTH;
    canvas.height = BASE_HEIGHT;

    const spawnEnemy = () => {
      const x = Math.random() * (BASE_WIDTH - 30);
      enemies.current.push({ x, y: 0, width: 30, height: 20, speed: 1 + Math.random() * 1.2 });
    };

    const handleKeyDown = (e) => {
      if (e.key === ' ' && hasStarted) e.preventDefault();
      keys.current[e.key] = true;
    };

    const handleKeyUp = (e) => {
      keys.current[e.key] = false;
    };

    const shoot = () => {
      if (player.current.bullets.length < 5) {
        player.current.bullets.push({ x: player.current.x + 18, y: player.current.y, speed: 5 });
        if (laserAudio.current) {
            laserAudio.current.currentTime = 0;
            laserAudio.current.play().catch(() => {});
        }
      }
    };

    const gameLoop = () => {
      ctx.fillStyle = "#0d0d0d";
      ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

      if (gameOver) {
        ctx.textAlign = "center";
        ctx.fillStyle = "#00ffff";
        ctx.font = "24px monospace";
        ctx.fillText("GAME OVER", BASE_WIDTH / 2, 150);
        ctx.fillStyle = "#ff00ff";
        ctx.font = "16px monospace";
        ctx.fillText(`Final Score: ${score.current}`, BASE_WIDTH / 2, 180);
        ctx.textAlign = "left"; // Reset for next game session
        return;
      }

      if (keys.current["ArrowLeft"]) player.current.x -= 3;
      if (keys.current["ArrowRight"]) player.current.x += 3;
      if (keys.current[" "]) shoot();

      player.current.x = Math.max(0, Math.min(BASE_WIDTH - player.current.width, player.current.x));
      ctx.fillStyle = "#00ffff";
      ctx.fillRect(player.current.x, player.current.y, player.current.width, player.current.height);

      ctx.fillStyle = "#ff00ff";
      ctx.font = "14px monospace";
      ctx.fillText(`SCORE: ${score.current}`, 10, 20);

      player.current.bullets.forEach((b, i) => {
        b.y -= b.speed;
        if (b.y < 0) player.current.bullets.splice(i, 1);
        ctx.fillStyle = "#ff00ff";
        ctx.fillRect(b.x, b.y, 4, 10);
      });

      enemies.current.forEach((e, i) => {
        e.y += e.speed;
        if (e.y > BASE_HEIGHT) enemies.current.splice(i, 1);
        ctx.fillStyle = "#ff00ff";
        ctx.fillRect(e.x, e.y, e.width, e.height);

        if (
          e.x < player.current.x + player.current.width &&
          e.x + e.width > player.current.x &&
          e.y + e.height > player.current.y &&
          e.y < player.current.y + player.current.height
        ) {
          if(deathAudio.current) {
            deathAudio.current.currentTime = 0;
            deathAudio.current.play().catch(() => {});
          }
          setGameOver(true);
        }
      });

      player.current.bullets.forEach((b, bi) => {
        enemies.current.forEach((e, ei) => {
          if (
            b.x < e.x + e.width &&
            b.x + 4 > e.x &&
            b.y < e.y + e.height &&
            b.y + 10 > e.y
          ) {
            player.current.bullets.splice(bi, 1);
            enemies.current.splice(ei, 1);
            score.current += 10;
            if(explosionAudio.current){
                explosionAudio.current.currentTime = 0;
                explosionAudio.current.play().catch(() => {});
            }
          }
        });
      });

      if (Math.random() < 0.02) spawnEnemy();
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [hasStarted, gameOver]);

  const handleCanvasClick = () => {
    if (!triggeredSound) {
      [laserAudio, explosionAudio, deathAudio].forEach(audio => {
        try {
          if(audio.current){
            audio.current.volume = 0.2;
            audio.current?.play().then(() => {
                audio.current.pause();
                audio.current.currentTime = 0;
            });
          }
        } catch {}
      });
      setTriggeredSound(true);
    }
    if (!hasStarted) setHasStarted(true);
  };

  return (
    <div ref={containerRef} className="relative py-16 bg-[#0d0d0d] border-t border-slate-800 flex flex-col items-center">
      <audio src={laserSound} ref={laserAudio} preload="auto" />
      <audio src={explosionSound} ref={explosionAudio} preload="auto" />
      <audio src={deathSound} ref={deathAudio} preload="auto" />

      <h3 className="text-xl text-center text-fuchsia-400 font-semibold font-sans mb-2">
        Cyberpunk Invaders
      </h3>

      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        width={BASE_WIDTH}
        height={BASE_HEIGHT}
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          border: "2px solid #ff00ff",
          boxShadow: "0 0 20px #ff00ff55",
          imageRendering: "pixelated",
          cursor: "pointer",
        }}
      />

      {!hasStarted && (
        <p className="text-slate-400 mt-3 text-sm animate-pulse">Click the canvas to start</p>
      )}
      
      {gameOver && (
        <button
          onClick={resetGame}
          className="mt-4 px-4 py-2 rounded bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-mono transition"
        >
          Restart Game
        </button>
      )}

      {/* Controls and Instructions */}
      {hasStarted && !gameOver && (
        <div className="mt-4 text-center">
            <div className="flex justify-center gap-4">
              <button
                onMouseDown={() => keys.current["ArrowLeft"] = true}
                onMouseUp={() => keys.current["ArrowLeft"] = false}
                onTouchStart={() => keys.current["ArrowLeft"] = true}
                onTouchEnd={() => keys.current["ArrowLeft"] = false}
                className="bg-fuchsia-500 text-white px-6 py-3 rounded-lg shadow-md active:scale-95 text-xl"
              >
                ◀
              </button>
              <button
                onMouseDown={() => keys.current[" "] = true}
                onMouseUp={() => keys.current[" "] = false}
                onTouchStart={() => keys.current[" "] = true}
                onTouchEnd={() => keys.current[" "] = false}
                className="bg-cyan-500 text-white px-6 py-3 rounded-lg shadow-md active:scale-95 text-xl"
              >
                🔫
              </button>
              <button
                onMouseDown={() => keys.current["ArrowRight"] = true}
                onMouseUp={() => keys.current["ArrowRight"] = false}
                onTouchStart={() => keys.current["ArrowRight"] = true}
                onTouchEnd={() => keys.current["ArrowRight"] = false}
                className="bg-fuchsia-500 text-white px-6 py-3 rounded-lg shadow-md active:scale-95 text-xl"
              >
                ▶
              </button>
            </div>
            <div className="mt-4">
                <p className="text-slate-500 text-sm sm:hidden">Use on-screen controls to play.</p>
                <p className="hidden sm:block text-slate-500 text-sm">Use on-screen controls, or ← → keys to move and Spacebar to shoot.</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default CyberpunkGame;
