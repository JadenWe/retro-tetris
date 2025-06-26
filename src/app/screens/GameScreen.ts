import { Container } from 'pixi.js';
import { TetrisGame } from '../game/TetrisGame';

export class GameScreen extends Container {
    public static assetBundles = ["main"];
    
    private tetrisGame: TetrisGame;
    private keyHandler!: (event: KeyboardEvent) => void;
    private keyUpHandler!: (event: KeyboardEvent) => void;

    constructor() {
        super();
        console.log('GameScreen constructor called');
        this.tetrisGame = new TetrisGame();
        this.addChild(this.tetrisGame);
        
        this.setupControls();
        console.log('GameScreen setup complete');
    }

    private setupControls(): void {
        this.keyHandler = (event: KeyboardEvent) => {
            // 일시정지 상태에서는 ESC만 허용
            if (this.tetrisGame.getPausedState() && event.code !== 'Escape') {
                return;
            }
            
            switch (event.code) {
                case 'ArrowLeft':
                    this.tetrisGame.movePiece(-1);
                    break;
                case 'ArrowRight':
                    this.tetrisGame.movePiece(1);
                    break;
                case 'ArrowDown':
                    this.tetrisGame.setFastDrop(true);
                    break;
                case 'ArrowUp':
                    this.tetrisGame.rotatePiece();
                    break;
                case 'Space':
                    this.tetrisGame.hardDrop();
                    break;
                case 'Escape':
                    this.tetrisGame.togglePause();
                    break;
            }
        };
        
        this.keyUpHandler = (event: KeyboardEvent) => {
            if (event.code === 'ArrowDown' && !this.tetrisGame.getPausedState()) {
                this.tetrisGame.setFastDrop(false);
            }
        };
        
        window.addEventListener('keydown', this.keyHandler);
        window.addEventListener('keyup', this.keyUpHandler);
    }

    public prepare() {}
    
    public async show() {}
    
    public async hide() {}
    
    public resize(width: number, height: number) {
        // Center the game on screen with larger size
        this.x = (width - 1000) / 2;
        this.y = (height - 800) / 2;
    }
    
    public destroy(): void {
        window.removeEventListener('keydown', this.keyHandler);
        window.removeEventListener('keyup', this.keyUpHandler);
        this.tetrisGame.destroy();
        super.destroy();
    }
}