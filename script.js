
const canvas = document.getElementById('alx');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const totalHeartPoints = 300;
const totalMPoints = 150; // M harfi için çizgi sayısı
const lines = [];

// 1. KALP NOKTALARINI HESAPLAMA
const heartPoints = [];
for (let i = 0; i < totalHeartPoints; i++) {
    const t = (i / totalHeartPoints) * Math.PI * 2;
    const scale = 14; 
    const x = 16 * Math.pow(Math.sin(t), 3) * scale;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * scale;
    heartPoints.push({ x: x, y: y });
}

// Kalp çizgilerini listeye ekle
for (let i = 0; i < totalHeartPoints; i++) {
    lines.push({
        currentX: (Math.random() - 0.5) * canvas.width * 2,
        currentY: (Math.random() - 0.5) * canvas.height * 2,
        targetX: heartPoints[i].x,
        targetY: heartPoints[i].y,
        speed: 0.01 + Math.random() * 0.012,
        type: 'heart'
    });
}

// 2. "M" HARFİ NOKTALARINI HESAPLAMA (Vektörel M Çizgisi)
// M harfinin köşe noktaları (Kalbin içine sığacak ölçekte)
const mSize = 50; 
const mVertices = [
    { x: -mSize,     y: mSize },    // Sol alt
    { x: -mSize,     y: -mSize },   // Sol üst
    { x: 0,          y: 0 },        // Orta çöküntü
    { x: mSize,      y: -mSize },   // Sağ üst
    { x: mSize,      y: mSize }     // Sağ alt
];

const mPoints = [];
const segments = mVertices.length - 1;
const pointsPerSegment = Math.floor(totalMPoints / segments);

for (let s = 0; s < segments; s++) {
    const start = mVertices[s];
    const end = mVertices[s + 1];
    for (let p = 0; p < pointsPerSegment; p++) {
        const ratio = p / pointsPerSegment;
        mPoints.push({
            x: start.x + (end.x - start.x) * ratio,
            y: start.y + (end.y - start.y) * ratio
        });
    }
}

// M çizgilerini listeye ekle
for (let i = 0; i < mPoints.length; i++) {
    lines.push({
        currentX: (Math.random() - 0.5) * canvas.width * 2,
        currentY: (Math.random() - 0.5) * canvas.height * 2,
        targetX: mPoints[i].x,
        targetY: mPoints[i].y,
        speed: 0.008 + Math.random() * 0.012, // Harf birazcık daha asil ve yavaş süzülebilir
        type: 'letter'
    });
}

function animate() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Ortak Çizgi Stili
    ctx.strokeStyle = 'rgba(255, 42, 116, 0.75)';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff2a74';

    // Pozisyonları güncelle
    lines.forEach(line => {
        line.currentX += (line.targetX - line.currentX) * line.speed;
        line.currentY += (line.targetY - line.currentY) * line.speed;
    });

    // Önce Kalbi Çiz
    ctx.beginPath();
    let firstHeart = true;
    lines.forEach(line => {
        if (line.type === 'heart') {
            if (firstHeart) {
                ctx.moveTo(line.currentX, line.currentY);
                firstHeart = false;
            } else {
                ctx.lineTo(line.currentX, line.currentY);
            }
        }
    });
    ctx.closePath();
    ctx.stroke();

    // Sonra M Harfini Çiz
    ctx.beginPath();
    let firstLetter = true;
    lines.forEach(line => {
        if (line.type === 'letter') {
            if (firstLetter) {
                ctx.moveTo(line.currentX, line.currentY);
                firstLetter = false;
            } else {
                ctx.lineTo(line.currentX, line.currentY);
            }
        }
    });
    ctx.stroke();

    ctx.restore();
    requestAnimationFrame(animate);
}

animate();