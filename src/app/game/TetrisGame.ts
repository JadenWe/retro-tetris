import { Container, Graphics, Text } from 'pixi.js';
import { TetrisBoard } from './TetrisBoard';
import { TetrominoFactory } from './TetrominoFactory';
import { GameState } from './GameState';
import { engine } from '../getEngine';

export class TetrisGame extends Container {
    private board: TetrisBoard;
    private gameState: GameState;
    private currentPiece: any;
    private nextPiece: any;
    private gameLoop: number = 0;
    private dropTimer: number = 0;
    private scoreText!: Text;
    private levelText!: Text;
    private nextPiecePreview!: Container;
    private isGameOver: boolean = false;
    private fastDrop: boolean = false;
    private isPaused: boolean = false;

    constructor() {
        super();
        this.gameState = new GameState();
        this.board = new TetrisBoard();
        this.board.x = 250;
        this.board.y = 50;
        this.addChild(this.board);
        
        this.setupUI();
        this.spawnNewPiece();
        this.startGameLoop();
        
        // Play energetic game music
        engine().audio.bgm.play("main/sounds/bgm-main.mp3", { volume: 0.8, loop: true });
    }

    private setupUI(): void {
        this.scoreText = new Text(`Score: ${this.gameState.score}`, {
            fontSize: 24,
            fill: 0xFFFFFF
        });
        this.scoreText.position.set(720, 50);
        this.addChild(this.scoreText);

        this.levelText = new Text(`Level: ${this.gameState.level}`, {
            fontSize: 24,
            fill: 0xFFFFFF
        });
        this.levelText.position.set(720, 100);
        this.addChild(this.levelText);


        
        // Next piece preview box
        this.nextPiecePreview = new Container();
        const previewBox = new Graphics();
        previewBox.rect(0, 0, 140, 140);
        previewBox.fill(0x000000);
        previewBox.stroke({ width: 2, color: 0xFFFFFF });
        this.nextPiecePreview.addChild(previewBox);
        
        const nextText = new Text('NEXT', {
            fontSize: 18,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        nextText.anchor.set(0.5, 0);
        nextText.position.set(70, -25);
        this.nextPiecePreview.addChild(nextText);
        
        this.nextPiecePreview.position.set(720, 450);
        this.addChild(this.nextPiecePreview);
    }

    private spawnNewPiece(): void {
        this.currentPiece = this.nextPiece || TetrominoFactory.createRandom();
        this.nextPiece = TetrominoFactory.createRandom();
        
        this.currentPiece.x = 5;
        this.currentPiece.y = 0;
        
        if (this.board.checkCollision(this.currentPiece)) {
            this.gameOver();
            return;
        }
    }

    private startGameLoop(): void {
        const gameLoop = () => {
            this.update();
            this.gameLoop = requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }

    private update(): void {
        if (this.isGameOver || this.isPaused) return;
        
        this.dropTimer += 16;
        const dropSpeed = this.fastDrop ? 50 : Math.max(500, 1500 - (this.gameState.level * 100));
        
        if (this.dropTimer >= dropSpeed) {
            this.dropPiece();
            this.dropTimer = 0;
        }
        
        this.board.renderWithCurrentPiece(this.currentPiece);
        this.updateNextPiecePreview();
    }

    private dropPiece(): void {
        this.currentPiece.y++;
        
        if (this.board.checkCollision(this.currentPiece)) {
            this.currentPiece.y--;
            
            if (this.currentPiece.y <= 0) {
                this.gameOver();
                return;
            }
            
            this.board.placePiece(this.currentPiece);
            
            const linesCleared = this.board.clearLines();
            if (linesCleared > 0) {
                const oldLevel = this.gameState.level;
                this.gameState.addScore(linesCleared);
                if (this.gameState.level > oldLevel) {
                    this.showLevelUpPopup();
                    this.board.clearAllBlocks();
                    this.board.addRandomBottomBlocks(this.gameState.level);
                }
                this.updateUI();
            }
            
            this.spawnNewPiece();
        }
    }

    public movePiece(direction: number): void {
        if (this.isGameOver || this.isPaused) return;
        this.currentPiece.x += direction;
        if (this.board.checkCollision(this.currentPiece)) {
            this.currentPiece.x -= direction;
        }
    }

    public rotatePiece(): void {
        if (this.isGameOver || this.isPaused) return;
        const originalShape = this.currentPiece.shape;
        this.currentPiece.rotate();
        if (this.board.checkCollision(this.currentPiece)) {
            this.currentPiece.shape = originalShape;
        }
    }

    public setFastDrop(enabled: boolean): void {
        if (!this.isPaused) {
            this.fastDrop = enabled;
        }
    }
    
    public hardDrop(): void {
        if (this.isGameOver || this.isPaused) return;
        while (!this.board.checkCollision(this.currentPiece)) {
            this.currentPiece.y++;
        }
        this.currentPiece.y--;
        this.dropPiece();
    }
    
    public togglePause(): void {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            const pauseText = new Text('PAUSED\nPress ESC to resume', {
                fontSize: 32,
                fill: 0xFFFFFF,
                align: 'center'
            });
            pauseText.anchor.set(0.5);
            pauseText.position.set(465, 400);
            pauseText.name = 'pauseText';
            this.addChild(pauseText);
        } else {
            const pauseText = this.getChildByName('pauseText');
            if (pauseText) this.removeChild(pauseText);
        }
    }

    private updateUI(): void {
        const targetScore = this.gameState.getTargetScore();
        this.scoreText.text = `Score: ${this.gameState.score}`;
        this.levelText.text = `Level: ${this.gameState.level}`;


    }
    
    private updateNextPiecePreview(): void {
        if (!this.nextPiece || !this.nextPiecePreview) return;
        
        // Clear previous preview
        const existingPreview = this.nextPiecePreview.getChildByName('preview');
        if (existingPreview) this.nextPiecePreview.removeChild(existingPreview);
        
        // Create new preview
        const previewGraphics = new Graphics();
        previewGraphics.name = 'preview';
        
        const shape = this.nextPiece.shape;
        const cellSize = 20;
        const offsetX = 70 - (shape[0].length * cellSize) / 2;
        const offsetY = 70 - (shape.length * cellSize) / 2;
        
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const cellX = offsetX + x * cellSize;
                    const cellY = offsetY + y * cellSize;
                    previewGraphics.rect(cellX, cellY, cellSize, cellSize);
                    previewGraphics.fill(this.getCellColor(this.nextPiece.type));
                    previewGraphics.rect(cellX, cellY, cellSize, cellSize);
                    previewGraphics.stroke({ width: 1, color: 0x000000 });
                }
            }
        }
        
