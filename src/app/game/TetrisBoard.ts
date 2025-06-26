import { Container, Graphics } from 'pixi.js';
import { Tetromino } from './Tetromino';

export class TetrisBoard extends Container {
    public static readonly BOARD_WIDTH = 12;
    public static readonly BOARD_HEIGHT = 20;
    public static readonly CELL_SIZE = 35;
    
    private grid: number[][];
    private graphics: Graphics;
    private obstacles: Set<string> = new Set();

    constructor() {
        super();
        this.grid = Array(TetrisBoard.BOARD_HEIGHT).fill(null).map(() => Array(TetrisBoard.BOARD_WIDTH).fill(0));
        this.graphics = new Graphics();
        this.addChild(this.graphics);
        this.renderWithCurrentPiece(null);
    }

    public renderWithCurrentPiece(currentPiece: Tetromino | null): void {
        this.graphics.clear();
        
        // Draw placed pieces and grid
        for (let y = 0; y < TetrisBoard.BOARD_HEIGHT; y++) {
            for (let x = 0; x < TetrisBoard.BOARD_WIDTH; x++) {
                const cellX = x * TetrisBoard.CELL_SIZE;
                const cellY = y * TetrisBoard.CELL_SIZE;
                
                if (this.grid[y][x] > 0) {
                    this.graphics.rect(cellX, cellY, TetrisBoard.CELL_SIZE, TetrisBoard.CELL_SIZE);
                    this.graphics.fill(this.getCellColor(this.grid[y][x]));
                }
                
                // Grid lines
                this.graphics.rect(cellX, cellY, TetrisBoard.CELL_SIZE, TetrisBoard.CELL_SIZE);
                this.graphics.stroke({ width: 1, color: this.grid[y][x] > 0 ? 0x000000 : '#EEEEEE' });
            }
        }
        
        // Draw current falling piece
        if (currentPiece) {
            const shape = currentPiece.shape;
            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < shape[y].length; x++) {
                    if (shape[y][x]) {
                        const boardX = currentPiece.x + x;
                        const boardY = currentPiece.y + y;
                        
                        if (boardX >= 0 && boardX < TetrisBoard.BOARD_WIDTH && 
                            boardY >= 0 && boardY < TetrisBoard.BOARD_HEIGHT) {
                            const cellX = boardX * TetrisBoard.CELL_SIZE;
                            const cellY = boardY * TetrisBoard.CELL_SIZE;
                            this.graphics.rect(cellX, cellY, TetrisBoard.CELL_SIZE, TetrisBoard.CELL_SIZE);
                            this.graphics.fill(this.getCellColor(currentPiece.type));
                            this.graphics.rect(cellX, cellY, TetrisBoard.CELL_SIZE, TetrisBoard.CELL_SIZE);
                            this.graphics.stroke({ width: 2, color: 0x000000 });
                        }
                    }
                }
            }
        }
        
        // Draw obstacles
        this.obstacles.forEach(pos => {
            const [x, y] = pos.split(',').map(Number);
            const cellX = x * TetrisBoard.CELL_SIZE;
            const cellY = y * TetrisBoard.CELL_SIZE;
            this.graphics.rect(cellX, cellY, TetrisBoard.CELL_SIZE, TetrisBoard.CELL_SIZE);
            this.graphics.fill(0xFF0000);
        });
    }

    private getCellColor(type: number): number {
        const colors = [0x000000, 0x00FFFF, 0x0000FF, 0xFFA500, 0xFFFF00, 0x00FF00, 0x800080, 0xFF0000];
        return colors[type] || 0xFFFFFF;
    }

    public checkCollision(piece: Tetromino): boolean {
        const shape = piece.shape;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const boardX = piece.x + x;
                    const boardY = piece.y + y;
                    
                    if (boardX < 0 || boardX >= TetrisBoard.BOARD_WIDTH || 
                        boardY >= TetrisBoard.BOARD_HEIGHT ||
                        (boardY >= 0 && boardY < TetrisBoard.BOARD_HEIGHT && this.grid[boardY][boardX] > 0) ||
                        this.obstacles.has(`${boardX},${boardY}`)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public placePiece(piece: Tetromino): void {
        const shape = piece.shape;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const boardX = piece.x + x;
                    const boardY = piece.y + y;
                    if (boardY >= 0) {
                        this.grid[boardY][boardX] = piece.type;
                    }
                }
            }
        }
        this.renderWithCurrentPiece(null);
    }

    public clearLines(): number {
        let linesCleared = 0;
        for (let y = TetrisBoard.BOARD_HEIGHT - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell > 0)) {
                this.grid.splice(y, 1);
                this.grid.unshift(Array(TetrisBoard.BOARD_WIDTH).fill(0));
                linesCleared++;
                y++;
            }
        }
        if (linesCleared > 0) {
            this.renderWithCurrentPiece(null);
        }
        return linesCleared;
    }

    public addObstacles(level: number): void {
        this.obstacles.clear();
        const obstacleCount = Math.min(level * 2, 10);
        
        for (let i = 0; i < obstacleCount; i++) {
            const x = Math.floor(Math.random() * TetrisBoard.BOARD_WIDTH);
            const y = Math.floor(Math.random() * 5) + TetrisBoard.BOARD_HEIGHT - 5;
            this.obstacles.add(`${x},${y}`);
        }
        this.renderWithCurrentPiece(null);
    }
    
    public clearAllBlocks(): void {
        this.grid = Array(TetrisBoard.BOARD_HEIGHT).fill(null).map(() => Array(TetrisBoard.BOARD_WIDTH).fill(0));
        this.obstacles.clear();
    }
    
    public addRandomBottomBlocks(level: number): void {
        // 레벨에 따라 하단에 배치할 블럭 수 결정 (난이도 조절)
        const blockRows = Math.min(Math.floor(level / 2) + 1, 5); // 최대 5줄
        const blockDensity = Math.min(0.3 + (level * 0.1), 0.8); // 레벨에 따라 밀도 증가
        
        for (let row = 0; row < blockRows; row++) {
            const y = TetrisBoard.BOARD_HEIGHT - 1 - row;
            for (let x = 0; x < TetrisBoard.BOARD_WIDTH; x++) {
                if (Math.random() < blockDensity) {
                    // 랜덤 블럭 타입 (1-7)
                    this.grid[y][x] = Math.floor(Math.random() * 7) + 1;
                }
            }
        }
        
        this.renderWithCurrentPiece(null);
    }
}