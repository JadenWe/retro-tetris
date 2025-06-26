export class Tetromino {
    public x: number = 0;
    public y: number = 0;
    public shape: number[][];
    public type: number;

    constructor(shape: number[][], type: number) {
        this.shape = shape;
        this.type = type;
    }

    public rotate(): void {
        const n = this.shape.length;
        const rotated = Array(n).fill(null).map(() => Array(n).fill(0));
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                rotated[j][n - 1 - i] = this.shape[i][j];
            }
        }
        
        this.shape = rotated;
    }

    public clone(): Tetromino {
        const cloned = new Tetromino(this.shape.map(row => [...row]), this.type);
        cloned.x = this.x;
        cloned.y = this.y;
        return cloned;
    }
}