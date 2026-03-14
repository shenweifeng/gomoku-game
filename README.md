# Gomoku Game (五子棋)

A web-based Gomoku (Five-in-a-Row) game with simple AI opponent.

## Features

- **Standard 15×15 board** with star points (天元 and corner stars)
- **Player vs AI mode** - Player plays black (first), AI plays white
- **Smart AI** - Heuristic-based position evaluation algorithm
  - Offensive and defensive scoring
  - Pattern recognition (活四, 冲四, 活三, etc.)
  - Center position bonus
- **Win detection** - Five in a row horizontally, vertically, or diagonally
- **Undo function** - Take back the last move (both player and AI)
- **Restart game** - Start a new game anytime
- **Beautiful UI** - Gradient background with smooth animations

## How to Play

1. Open `index.html` in your browser
2. Click on any intersection to place your black stone
3. AI will automatically respond with a white stone
4. First to get five stones in a row wins!

## Tech Stack

- **HTML5** - Game structure
- **CSS3** - Styling and animations
- **Vanilla JavaScript** - Game logic and AI (no frameworks required)

## Project Structure

```
gomoku-game/
├── index.html      # Main game page
├── style.css       # Styles and layout
├── script.js       # Game logic and AI
├── .gitignore      # Git ignore configuration
└── README.md       # Project documentation
```

## AI Algorithm

The AI uses a heuristic evaluation function to score each empty position:

1. **Line Evaluation** - For each direction (horizontal, vertical, two diagonals), count:
   - Number of consecutive stones
   - Number of open ends
   - Blocked ends

2. **Scoring** - Higher scores for better patterns:
   - Five in a row (五连): 100,000 points (winning)
   - Open four (活四): 10,000 points
   - Closed four (冲四): 1,000 points
   - Open three (活三): 1,000 points
   - Closed three (冲三): 100 points
   - Open two (活二): 100 points

3. **Combined Score**:
   - Offensive value (AI's stones) × 1.1
   - Defensive value (blocking player)
   - Center position bonus

## Screenshots

The game features a clean, modern interface with a gradient purple background and a traditional wooden-styled board.

## Browser Support

Works in all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## License

MIT License

## Author

Created with ❤️