        this.nextPiecePreview.addChild(previewGraphics);
    }
    
    private getCellColor(type: number): number {
        const colors = [0x000000, 0x00FFFF, 0x0000FF, 0xFFA500, 0xFFFF00, 0x00FF00, 0x800080, 0xFF0000];
        return colors[type] || 0xFFFFFF;
    }
    
    private showLevelUpPopup(): void {
        const levelUpText = new Text(`LEVEL ${this.gameState.level}!`, {
            fontSize: 48,
            fill: 0xFFFF00,
            fontWeight: 'bold'
        });
        levelUpText.anchor.set(0.5);
        levelUpText.position.set(500, 400);
        levelUpText.name = 'levelUpText';
        this.addChild(levelUpText);
        
        let blinkCount = 0;
        const blinkInterval = setInterval(() => {
            const text = this.getChildByName('levelUpText');
            if (text) {
                text.alpha = text.alpha === 1 ? 0.3 : 1;
                blinkCount++;
                if (blinkCount >= 10) {
                    clearInterval(blinkInterval);
                    this.removeChild(text);
                }
            }
        }, 200);
    }

    private async gameOver(): Promise<void> {
        this.isGameOver = true;
        
        const overlay = new Graphics();
        overlay.rect(0, 0, 1000, 800);
        overlay.fill({ color: 0x000000, alpha: 0.8 });
        this.addChild(overlay);
        
        const gameOverText = new Text('GAME OVER', {
            fontSize: 40,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        gameOverText.anchor.set(0.5);
        gameOverText.position.set(500, 300);
        gameOverText.name = 'gameOverText';
        this.addChild(gameOverText);
        
        // Add blinking effect
        const blinkGameOver = () => {
            const text = this.getChildByName('gameOverText');
            if (text && !this.isGameOver === false) {
                text.alpha = Math.sin(Date.now() * 0.005) * 0.5 + 0.5;
                requestAnimationFrame(blinkGameOver);
            }
        };
        blinkGameOver();
        
        // Retro style RETRY button
        const retryBtn = new Graphics();
        retryBtn.rect(0, 0, 160, 50);
        retryBtn.fill(0x4A4A4A);
        // 3D effect - top and left highlights
        retryBtn.rect(0, 0, 160, 3).fill(0xCCCCCC);
        retryBtn.rect(0, 0, 3, 50).fill(0xCCCCCC);
        // 3D effect - bottom and right shadows
        retryBtn.rect(0, 47, 160, 3).fill(0x222222);
        retryBtn.rect(157, 0, 3, 50).fill(0x222222);
        retryBtn.position.set(320, 420);
        retryBtn.interactive = true;
        retryBtn.on('pointerdown', () => this.restart());
        this.addChild(retryBtn);
        
        const retryText = new Text('RETRY', {
            fontSize: 18,
            fill: 0xFFFFFF,
            fontFamily: 'Arial',
            fontWeight: 'bold'
        });
        retryText.anchor.set(0.5);
        retryText.position.set(80, 25);
        retryBtn.addChild(retryText);
        
        // Retro style HOME button
        const homeBtn = new Graphics();
        homeBtn.rect(0, 0, 160, 50);
        homeBtn.fill(0x4A4A4A);
        // 3D effect - top and left highlights
        homeBtn.rect(0, 0, 160, 3).fill(0xCCCCCC);
        homeBtn.rect(0, 0, 3, 50).fill(0xCCCCCC);
        // 3D effect - bottom and right shadows
        homeBtn.rect(0, 47, 160, 3).fill(0x222222);
        homeBtn.rect(157, 0, 3, 50).fill(0x222222);
        homeBtn.position.set(520, 420);
        homeBtn.interactive = true;
        homeBtn.on('pointerdown', () => this.goHome());
        this.addChild(homeBtn);
        
        const homeText = new Text('HOME', {
            fontSize: 18,
            fill: 0xFFFFFF,
            fontFamily: 'Arial',
            fontWeight: 'bold'
        });
        homeText.anchor.set(0.5);
        homeText.position.set(80, 25);
        homeBtn.addChild(homeText);
    }
    
    private restart(): void {
        this.removeChildren();
        this.isGameOver = false;
        this.isPaused = false;
        this.gameState.reset();
        this.board = new TetrisBoard();
        this.board.x = 250;
        this.board.y = 50;
        this.addChild(this.board);
        this.setupUI();
        this.updateUI();
        this.spawnNewPiece();
        this.dropTimer = 0;
    }
    
    private async goHome(): void {
        const { MainScreen } = await import('../screens/main/MainScreen');
        await engine().navigation.showScreen(MainScreen);
    }

    public getPausedState(): boolean {
        return this.isPaused;
    }
    
    public destroy(): void {
        cancelAnimationFrame(this.gameLoop);
        super.destroy();
    }
}