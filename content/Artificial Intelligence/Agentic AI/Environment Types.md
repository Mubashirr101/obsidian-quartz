## 🌍  **Environment Types**

An agent’s **effectiveness depends heavily** on the nature of the environment it operates in. Environments can vary in the following ways:

### 1. **Observable vs. Partially Observable**

- **Fully Observable:** The agent has access to the complete state of the environment.
    
    - Example: Chess, where the board is fully visible.
        
- **Partially Observable:** The agent has incomplete info.
    
    - Example: Poker, where opponents’ cards are hidden.
        

---

### 2. **Deterministic vs. Stochastic**

- **Deterministic:** Next state is fully determined by the current state and action.
    
    - Example: A calculator.
        
- **Stochastic:** Outcome involves randomness.
    
    - Example: Stock market.
        

---

### 3. **Episodic vs. Sequential**

- **Episodic:** Experience is broken into independent episodes (each decision doesn’t affect the next).
    
    - Example: Image classification.
        
- **Sequential:** Current decisions affect future outcomes.
    
    - Example: Autonomous driving.
        

---

### 4. **Static vs. Dynamic**

- **Static:** Environment doesn’t change while the agent is thinking.
    
    - Example: Crossword puzzle.
        
- **Dynamic:** Environment changes over time, even without the agent acting.
    
    - Example: Real-time traffic system.
        

---

### 5. **Discrete vs. Continuous**

- **Discrete:** Finite number of actions/states.
    
    - Example: Board games like chess.
        
- **Continuous:** Infinite possible values.
    
    - Example: Robot arm movement.
        

---

### 6. **Single-Agent vs. Multi-Agent**

- **Single-Agent:** Only one agent making decisions.
    
    - Example: Solving a maze.
        
- **Multi-Agent:** Multiple agents interact (can be cooperative or competitive).
    
    - Example: Multiplayer games, stock trading bots.
        

---

## 🔁 Summary Table

|Aspect|Options|Example|
|---|---|---|
|**Observability**|Fully / Partially Observable|Chess vs. Poker|
|**Determinism**|Deterministic / Stochastic|Calculator vs. Weather|
|**Episodicity**|Episodic / Sequential|Image recognition vs. Driving|
|**Dynamics**|Static / Dynamic|Sudoku vs. Live sports betting|
|**State/Action Type**|Discrete / Continuous|Tic-Tac-Toe vs. Car steering|
|**Agent Type**|Single / Multi-Agent|Maze solver vs. Soccer simulation|

---
