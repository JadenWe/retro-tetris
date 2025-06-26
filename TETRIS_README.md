# Retro Tetris Game

A classic Tetris implementation built with PixiJS and TypeScript featuring retro aesthetics and modern gameplay enhancements.

## Features

- **Classic Tetris Gameplay**: All 7 standard tetromino pieces (I, O, T, S, Z, J, L)
- **Scoring System**: Points awarded based on lines cleared (single, double, triple, tetris)
- **Level Progression**: Game speed increases with each level
- **Obstacles**: Red obstacle blocks appear at higher levels for added challenge
- **Retro Visual Style**: Classic grid-based design with colorful pieces

## Controls

- **Arrow Left/Right**: Move piece horizontally
- **Arrow Up/Space**: Rotate piece
- **Arrow Down**: Hard drop (instant drop to bottom)

## Scoring

- Single line: 40 × level
- Double lines: 100 × level  
- Triple lines: 300 × level
- Tetris (4 lines): 1200 × level

## Level System

- Advance one level every 10 lines cleared
- Each level increases drop speed
- Higher levels introduce obstacle blocks at the bottom of the board

## How to Play

1. Click "Play Tetris" from the main menu
2. Use arrow keys to control falling pieces
3. Complete horizontal lines to clear them and score points
4. Avoid letting pieces reach the top of the board
5. Challenge yourself to reach higher levels with increasing obstacles!

## Technical Implementation

- Built with PixiJS v8 for high-performance 2D rendering
- TypeScript for type safety and better development experience
- Modular architecture with separate classes for game logic, board management, and piece generation
- Real-time collision detection and line clearing algorithms