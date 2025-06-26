import { animate } from "motion";
import type { Ticker } from "pixi.js";
import { Container, Text } from "pixi.js";

import { engine } from "../../getEngine";
import { GameScreen } from "../GameScreen";
import { TetrisBoard } from "../../game/TetrisBoard";
import { TetrominoFactory } from "../../game/TetrominoFactory";

/** The screen that holds the app */
export class MainScreen extends Container {
  /** Assets bundles required by this screen */
  public static assetBundles = ["main"];

  public mainContainer: Container;
  private backgroundBoard: TetrisBoard;
  private pressSpaceText: Text;
  private currentPiece: any;
  private dropTimer: number = 0;
  private keyHandler!: (event: KeyboardEvent) => void;
  private paused = false;

  constructor() {
    super();

    this.mainContainer = new Container();
    this.addChild(this.mainContainer);
    
    // Add background game board
    this.backgroundBoard = new TetrisBoard();
    this.backgroundBoard.alpha = 0.5;
    this.addChild(this.backgroundBoard);
    
    // Add animated piece
    this.currentPiece = TetrominoFactory.createRandom();
    this.currentPiece.x = 4;
    this.currentPiece.y = 0;
    
    // Add blinking text
    this.pressSpaceText = new Text('Press Space to play', {
      fontSize: 40,
      fill: 0xFFFFFF,
      fontWeight: 'bold'
    });
    this.pressSpaceText.anchor.set(0.5);
    this.addChild(this.pressSpaceText);
    
    this.setupControls();
  }

  private setupControls(): void {
    // Make screen interactive for click
    this.interactive = true;
    this.on('pointerdown', async () => {
      console.log('Screen clicked, starting game');
      try {
        await engine().navigation.showScreen(GameScreen);
        console.log('Game started successfully');
      } catch (error) {
        console.error('Error starting game:', error);
      }
    });
    
    this.keyHandler = async (event: KeyboardEvent) => {
      console.log('Key pressed:', event.code);
      if (event.code === 'Space') {
        event.preventDefault();
        console.log('Space pressed, starting game');
        try {
          await engine().navigation.showScreen(GameScreen);
          console.log('Game started successfully');
        } catch (error) {
          console.error('Error starting game:', error);
        }
      }
    };
    
    window.addEventListener('keydown', this.keyHandler);
  }

  /** Prepare the screen just before showing */
  public prepare() {}

  /** Update the screen */
  public update(_time: Ticker) {
    if (this.paused) return;
    
    // Animate falling piece
    this.dropTimer += 16;
    if (this.dropTimer >= 1000) {
      this.currentPiece.y++;
      if (this.currentPiece.y > 20) {
        this.currentPiece = TetrominoFactory.createRandom();
        this.currentPiece.x = 4;
        this.currentPiece.y = 0;
      }
      this.dropTimer = 0;
    }
    
    this.backgroundBoard.renderWithCurrentPiece(this.currentPiece);
    
    // Blink text
    this.pressSpaceText.alpha = Math.sin(Date.now() * 0.005) * 0.5 + 0.5;
  }

  /** Pause gameplay - automatically fired when a popup is presented */
  public async pause() {
    this.mainContainer.interactiveChildren = false;
    this.paused = true;
  }

  /** Resume gameplay */
  public async resume() {
    this.mainContainer.interactiveChildren = true;
    this.paused = false;
  }

  /** Fully reset */
  public reset() {}

  /** Resize the screen, fired whenever window size changes */
  public resize(width: number, height: number) {
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    this.mainContainer.x = centerX;
    this.mainContainer.y = centerY;
    
    // Center the background board to match GameScreen exactly
    this.backgroundBoard.x = centerX - 250;
    this.backgroundBoard.y = centerY - 350;
    
    this.pressSpaceText.x = centerX - 40;
    this.pressSpaceText.y = centerY + 80;
  }

  /** Show screen with animations */
  public async show(): Promise<void> {
    engine().audio.bgm.play("main/sounds/bgm-main.mp3", { volume: 0.5 });

    this.pressSpaceText.alpha = 0;
    const finalPromise = animate(
      this.pressSpaceText,
      { alpha: 1 },
      { duration: 0.3, delay: 0.75, ease: "backOut" },
    );

    await finalPromise;
  }

  /** Hide screen with animations */
  public async hide() {
    window.removeEventListener('keydown', this.keyHandler);
  }

  public destroy(): void {
    window.removeEventListener('keydown', this.keyHandler);
    super.destroy();
  }
}