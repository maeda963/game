class FishingGame {
    constructor() {
        this.gameArea = document.getElementById('gameArea');
        this.scoreEl = document.getElementById('score');
        this.fishCountEl = document.getElementById('fishCount');
        this.timerEl = document.getElementById('timer');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.retryBtn = document.getElementById('retryBtn');
        this.gameOverDiv = document.getElementById('gameOver');
        this.finalScoreEl = document.getElementById('finalScore');
        this.finalFishCountEl = document.getElementById('finalFishCount');
        
        this.score = 0;
        this.fishCount = 0;
        this.timeLeft = 30;
        this.gameActive = false;
        this.timerInterval = null;
        
        this.init();
    }
    
    init() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.retryBtn.addEventListener('click', () => this.startGame());
        this.gameArea.addEventListener('click', (e) => this.handleClick(e));
    }
    
    startGame() {
        this.score = 0;
        this.fishCount = 0;
        this.timeLeft = 30;
        this.gameActive = true;
        
        this.scoreEl.textContent = this.score;
        this.fishCountEl.textContent = this.fishCount;
        this.timerEl.textContent = this.timeLeft;
        
        this.gameOverDiv.style.display = 'none';
        this.startBtn.disabled = true;
        this.resetBtn.disabled = false;
        
        this.gameArea.innerHTML = '';
        this.spawnFish();
        
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }
    
    resetGame() {
        this.gameActive = false;
        this.startBtn.disabled = false;
        this.resetBtn.disabled = true;
        clearInterval(this.timerInterval);
        this.gameArea.innerHTML = '';
        this.score = 0;
        this.fishCount = 0;
        this.timeLeft = 30;
        this.scoreEl.textContent = this.score;
        this.fishCountEl.textContent = this.fishCount;
        this.timerEl.textContent = this.timeLeft;
        this.gameOverDiv.style.display = 'none';
    }
    
    spawnFish() {
        if (!this.gameActive) return;
        
        const fish = document.createElement('div');
        fish.className = 'fish';
        fish.style.left = Math.random() * (this.gameArea.offsetWidth - 50) + 'px';
        fish.style.top = Math.random() * (this.gameArea.offsetHeight - 100) + 50 + 'px';
        
        // 魚のサイズをランダムに
        const size = 30 + Math.random() * 30;
        fish.style.width = size + 'px';
        fish.style.height = (size * 0.6) + 'px';
        fish.style.fontSize = (size * 0.6) + 'px';
        
        // ポイント値を属性に追加
        const points = Math.floor(size / 10);
        fish.dataset.points = points;
        fish.title = `+${points} ポイント`;
        
        this.gameArea.appendChild(fish);
        
        // 魚が消える前に新しい魚を生成
        setTimeout(() => {
            if (this.gameActive && fish.parentNode) {
                fish.remove();
                this.spawnFish();
            }
        }, 3000);
    }
    
    handleClick(e) {
        if (!this.gameActive) return;
        
        if (e.target.classList.contains('fish')) {
            const fish = e.target;
            const points = parseInt(fish.dataset.points);
            
            // クリック時のアニメーション
            fish.classList.add('caught');
            
            this.score += points;
            this.fishCount += 1;
            
            this.scoreEl.textContent = this.score;
            this.fishCountEl.textContent = this.fishCount;
            
            // 効果音のようなビジュアルフィードバック
            this.showFloatingText(e.clientX, e.clientY, `+${points}`);
            
            setTimeout(() => fish.remove(), 500);
        }
    }
    
    showFloatingText(x, y, text) {
        const floatingText = document.createElement('div');
        floatingText.style.position = 'fixed';
        floatingText.style.left = x + 'px';
        floatingText.style.top = y + 'px';
        floatingText.style.fontSize = '24px';
        floatingText.style.fontWeight = 'bold';
        floatingText.style.color = '#FFD700';
        floatingText.style.pointerEvents = 'none';
        floatingText.style.textShadow = '0 2px 4px rgba(0,0,0,0.5)';
        floatingText.textContent = text;
        
        document.body.appendChild(floatingText);
        
        // フローティングアニメーション
        let opacity = 1;
        let top = y;
        const interval = setInterval(() => {
            top -= 5;
            opacity -= 0.05;
            floatingText.style.top = top + 'px';
            floatingText.style.opacity = opacity;
            
            if (opacity <= 0) {
                clearInterval(interval);
                floatingText.remove();
            }
        }, 30);
    }
    
    updateTimer() {
        this.timeLeft--;
        this.timerEl.textContent = this.timeLeft;
        
        if (this.timeLeft <= 0) {
            this.endGame();
        }
    }
    
    endGame() {
        this.gameActive = false;
        clearInterval(this.timerInterval);
        
        this.startBtn.disabled = false;
        this.resetBtn.disabled = true;
        
        this.finalScoreEl.textContent = this.score;
        this.finalFishCountEl.textContent = this.fishCount;
        
        this.gameOverDiv.style.display = 'flex';
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    new FishingGame();
});
