import React, { useState, useEffect } from 'react';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
	faCoffee,
	faChessKing,
	faChessPawn,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
library.add(faCoffee, faChessKing, faChessPawn);

export enum Turn {
	Player1,
	Player2,
}

export enum SquareStatus {
	White,
	Black,
	Free,
}

export type SquareState = {
	id: string;
	status: SquareStatus;
	x: number;
	y: number;
	isKing?: boolean;
};
const initialPiecesPosition = [
	{ x: 0, y: 2, type: SquareStatus.Black },
	{ x: 0, y: 5, type: SquareStatus.Black },
	{ x: 0, y: 6, type: SquareStatus.Black },
	{ x: 0, y: 7, type: SquareStatus.Black },
	{ x: 0, y: 10, type: SquareStatus.Black },
	{ x: 1, y: 1, type: SquareStatus.Black },
	{ x: 1, y: 11, type: SquareStatus.Black },
	{ x: 2, y: 0, type: SquareStatus.Black },
	{ x: 2, y: 12, type: SquareStatus.Black },
	{ x: 5, y: 0, type: SquareStatus.Black },
	{ x: 5, y: 12, type: SquareStatus.Black },
	{ x: 6, y: 0, type: SquareStatus.Black },
	{ x: 6, y: 12, type: SquareStatus.Black },
	{ x: 7, y: 0, type: SquareStatus.Black },
	{ x: 7, y: 12, type: SquareStatus.Black },
	{ x: 10, y: 0, type: SquareStatus.Black },
	{ x: 10, y: 12, type: SquareStatus.Black },
	{ x: 11, y: 1, type: SquareStatus.Black },
	{ x: 11, y: 11, type: SquareStatus.Black },
	{ x: 12, y: 2, type: SquareStatus.Black },
	{ x: 12, y: 5, type: SquareStatus.Black },
	{ x: 12, y: 6, type: SquareStatus.Black },
	{ x: 12, y: 7, type: SquareStatus.Black },
	{ x: 12, y: 10, type: SquareStatus.Black },
	{ x: 4, y: 6, type: SquareStatus.White },
	{ x: 5, y: 5, type: SquareStatus.White },
	{ x: 5, y: 6, type: SquareStatus.White },
	{ x: 5, y: 7, type: SquareStatus.White },
	{ x: 6, y: 4, type: SquareStatus.White },
	{ x: 6, y: 5, type: SquareStatus.White },
	{ x: 6, y: 6, type: SquareStatus.White },
	{ x: 6, y: 7, type: SquareStatus.White },
	{ x: 6, y: 8, type: SquareStatus.White },
	{ x: 7, y: 5, type: SquareStatus.White },
	{ x: 7, y: 6, type: SquareStatus.White },
	{ x: 7, y: 7, type: SquareStatus.White },
	{ x: 8, y: 6, type: SquareStatus.White },
];
type Coordinates = {
	x: number;
	y: number;
};
export type Selected = {
	coordinate: Coordinates | null;
	availables: Coordinates[] | null;
};
const clearSelected: Selected = {
	coordinate: null,
	availables: null,
};
export type BoardState = {
	active: boolean;
	winner?: Turn;
};
const initialBoardState = { active: true };
function App() {
	const size = 13;
	const [board, setBoard] = useState<SquareState[][] | undefined>();
	const [turn, setTurn] = useState<Turn>(Turn.Player1);
	const [selectedCoord, setSelectedCoord] = useState<Selected>(clearSelected);
	const [boardState, setBoardState] = useState<BoardState>(initialBoardState);
	useEffect(() => {
		if (!board) {
			initialize();
		}
	}, []);

	const reset = () => {
		initialize();
		setTurn(Turn.Player1);
		setSelectedCoord(clearSelected);
		setBoardState(initialBoardState);
	};

	const initialize = () => {
		const board: SquareState[][] = [];
		for (let i = 0; i < size; i++) {
			const row: SquareState[] = [];
			for (let j = 0; j < size; j++) {
				row.push({
					id: String.fromCharCode(97 + i) + (j + 1).toString(),
					status: SquareStatus.Free,
					x: i,
					y: j,
				});
			}
			board.push(row);
		}
		initialPiecesPosition.forEach(
			(coordinate: { x: number; y: number; type: SquareStatus }) => {
				if (coordinate.type === SquareStatus.Black) {
					board[coordinate.x][coordinate.y].status = SquareStatus.Black;
				} else {
					board[coordinate.x][coordinate.y].status = SquareStatus.White;
					if (coordinate.x === 6 && coordinate.y === 6) {
						board[coordinate.x][coordinate.y].isKing = true;
					}
				}
			}
		);
		setBoard(board);
	};

	function cleanSelected() {
		setSelectedCoord({
			coordinate: null,
			availables: null,
		});
	}
	function changeTurn() {
		//console.log('changing turn');
		setTurn(turn === Turn.Player1 ? Turn.Player2 : Turn.Player1);
	}
	const processAvailables = (pieceCoordX: number, pieceCoordY: number) => {
		const availableCoords = [];
		if (board) {
			//calc movement to bottom
			for (let i = pieceCoordX + 1; i < size; i++) {
				if (board[i][pieceCoordY].status === SquareStatus.Free) {
					availableCoords.push({ x: i, y: pieceCoordY });
				} else {
					break;
				}
			}
			//calc movement to top
			for (let i = pieceCoordX - 1; i >= 0; i--) {
				if (board[i][pieceCoordY].status === SquareStatus.Free) {
					availableCoords.push({ x: i, y: pieceCoordY });
				} else {
					break;
				}
			}
			//calc movement to left
			for (let i = pieceCoordY - 1; i >= 0; i--) {
				if (board[pieceCoordX][i].status === SquareStatus.Free) {
					availableCoords.push({ x: pieceCoordX, y: i });
				} else {
					break;
				}
			}
			//calc movement to right
			for (let i = pieceCoordY + 1; i < size; i++) {
				if (board[pieceCoordX][i].status === SquareStatus.Free) {
					availableCoords.push({ x: pieceCoordX, y: i });
				} else {
					break;
				}
			}
		}
		return availableCoords;
	};

	function isCorner(x: number, y: number): boolean {
		if (x === 0 && y === 0) {
			return true;
		}
		if (x === 0 && y === size - 1) {
			return true;
		}
		if (x === size - 1 && y === 0) {
			return true;
		}
		if (x === size - 1 && y === size - 1) {
			return true;
		}
		return false;
	}

	function isKingDead(kingCoord: Coordinates, lastMove: Coordinates) {
		if (board) {
			let isDead = true;
			if (
				board[kingCoord.x - 1][kingCoord.y].status ===
					board[kingCoord.x][kingCoord.y].status ||
				board[kingCoord.x - 1][kingCoord.y].status === SquareStatus.Free
			) {
				isDead = false;
			}
			if (
				board[kingCoord.x + 1][kingCoord.y].status ===
					board[kingCoord.x][kingCoord.y].status ||
				board[kingCoord.x - 1][kingCoord.y].status === SquareStatus.Free
			) {
				isDead = false;
			}
			if (
				board[kingCoord.x][kingCoord.y - 1].status ===
					board[kingCoord.x][kingCoord.y].status ||
				board[kingCoord.x - 1][kingCoord.y].status === SquareStatus.Free
			) {
				isDead = false;
			}
			if (
				board[kingCoord.x][kingCoord.y + 1].status ===
					board[kingCoord.x][kingCoord.y].status ||
				board[kingCoord.x - 1][kingCoord.y].status === SquareStatus.Free
			) {
				isDead = false;
			}
			return isDead;
		}
		return false;
	}

	function isAttackingKing(x: number, y: number) {
		if (board) {
			if (board[x - 1][y].isKing) {
				return { x: x - 1, y: y };
			}
			if (board[x + 1][y].isKing) {
				return { x: x + 1, y: y };
			}
			if (board[x][y - 1].isKing) {
				return { x: x, y: y - 1 };
			}
			if (board[x][y + 1].isKing) {
				return { x: x, y: y + 1 };
			}
		}
		return false;
	}

	function renderSquare(infos: SquareState) {
		let isEmpty = false;
		if (infos.status === SquareStatus.Free) {
			isEmpty = true;
		}
		let content;
		if (!isEmpty) {
			content = (
				<FontAwesomeIcon
					icon={infos.isKing ? 'chess-king' : 'chess-pawn'}
					color={infos.status === SquareStatus.Black ? 'black' : 'indigo'}
					size={'2x'}
				/>
			);
		} else {
			content = <span className={'empty'}>{infos.id}</span>;
		}
		const isSelected =
			infos.x === selectedCoord.coordinate?.x &&
			infos.y === selectedCoord.coordinate?.y
				? true
				: false;
		const isSelectedCSS = isSelected ? ' selected' : '';
		let isAvailable = false;
		if (!isSelected && selectedCoord.availables) {
			for (let i = 0; i < selectedCoord.availables.length; i++) {
				if (
					infos.x === selectedCoord.availables[i].x &&
					infos.y === selectedCoord.availables[i].y
				) {
					isAvailable = true;
					break;
				}
			}
		}
		const isAvailableCSS = isAvailable ? ' available' : '';
		const isGoal = isCorner(infos.x, infos.y) ? ' goal' : '';
		const isThrone =
			infos.x === Math.floor(size / 2) && infos.y === Math.floor(size / 2)
				? ' throne'
				: '';
		return (
			<button
				key={infos.id}
				className={
					'square' +
					`${isSelectedCSS}` +
					`${isAvailableCSS}` +
					`${isGoal}` +
					`${isThrone}`
				}
				onClick={async () => {
					if (board) {
						console.log('clicked on square: ', board[infos.x][infos.y]);
					}
					if (!boardState.active) {
						return;
					}
					//If a blank square is clicked and it is not available, clear movement options OR
					//If there is a selected square, and it is clicked again, clean movement options
					if ((isEmpty && !isAvailable) || isSelected) {
						//console.log('Cleaning!');
						cleanSelected();
					} else {
						//When turn 1, only allow whites to move
						//When turn 2, only allow blacks to move
						//If a piece is already selected, allow movement
						const player1turn = turn === Turn.Player1 ? true : false;
						const player1Piece =
							board && board[infos.x][infos.y].status === SquareStatus.White
								? true
								: false;
						const player2turn = turn === Turn.Player2 ? true : false;
						const player2Piece =
							board && board[infos.x][infos.y].status === SquareStatus.Black
								? true
								: false;
						if (
							(player1turn && player1Piece) ||
							(player2turn && player2Piece) ||
							(board && board[infos.x][infos.y].status === SquareStatus.Free)
						) {
							//console.log('Player selecting own piece!');
							//Check if player already has a selected piece or not
							//if it already have, he is moving or changing piece
							if (selectedCoord.coordinate) {
								//	console.log('A piece is already selected!');
								//changing place
								if (
									selectedCoord?.coordinate?.x &&
									selectedCoord?.coordinate?.y &&
									board &&
									board[selectedCoord?.coordinate?.x][
										selectedCoord.coordinate.y
									].status === board[infos.x][infos.y].status
								) {
									//console.log('Starting selected piece change logic!');
									//player turn with already selected piece, changing selected piece
									setSelectedCoord({
										coordinate: { x: infos.x, y: infos.y },
										availables: processAvailables(infos.x, infos.y),
									});
								} else {
									//console.log('Starting move piece logic!');
									// is the desired place available?
									if (
										board &&
										isAvailable &&
										(selectedCoord?.coordinate?.x ||
											selectedCoord?.coordinate?.x === 0) &&
										(selectedCoord?.coordinate?.y ||
											selectedCoord?.coordinate?.y === 0)
									) {
										//move
										let newBoard = board.map((row) => row.slice());
										const selectedRef =
											board[selectedCoord?.coordinate?.x][
												selectedCoord.coordinate.y
											];
										newBoard[infos.x][infos.y] = {
											...infos,
											isKing: selectedRef.isKing,
											status: selectedRef.status,
										};
										newBoard[selectedCoord?.coordinate?.x][
											selectedCoord?.coordinate?.y
										] = {
											...selectedRef,
											isKing: infos.isKing,
											status: infos.status,
										};
										//Rules
										const newInfo = newBoard[infos.x][infos.y];
										const isKingNear = isAttackingKing(newInfo.x, newInfo.y);
										if (
											newBoard[newInfo.x][newInfo.y].isKing &&
											isCorner(
												newBoard[newInfo.x][newInfo.y].x,
												newBoard[newInfo.x][newInfo.y].y
											)
										) {
											setBoardState({
												...boardState,
												active: false,
												winner: turn,
											});
										}
										if (
											isKingNear &&
											isKingDead(isKingNear, { x: newInfo.x, y: newInfo.y })
										) {
											setBoardState({
												...boardState,
												active: false,
												winner: turn,
											});
										} else {
											//around bottom
											if (
												newInfo.x < 11 &&
												newBoard[newInfo.x + 1][newInfo.y].status !==
													SquareStatus.Free &&
												newBoard[newInfo.x + 1][newInfo.y].status !==
													newInfo.status &&
												!newBoard[newInfo.x + 1][newInfo.y].isKing &&
												newBoard[newInfo.x + 2][newInfo.y].status ===
													newInfo.status
											) {
												newBoard[newInfo.x + 1][newInfo.y].status =
													SquareStatus.Free;
											}
											//around top
											if (
												newInfo.x > 1 &&
												newBoard[newInfo.x - 1][newInfo.y].status !==
													SquareStatus.Free &&
												newBoard[newInfo.x - 1][newInfo.y].status !==
													newInfo.status &&
												!newBoard[newInfo.x - 1][newInfo.y].isKing &&
												newBoard[newInfo.x - 2][newInfo.y].status ===
													newInfo.status
											) {
												newBoard[newInfo.x - 1][newInfo.y].status =
													SquareStatus.Free;
											}
											//around left
											if (
												newInfo.y > 1 &&
												newBoard[newInfo.x][newInfo.y - 1].status !==
													SquareStatus.Free &&
												newBoard[newInfo.x][newInfo.y - 1].status !==
													newInfo.status &&
												!newBoard[newInfo.x][newInfo.y - 1].isKing &&
												newBoard[newInfo.x][newInfo.y - 2].status ===
													newInfo.status
											) {
												newBoard[newInfo.x][newInfo.y - 1].status =
													SquareStatus.Free;
											}
											//around right
											if (
												newInfo.y < 11 &&
												newBoard[newInfo.x][newInfo.y + 1].status !==
													SquareStatus.Free &&
												newBoard[newInfo.x][newInfo.y + 1].status !==
													newInfo.status &&
												!newBoard[newInfo.x][newInfo.y + 1].isKing &&
												newBoard[newInfo.x][newInfo.y + 2].status ===
													newInfo.status
											) {
												newBoard[newInfo.x][newInfo.y + 1].status =
													SquareStatus.Free;
											}
										}

										//Rules end

										changeTurn();
										setBoard(newBoard);
										cleanSelected();
									} else {
										console.log('devia ter mexido');
										console.log(board, isAvailable, selectedCoord);
									}
								}
							} else {
								//not moving
								//if it is not yet selected, select and process available moves
								//proccess available positions
								//	console.log('First selection, processing available moves.');
								setSelectedCoord({
									coordinate: { x: infos.x, y: infos.y },
									availables: processAvailables(infos.x, infos.y),
								});
							}
						} else {
							console.log('q?');
						}
					}
				}}
			>
				{content}
			</button>
		);
	}

	function printBoard() {
		const boardToPrint = [];
		for (let i = 0; i < size; i++) {
			const row = [];
			for (let j = 0; j < size; j++) {
				if (board) {
					row.push(renderSquare(board[i][j]));
				}
			}
			boardToPrint.push(
				<div key={'row' + i} className="tableRow">
					{row}
				</div>
			);
		}
		return boardToPrint;
	}

	return (
		<div className="App">
			<div className="game-component">
				<div className="melhorias">
					<span>Melhorias:</span>
					<span>Explicação das regras: ALTA.</span>
					<span>Implementar regas relacionadas ao trono: ALTA.</span>
					<span>Implementar regas de captura utilizando as quinas: ALTA.</span>
					<span>Impedir que peças normais se movimentem em quinas: ALTA.</span>
					<span>Implementar regra shieldwall: MEDIA.</span>
					<span>Feedback visual: MEDIA.</span>
					<span>Animações de Feedback visual: BAIXA.</span>
				</div>
				<div className="table">
					<span>
						Jogador: {turn === Turn.Player1 ? 'Player 1' : 'Player 2'}
					</span>
					{!boardState.active ? (
						<span>
							Vencedor:{' '}
							{boardState.winner === Turn.Player1 ? 'Player 1' : 'Player 2'}
						</span>
					) : null}

					{board ? printBoard() : <span>Carregando tabuleiro.</span>}
					<button onClick={reset}>reset</button>
				</div>
				<div></div>
			</div>
		</div>
	);
}

export default App;
