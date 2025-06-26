import { Tetromino } from './Tetromino';

export class TetrominoFactory {
    private static readonly SHAPES = [
        // I-piece
        [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        // O-piece
        [
            [2, 2],
            [2, 2]
        ],
        // T-piece
        [
            [0, 3, 0],
            [3, 3, 3],
            [0, 0, 0]
        ],
        // S-piece
        [
            [0, 4, 4],
            [4, 4, 0],
            [0, 0, 0]
        ],
        // Z-piece
        [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0]
        ],
        // J-piece
        [
            [6, 0, 0],
            [6, 6, 6],
            [0, 0, 0]
        ],
        // L-piece
        [
            [0, 0, 7],
            [7, 7, 7],
            [0, 0, 0]
        ]
    ];

    public static createRandom(): Tetromino {
        const randomIndex = Math.floor(Math.random() * this.SHAPES.length);
        const shape = this.SHAPES[randomIndex].map(row => [...row]);
        return new Tetromino(shape, randomIndex + 1);
    }

    public static createByType(type: number): Tetromino {
        if (type < 1 || type > this.SHAPES.length) {
            throw new Error(`Invalid tetromino type: ${type}`);
        }
        const shape = this.SHAPES[type - 1].map(row => [...row]);
        return new Tetromino(shape, type);
    }
}