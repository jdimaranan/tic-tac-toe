/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useRef, useEffect } from 'react';

import xamLogo from "./assets/xam-o.png"
import easterEgg from "./assets/ester-egg.jpeg"
import axios from 'axios';


function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [playerNameOne, setPlayerNameOne] = useState("");
  const [playerNameTwo, setPlayerNameTwo] = useState("");
  const [error, setHasError] = useState("");
  const [leaderboard, setLeaderboard] = useState({});

  const inputOneRef = useRef(null);
  const inputTwoRef = useRef(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      await axios.get("https://emnjerry-api-xam-technight.azurewebsites.net/api/Score").then(res => {
        setLeaderboard(res.data);
      }) 
    }
    
    fetchLeaderboard();
    }, [])
;
  const renderImage = (letter) => {
    if (letter === "X") return <img src={xamLogo} style={{ width: 40, height: 40 }} />;
    else if (letter === "O") return <img src={easterEgg} style={{ width: 40, height: 40 }} />;
    else return <div style={{ width: 40, height: 40 }}></div>;
  }

  function handleChangePlayerNames() {
    const player1 = inputOneRef.current.value;
    const player2 = inputTwoRef.current.value;

    if (player1 !== player2) {
      setHasError(false);
    } else setHasError(true);

    uploadName(player1, player2);
  }

  const uploadName = async (name1, name2) => {
    await axios.put(`https://emnjerry-api-xam-technight.azurewebsites.net/api/Score/players/${name1}`).then((res) => 
    setPlayerNameOne(name1));

    await axios.put(`https://emnjerry-api-xam-technight.azurewebsites.net/api/Score/players/${name2}`).then((res) => setPlayerNameTwo(name2));
  }

  function handleClick(index) {
    const squares = [...board];

    if (calculateWinner(squares) || squares[index]) {
      return;
    }

    squares[index] = xIsNext ? 'X' : 'O';
    setBoard(squares);
    setXIsNext(!xIsNext);
  }

  function renderSquare(index) {
    return (
      <button className="square" onClick={() => handleClick(index)} style={{ padding: 0 }}>
        { renderImage(board[index]) }
      </button>
    );
  }

  function renderBoard() {
    return (
      <div style={{ textAlign: "center"}}>
        <h2>Xam Tic-Tac-Toe</h2>
        <p>Player 1: <span style={{ fontWeight: "bold" }}>{playerNameOne}</span></p>
        <p>Player 2: <span style={{ fontWeight: "bold" }}>{playerNameTwo}</span></p>
        <div className="status" style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}><span>{winner ? "Winner: " : "Next Move: "}</span>{status}</div>
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>

        <p>Leaderboard</p>
        {leaderboard.map((val, index) => {
          return <div key={index}><p>Name:{val.name} Score: {val.score}</p></div>
        })}
    </div>
    )
  }

  function renderPlayersForm() {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>Xam Tic-Tac-Toe</h2>
        <span>Enter Player 1 Name: </span>
        <input ref={inputOneRef} style={{ borderColor: error ? "red" : "" }} />
        <br />
        <br />
        <span>Enter Player 2 Name: </span>
        <input ref={inputTwoRef} style={{ borderColor: error ? "red" : "" }} />
        <br /> 
        <span style={{ color: "red" }}>{error}</span>
        <br /> 
        <button onClick={handleChangePlayerNames}>Enter</button>
      </div>
    )
  }

  const winner = calculateWinner(board);
  const status = winner
    ? winner === "X" ? playerNameOne : playerNameTwo
    : xIsNext ? <img src={xamLogo} style={{ width: 40, height: 40 }} /> : <img src={easterEgg} style={{ width: 40, height: 40 }} />;

  const hasNames = playerNameOne && playerNameTwo;

  return ( 
    <>
      { hasNames ? renderBoard() : renderPlayersForm() }

      <br />
    </>
  );

  function calculateWinner(squares) {
    const lines = [    [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

  
    return null;
  }
}


export default App;