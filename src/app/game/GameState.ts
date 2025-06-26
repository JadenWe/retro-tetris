export class GameState {
    public score: number = 0;
    public level: number = 1;
    public linesCleared: number = 0;
    private readonly LINES_PER_LEVEL = 10;
    private readonly SCORE_VALUES = [0, 10, 20, 30, 40];
    public targetScores = [100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];

    public addScore(lines: number): void {
        this.linesCleared += lines;
        this.score += this.SCORE_VALUES[lines] * this.level;
        
        const newLevel = Math.floor(this.linesCleared / this.LINES_PER_LEVEL) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.onLevelUp();
        }
    }

    private onLevelUp(): void {
        // Trigger level-based obstacles or other effects
        console.log(`Level up! Now at level ${this.level}`);
    }

    public reset(): void {
        this.score = 0;
        this.level = 1;
        this.linesCleared = 0;
    }

    public getDropSpeed(): number {
        return Math.max(50, 500 - (this.level * 50));
    }
    
    public getTargetScore(): number {
        return this.targetScores[this.level - 1] || (this.level * 1000);
    }
    
    public setTargetScores(scores: number[]): void {
        this.targetScores = scores;
    }
}