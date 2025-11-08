class CodeBreakerGame {
    constructor() {
        this.colors = ['red', 'blue', 'yellow', 'green', 'cyan', 'purple'];
        this.codeLength = 4;
        this.maxAttempts = 10;
        this.secretCode = [];
        this.currentGuess = [];
        this.attempts = 0;
        this.gameOver = false;
        this.gameWon = false;
        this.history = [];
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.secretCode = this.generateSecretCode();
        this.currentGuess = new Array(this.codeLength).fill(null);
        this.attempts = 0;
        this.gameOver = false;
        this.gameWon = false;
        this.history = [];
        
        this.updateAttemptsDisplay();
        this.initializeGameRows();
        this.setActiveRow();
        this.hideSecretCode();
        this.updateUndoButton();
        
        console.log('🎯 SECRET CODE:', this.secretCode);
    }

    generateSecretCode() {
        const code = [];
        for (let i = 0; i < this.codeLength; i++) {
            const randomIndex = Math.floor(Math.random() * this.colors.length);
            code.push(this.colors[randomIndex]);
        }
        return code;
    }

    setupEventListeners() {
        const colorPalette = document.querySelector('.color-palette .colors');
        if (colorPalette) {
            colorPalette.addEventListener('click', (e) => {
                if (e.target.classList.contains('color-peg') && !this.gameOver) {
                    const color = e.target.dataset.color;
                    this.handleColorSelection(color);
                }
            });
        }

        const gameRows = document.getElementById('game-rows');
        if (gameRows) {
            gameRows.addEventListener('click', (e) => {
                if (e.target.classList.contains('peg') && !this.gameOver) {
                    const row = e.target.closest('.game-row');
                    if (row && row.classList.contains('active')) {
                        const pegs = row.querySelectorAll('.guess-pegs .peg');
                        const position = Array.from(pegs).indexOf(e.target);
                        if (position !== -1) {
                            this.showColorPicker(position, e.target);
                        }
                    }
                }
            });
        }

        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.initializeGame();
        });

        const clearBtn = document.getElementById('clear-guess');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearCurrentGuess();
            });
        }

        const helpBtn = document.getElementById('help-btn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                this.showHelpModal();
            });
        }

        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        const playAgainBtn = document.getElementById('play-again-btn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                this.closeModal();
                this.initializeGame();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (!this.gameOver) {
                this.handleKeyPress(e);
            }
        });
    }

    handleColorSelection(color) {
        if (!color) return;
        
        const emptyPosition = this.currentGuess.findIndex(peg => peg === null);
        
        if (emptyPosition !== -1) {
            this.saveHistory();
            this.currentGuess[emptyPosition] = color;
            this.updateCurrentGuessDisplay();
            this.checkSubmitButtonState();
        }
    }

    setPegAtPosition(position, color) {
        if (!this.colors.includes(color)) return;

        this.saveHistory();
        this.currentGuess[position] = color;
        this.updateCurrentGuessDisplay();
        this.checkSubmitButtonState();
    }

    clearPegAtPosition(position) {
        this.saveHistory();
        this.currentGuess[position] = null;
        this.updateCurrentGuessDisplay();
        this.checkSubmitButtonState();
    }

    saveHistory() {
        this.history.push([...this.currentGuess]);
        if (this.history.length > 20) {
            this.history.shift();
        }
        this.updateUndoButton();
    }

    undo() {
        if (this.history.length > 0) {
            this.currentGuess = this.history.pop();
            this.updateCurrentGuessDisplay();
            this.checkSubmitButtonState();
            this.updateUndoButton();
        }
    }

    updateUndoButton() {
        const currentRow = document.getElementById(`row-${this.attempts}`);
        if (currentRow) {
            const rowUndoBtn = currentRow.querySelector('.row-undo-btn');
            if (rowUndoBtn) {
                rowUndoBtn.disabled = this.history.length === 0;
            }
        }
    }

    showColorPicker(position, targetPeg) {
        const existingPicker = document.querySelector('.color-picker-popup');
        if (existingPicker) {
            existingPicker.remove();
        }

        const popup = document.createElement('div');
        popup.className = 'color-picker-popup';
        
        const rect = targetPeg.getBoundingClientRect();
        popup.style.left = rect.left + 'px';
        popup.style.top = (rect.bottom + 10) + 'px';

        this.colors.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.className = `picker-option ${color}`;
            colorOption.addEventListener('click', () => {
                this.setPegAtPosition(position, color);
                popup.remove();
            });
            popup.appendChild(colorOption);
        });

        if (this.currentGuess[position] !== null) {
            const clearOption = document.createElement('div');
            clearOption.className = 'picker-option clear-option';
            clearOption.textContent = 'Clear';
            clearOption.addEventListener('click', () => {
                this.clearPegAtPosition(position);
                popup.remove();
            });
            popup.appendChild(clearOption);
        }

        document.body.appendChild(popup);

        setTimeout(() => {
            document.addEventListener('click', function closeOnClickOutside(e) {
                if (!popup.contains(e.target) && e.target !== targetPeg) {
                    popup.remove();
                    document.removeEventListener('click', closeOnClickOutside);
                }
            });
        }, 100);
    }

    handleKeyPress(e) {
        if (e.key >= '1' && e.key <= '6') {
            const colorIndex = parseInt(e.key) - 1;
            if (colorIndex < this.colors.length) {
                this.handleColorSelection(this.colors[colorIndex]);
            }
        } else if (e.key === 'Enter') {
            if (this.isGuessComplete()) {
                this.submitGuess();
            }
        } else if (e.key === 'Backspace') {
            this.clearLastPeg();
        } else if (e.key === 'Escape') {
            this.clearCurrentGuess();
        } else if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            this.undo();
        } else if (e.key === ' ') {
            e.preventDefault();
            this.showHelpModal();
        }
    }

    clearLastPeg() {
        for (let i = this.codeLength - 1; i >= 0; i--) {
            if (this.currentGuess[i] !== null) {
                this.saveHistory();
                this.currentGuess[i] = null;
                this.updateCurrentGuessDisplay();
                this.checkSubmitButtonState();
                break;
            }
        }
    }

    updateCurrentGuessDisplay() {
        const currentRow = document.getElementById(`row-${this.attempts}`);
        if (!currentRow) return;

        const pegs = currentRow.querySelectorAll('.guess-pegs .peg');
        pegs.forEach((peg, index) => {
            if (this.currentGuess[index]) {
                peg.className = `peg ${this.currentGuess[index]}`;
            } else {
                peg.className = 'peg empty';
            }
        });
    }

    checkSubmitButtonState() {
        const currentRow = document.getElementById(`row-${this.attempts}`);
        if (currentRow) {
            const rowSubmitBtn = currentRow.querySelector('.row-submit-btn');
            if (rowSubmitBtn) {
                rowSubmitBtn.disabled = !this.isGuessComplete();
            }
        }
    }

    isGuessComplete() {
        return this.currentGuess.every(peg => peg !== null);
    }

    submitGuess() {
        if (!this.isGuessComplete() || this.gameOver) return;

        const feedback = this.calculateFeedback(this.currentGuess, this.secretCode);
        const currentAttemptIndex = this.attempts;
        
        this.addGuessToHistory(this.currentGuess, feedback, currentAttemptIndex);
        this.attempts++;
        this.updateAttemptsDisplay();
        
        if (feedback.black === this.codeLength) {
            this.gameWon = true;
            this.gameOver = true;
            this.revealSecretCode();
            this.showWinMessage();
            return;
        }
        
        if (this.attempts >= this.maxAttempts) {
            this.gameOver = true;
            this.revealSecretCode();
            this.showLoseMessage();
            return;
        }
        
        this.currentGuess = new Array(this.codeLength).fill(null);
        this.history = [];
        this.setActiveRow();
        this.updateCurrentGuessDisplay();
        this.checkSubmitButtonState();
        this.updateUndoButton();
    }

    calculateFeedback(guess, secret) {
        const feedback = { black: 0, white: 0 };
        const guessCopy = [...guess];
        const secretCopy = [...secret];
        
        for (let i = 0; i < this.codeLength; i++) {
            if (guessCopy[i] === secretCopy[i]) {
                feedback.black++;
                guessCopy[i] = null;
                secretCopy[i] = null;
            }
        }

        for (let i = 0; i < this.codeLength; i++) {
            if (guessCopy[i] !== null) {
                const secretIndex = secretCopy.indexOf(guessCopy[i]);
                if (secretIndex !== -1) {
                    feedback.white++;
                    secretCopy[secretIndex] = null;
                }
            }
        }

        return feedback;
    }

    initializeGameRows() {
        const gameRows = document.getElementById('game-rows');
        const feedbackPanels = document.getElementById('feedback-panels');
        
        if (!gameRows || !feedbackPanels) return;
        
        gameRows.innerHTML = '';
        feedbackPanels.innerHTML = '';
        
        for (let i = 0; i < this.maxAttempts; i++) {
            const row = document.createElement('div');
            row.className = 'game-row empty';
            row.id = `row-${i}`;
            
            const undoBtn = document.createElement('button');
            undoBtn.className = 'btn row-undo-btn';
            undoBtn.innerHTML = '↶';
            undoBtn.title = 'Undo last action (Ctrl+Z)';
            undoBtn.disabled = true;
            undoBtn.style.display = 'none';
            undoBtn.addEventListener('click', () => this.undo());
            
            const guessPegs = document.createElement('div');
            guessPegs.className = 'guess-pegs';
            
            for (let j = 0; j < this.codeLength; j++) {
                const peg = document.createElement('div');
                peg.className = 'peg empty';
                guessPegs.appendChild(peg);
            }
            
            const submitBtn = document.createElement('button');
            submitBtn.className = 'btn row-submit-btn';
            submitBtn.innerHTML = '✓';
            submitBtn.title = 'Submit Guess';
            submitBtn.disabled = true;
            submitBtn.style.display = 'none';
            submitBtn.addEventListener('click', () => this.submitGuess());

            row.appendChild(undoBtn);
            row.appendChild(guessPegs);
            row.appendChild(submitBtn);
            gameRows.appendChild(row);
            
            const feedbackSquare = document.createElement('div');
            feedbackSquare.className = 'feedback-square empty';
            feedbackSquare.id = `feedback-${i}`;
            
            for (let j = 0; j < 4; j++) {
                const hole = document.createElement('div');
                hole.className = 'feedback-hole';
                feedbackSquare.appendChild(hole);
            }
            
            feedbackPanels.appendChild(feedbackSquare);
        }
    }

    addGuessToHistory(guess, feedback, attemptNumber) {
        const row = document.getElementById(`row-${attemptNumber}`);
        const feedbackSquare = document.getElementById(`feedback-${attemptNumber}`);
        
        if (!row || !feedbackSquare) return;
        
        const pegs = row.querySelectorAll('.guess-pegs .peg');
        pegs.forEach((peg, index) => {
            if (guess[index]) {
                peg.className = `peg ${guess[index]}`;
            }
        });
        
        const feedbackHoles = feedbackSquare.querySelectorAll('.feedback-hole');
        let holeIndex = 0;
        
        for (let i = 0; i < feedback.black && holeIndex < 4; i++) {
            const feedbackPeg = document.createElement('div');
            feedbackPeg.className = 'feedback-peg black';
            feedbackHoles[holeIndex].appendChild(feedbackPeg);
            holeIndex++;
        }
        
        for (let i = 0; i < feedback.white && holeIndex < 4; i++) {
            const feedbackPeg = document.createElement('div');
            feedbackPeg.className = 'feedback-peg white';
            feedbackHoles[holeIndex].appendChild(feedbackPeg);
            holeIndex++;
        }
        
        row.classList.remove('active', 'empty');
        row.classList.add('filled');
        feedbackSquare.classList.remove('active', 'empty');
        feedbackSquare.classList.add('filled');
    }

    setActiveRow() {
        document.querySelectorAll('.game-row').forEach(row => {
            row.classList.remove('active');
            const undoBtn = row.querySelector('.row-undo-btn');
            const submitBtn = row.querySelector('.row-submit-btn');
            if (undoBtn) undoBtn.style.display = 'none';
            if (submitBtn) submitBtn.style.display = 'none';
        });
        document.querySelectorAll('.feedback-square').forEach(square => {
            square.classList.remove('active');
        });
        
        const currentRow = document.getElementById(`row-${this.attempts}`);
        const currentFeedback = document.getElementById(`feedback-${this.attempts}`);
        
        if (currentRow) {
            currentRow.classList.add('active');
            
            const undoBtn = currentRow.querySelector('.row-undo-btn');
            const submitBtn = currentRow.querySelector('.row-submit-btn');
            if (undoBtn) {
                undoBtn.style.display = 'inline-block';
                undoBtn.disabled = this.history.length === 0;
            }
            if (submitBtn) {
                submitBtn.style.display = 'inline-block';
                submitBtn.disabled = !this.isGuessComplete();
            }
        }
        if (currentFeedback) {
            currentFeedback.classList.add('active');
        }
    }

    clearCurrentGuess() {
        this.saveHistory();
        this.currentGuess = new Array(this.codeLength).fill(null);
        this.updateCurrentGuessDisplay();
        this.checkSubmitButtonState();
    }

    updateAttemptsDisplay() {
        document.getElementById('attempts').textContent = this.attempts;
    }

    revealSecretCode() {
        const secretPegs = document.querySelectorAll('#secret-code .peg');
        secretPegs.forEach((peg, index) => {
            peg.className = `peg ${this.secretCode[index]}`;
        });
    }

    hideSecretCode() {
        const secretPegs = document.querySelectorAll('#secret-code .peg');
        secretPegs.forEach(peg => {
            peg.className = 'peg secret';
        });
    }

    showWinMessage() {
        const message = `You cracked the code in ${this.attempts} attempt${this.attempts === 1 ? '' : 's'}!`;
        this.showCelebrationModal(message);
    }

    showLoseMessage() {
        const message = `Game Over! The secret code was revealed above. Better luck next time!`;
        this.showCelebrationModal(message, false);
    }

    showHelpModal() {
        const modal = document.getElementById('help-modal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    showCelebrationModal(message, isWin = true) {
        const modal = document.getElementById('celebration-modal');
        const title = document.getElementById('celebration-title');
        const text = document.getElementById('celebration-text');
        
        if (modal && title && text) {
            title.textContent = isWin ? '🎉 Congratulations! 🎉' : '😔 Game Over';
            text.textContent = message;
            modal.style.display = 'block';
            
            if (isWin) {
                this.createFireworks();
            }
        }
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        
        const fireworksContainer = document.querySelector('.fireworks-container');
        if (fireworksContainer) {
            fireworksContainer.innerHTML = '';
        }
    }

    createFireworks() {
        const container = document.querySelector('.fireworks-container');
        if (!container) return;
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'firework';
                
                firework.style.left = Math.random() * 100 + '%';
                firework.style.top = Math.random() * 100 + '%';
                
                const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
                firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                firework.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
                firework.style.setProperty('--ty', (Math.random() - 0.5) * 200 + 'px');
                
                container.appendChild(firework);
                
                setTimeout(() => firework.remove(), 1000);
            }, i * 100);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new CodeBreakerGame();
    }, 100);
});
