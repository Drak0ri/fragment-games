# Fragment Games - ORACLE-7 Template System

**Modular hybrid puzzle game system for educational use**

## 🎯 Overview

Fragment Games is a reusable template system that combines kiosked Chromebooks with RFID hardware to create engaging educational challenges. Each game runs for 2 weeks with a unique theme, but uses the same underlying infrastructure.

**ORACLE-7** is the first game and serves as the template for all future games.

## 🏗️ System Architecture

### Core Features
- **Anonymous Registration**: Email → Agent ID system
- **20-Slot Progression**: Linear puzzle unlocking
- **Mini-Games Economy**: Earn currency, buy hints/skips
- **RFID Integration**: Physical chip scanning for instant unlocks
- **Personal Dashboards**: Individual progress tracking
- **Admin Dashboard**: Monitor metrics and export data

### Hardware Required
- Kiosked Chromebooks
- USB RFID scanner (keyboard emulation)
- 50x RFID chips (25mm circular, sticky backing)
- 40x RFID cards
- 20x RFID coin-like disc tags

## 📁 Project Structure

```
fragment-games/
├── index.html                 # Main landing page (game selector)
├── games/
│   └── oracle-7/
│       ├── landing.html       # Registration + story intro
│       └── dashboard.html     # Main game interface (20 slots)
├── mini-games/
│   ├── typing.html           # ⌨️ Typing Speed Test
│   ├── memory.html           # 🧠 Memory Match
│   ├── reaction.html         # ⚡ Reaction Time
│   ├── trivia.html           # 🎯 Quick Trivia
│   ├── pattern.html          # 🔍 Pattern Hunt
│   └── code.html             # 💻 Debug Code
├── shared/
│   └── js/
│       ├── auth.js           # Email/Agent ID system
│       ├── scanner.js        # RFID/Barcode integration
│       └── leaderboard.js    # Ranking system
└── admin/
    └── dashboard.html        # Admin control panel
```

## 🚀 Getting Started

### 1. Open the System
Simply open `index.html` in a browser (or deploy to a web server).

### 2. Player Flow
1. Click "ORACLE-7" card
2. Enter email → Get Agent ID
3. Solve puzzles to unlock 20 fragments
4. Play mini-games to earn currency
5. Use currency for hints or skip tokens

### 3. RFID Setup
- Format tags as: `FRAG-01`, `FRAG-02`, ... `FRAG-20`
- Scanner acts as keyboard input device
- Daily limit: 3 scans per student
- Tags are returned via drop slot for reuse

### 4. Admin Access
Open `admin/dashboard.html` to:
- View total agents and progress
- Monitor fragment discovery rates
- Export data (CSV) and email lists
- Track RFID tag usage

## 🎮 Mini-Games

Each mini-game rewards currency based on performance:

| Game | Skill | Time | Max Reward |
|------|-------|------|------------|
| Typing Test | WPM speed | 60s | 30⚡ |
| Memory Match | Recall | ~2min | 30⚡ |
| Reaction Time | Reflexes | 5 attempts | 30⚡ |
| Quick Trivia | Knowledge | 10 questions | 30⚡ |
| Pattern Hunt | Visual search | 30s | 30⚡ |
| Debug Code | Logic | 5 bugs | 30⚡ |

**Currency uses:**
- 20⚡ = 1 hint
- Skip tokens (max 5 per game)

## 🔧 Technical Details

### Authentication System (`auth.js`)
- Email → Agent ID generation (hashed)
- Stored in localStorage
- Backend-ready structure for future upgrade

### Scanner Integration (`scanner.js`)
- Listens for keyboard input from USB scanner
- Auto-detects RFID vs Barcode format
- Daily scan limits enforced
- Visual + audio feedback

### Data Storage
Currently uses **localStorage** (client-side):
- `currentAgent` - Active session
- `agent_{ID}` - Agent profile
- `oracle7_{ID}` - Game progress
- `scans_rfid_{ID}_{date}` - Daily scan tracking

**Future**: Migrate to backend database (Firebase, Supabase, etc.)

## 🎨 Customizing for New Games

### To Create a New Game (e.g., Virus Hunt):

1. **Copy ORACLE-7 folder**:
   ```
   cp -r games/oracle-7 games/virus-hunt
   ```

2. **Update Visual Theme**:
   - Change colors (CSS variables)
   - Update icon emoji
   - Modify story text

3. **Replace Puzzle Content**:
   - Edit `puzzles` array in `dashboard.html`
   - Update questions, answers, hints
   - Maintain 20-slot structure

4. **Update index.html**:
   - Add new game card
   - Set active/coming-soon status

5. **Test Flow**:
   - Registration → Dashboard → Puzzles → Mini-games

## 🔒 RFID Tag Management

### Tag Format
- Fragment unlock: `FRAG-01` to `FRAG-20`
- Barcode hints: `BAR-` prefix or 8+ digits

### Physical Setup
1. Label 20 chips with numbers 1-20
2. Store in bowl near kiosk (or controlled distribution)
3. Create drop slot for returns
4. Admin recycles tags into circulation

### Scanner Configuration
Most USB RFID readers work as HID keyboards (plug-and-play).

**Test your scanner:**
1. Open Notepad
2. Scan a tag
3. Should type tag ID + Enter

If not working, check scanner settings (may need to configure suffix/prefix).

## 📊 Admin Features

### Dashboard Metrics
- Total active agents
- Average progress (%)
- Fragment discovery heatmap
- Completion count
- RFID tag usage

### Data Export
- **CSV Export**: All agent progress data
- **Email List**: For communication (announcements, clues)
- **Leaderboard**: Top 20 agents

### Demo Reset
Admin can clear all data to start fresh (use cautiously!).

## 🛠️ Future Enhancements

### Backend Integration
Replace localStorage with:
- Database (PostgreSQL, MongoDB)
- Email service (SendGrid, Mailgun)
- Real-time sync across devices

### Additional Features
- Barcode library integration
- SMS notifications
- Team mode (collaborative solving)
- Difficulty levels
- Custom puzzle builders

## 📝 Puzzle Design Tips

For **ages 11-14** (years 4-9):

✅ **Good Puzzles:**
- Pattern recognition
- Simple ciphers (Caesar, substitution)
- Logic problems
- Math challenges
- Word puzzles
- Code debugging
- Research tasks (library books)

❌ **Avoid:**
- Overly complex math
- Obscure trivia
- Time pressure stress
- Frustrating difficulty spikes

**Progression:** Start easy, gradually increase difficulty.

## 🎯 Educational Alignment

### Skills Developed
- **Critical Thinking**: Logic puzzles, debugging
- **Literacy**: Reading comprehension, word puzzles
- **Numeracy**: Math challenges, patterns
- **Digital Literacy**: Code concepts, tech vocabulary
- **Research**: Library integration, information finding
- **Persistence**: Challenge completion, skill improvement

### Engagement Strategies
- Leaderboard competition (anonymous)
- Achievement badges
- Currency rewards
- Choice (mini-games are optional)
- Low barrier to entry

## 🔐 Privacy & Safety

- **Anonymous**: Only Agent IDs shown publicly
- **Minimal Data**: Email only for registration
- **Local Storage**: No external data sharing
- **GDPR Ready**: Easy data export/deletion
- **No Tracking**: No analytics or third-party scripts

## 📞 Support

For questions or issues:
1. Check this README
2. Review code comments
3. Test in browser console
4. Check browser compatibility (modern browsers required)

## 📜 License

This is an educational project for IESV school use.

---

**Built with ❤️ for Fragment Games**

*Version 1.0 - ORACLE-7 Template*
