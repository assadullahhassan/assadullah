// --- DYNAMIC LAUNCH COUNTDOWN ENGINE ---
const launchDate = new Date();
launchDate.setDate(launchDate.getDate() + 21); 

function updateCountdown() {
    const now = new Date().getTime();
    const difference = launchDate - now;

    if (difference <= 0) {
        document.querySelector(".countdown-container").innerHTML = "<h4>System ready. Deploying updates.</h4>";
        return;
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = d.toString().padStart(2, '0');
    document.getElementById("hours").innerText = h.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = m.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = s.toString().padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();


// --- DEEP SPACE DUST & STARFIELD ENGINE ---
const canvas = document.getElementById('neuralCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const mouse = { x: null, y: null, radius: 180 };

// Cosmic color palette for the dust particles
const spaceColors = [
    'rgba(0, 242, 254, ',   // Cyan Nebula Dust
    'rgba(121, 40, 202, ',  // Deep Purple Dust
    'rgba(255, 0, 122, ',   // Cosmic Pink Dust
    'rgba(255, 255, 255, '  // Bright Star Dust
];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
}

class SpaceDust {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // Increased size: smaller background stars mixed with large, floating dust anomalies
        this.radius = Math.random() * 4 + 1; 
        this.vx = (Math.random() - 0.5) * 0.2; // Slow, drifting space speed
        this.vy = (Math.random() - 0.5) * 0.2;
        this.baseAlpha = Math.random() * 0.5 + 0.2;
        this.alpha = this.baseAlpha;
        this.colorStem = spaceColors[Math.floor(Math.random() * spaceColors.length)];
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges like infinite space
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Dynamic star twinkling simulation
        this.alpha += this.twinkleSpeed * this.twinkleDir;
        if (this.alpha >= 0.8 || this.alpha <= 0.1) {
            this.twinkleDir *= -1;
        }

        // Mouse gravitational distortion (pushes celestial dust away smoothly)
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                let force = (mouse.radius - dist) / mouse.radius;
                // Soft drifting push away from cursor
                this.x -= (dx / dist) * force * 2;
                this.y -= (dy / dist) * force * 2;
            }
        }
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        // Add a soft glow profile to the larger dust specs
        if (this.radius > 2.5) {
            ctx.shadowBlur = this.radius * 3;
            ctx.shadowColor = this.colorStem.replace(',', ')');
        }
        
        ctx.fillStyle = `${this.colorStem}${this.alpha})`;
        ctx.fill();
        ctx.restore();
    }
}

function initParticles() {
    particles = [];
    // Adjust density for space aesthetic
    const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 12000));
    for (let i = 0; i < count; i++) {
        particles.push(new SpaceDust());
    }
}

function animate() {
    ctx.fillStyle = 'rgba(7, 7, 12, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

// Global Event Triggers
window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

// Init
resizeCanvas();
animate();