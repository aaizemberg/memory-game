"use client"; // Esto convierte al componente en un client component (sugerencia de ChatGPT)

import { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

const players = [
  {
    name: "WANG Chuqin",
    image: "https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/121558_Headshot_R_WANG_Chuqin.png",
    rank: 1
  },
  {
    name: "LIN Shidong",
    image: "https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/137237_Headshot_R_LIN_Shidong.png",
    rank: 2
  },
  {
    name: "FAN Zhendong",
    image: "https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/121404_Headshot_R_FAN_Zhendong.png",
    rank: 3
  },
  {
    name: "LIANG Jingkun",
    image: "https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/119588_Headshot_R_LIANG_Jingkun.png",
    rank: 4
  },
  {
    name: "Felix LEBRUN",
    image: "https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/135977_HEADSHOT_R_Felix_LEBRUN.png",
    rank: 5
  },
  {
    name: "MA Long",
    image: "https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/105649_Headshot_R_MA_Long.png",
    rank: 6
  },
  {
    name: "Hugo CALDERANO",
    image: "https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/115641_Headshot_R_CALDERANO_Hugo.png",
    rank: 7
  },
  {
    name: "Tomokazu HARIMOTO",
    image: "https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/123980_HEADSHOT_R_Tomokazu_HARIMOTO.png",
    rank: 8
  },
  {
    name: "LIN Gaoyuan",
    image: "https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/115910_Headshot_R_LIN_Gaoyuan.png",
    rank: 9
  },
  {
    name: "Patrick FRANZISKA",
    image: "https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/102832_Headshot_R_FRANZISKA_Patrick.png",
    rank: 10
  }
];

const createCards = () => {
  const pairs = [...players, ...players].map((player, index) => ({
    id: index,
    ...player,
    isFlipped: false,
    isMatched: false
  }));
  return shuffle(pairs);
};

const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Nuevo estado para controlar la visibilidad de la alerta

  useEffect(() => {
    setCards(createCards());
  }, []);

  useEffect(() => {
    if (gameWon) {
      setShowAlert(true); // Muestra la alerta al ganar el juego
      const timer = setTimeout(() => {
        setShowAlert(false); // Oculta la alerta después de 5 segundos
      }, 5000);
      
      // Limpieza del timer si el componente se desmonta antes
      return () => clearTimeout(timer);
    }
  }, [gameWon]);

  const handleCardClick = (clickedCard) => {
    if (flippedCards.length === 2 || clickedCard.isFlipped || clickedCard.isMatched) return;

    const newCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      if (newFlippedCards[0].name === newFlippedCards[1].name) {
        setTimeout(() => {
          const matchedCards = cards.map(card =>
            card.name === newFlippedCards[0].name ? { ...card, isMatched: true } : card
          );
          setCards(matchedCards);
          setFlippedCards([]);
          
          if (matchedCards.every(card => card.isMatched)) {
            setGameWon(true);
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = cards.map(card =>
            card.id === newFlippedCards[0].id || card.id === newFlippedCards[1].id
              ? { ...card, isFlipped: false }
              : card
          );
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(createCards());
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
  };

  return (
    <div className="h-screen w-screen max-w-[1280px] max-h-[768px] mx-auto overflow-hidden">
      <div className="p-2 h-full flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold">Memoria: Top 10 Tenis de Mesa</h1>
          <div className="flex items-center gap-4">
            <span className="text-lg">Movimientos: {moves}</span>
            <button 
              onClick={resetGame}
              className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Shuffle size={16} />
              Reiniciar
            </button>
          </div>
        </div>

        {showAlert && (
          <Alert className="mb-2 py-1 bg-green-100">
            <AlertTitle>¡Felicitaciones! Has completado el juego en {moves} movimientos</AlertTitle>
          </Alert>
        )}

        <div className="grid grid-cols-5 gap-2 flex-1">
          {cards.map((card) => (
            <Card
              key={card.id}
              className={`w-full h-full cursor-pointer transition-all duration-300 ${
                card.isFlipped || card.isMatched ? 'bg-white' : 'bg-blue-500'
              }`}
              onClick={() => handleCardClick(card)}
            >
              <div className="h-full flex items-center justify-center">
                {(card.isFlipped || card.isMatched) ? (
                  <div className="text-center p-2 flex flex-col items-center justify-between h-full">
                    <div className="w-20 h-32 overflow-hidden mb-1 flex-shrink-0">
                      <img 
                        src={card.image} 
                        alt={card.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <p className="text-xs font-medium line-clamp-2">{card.name} (#{card.rank})</p>
                        {/* <p className="text-xs text-gray-600">Rank #{card.rank}</p> */}
                    </div>
                    
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-500">
                    <span className="text-white text-4xl">?</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
