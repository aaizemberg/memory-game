"use client";

import { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

const malePlayers   = [{"name":"WANG Chuqin","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/121558_Headshot_R_WANG_Chuqin.png","rank":1},{"name":"LIN Shidong","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/137237_Headshot_R_LIN_Shidong.png","rank":2},{"name":"Hugo CALDERANO","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/115641_Headshot_R_CALDERANO_Hugo.png","rank":3},{"name":"Tomokazu HARIMOTO","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/123980_Headshot_R_Tomokazu HARIMOTO.png","rank":4},{"name":"Truls MOREGARD","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/122044_Headshot_R_MOREGARD_Truls.png","rank":5},{"name":"Felix LEBRUN","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/135977_HEADSHOT_R_Felix_LEBRUN.png","rank":6},{"name":"LIANG Jingkun","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/119588_Headshot_R_LIANG_Jingkun.png","rank":7},{"name":"Sora MATSUSHIMA","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/135996_Headshot_R_Sora MATSUSHIMA.png","rank":8},{"name":"Alexis LEBRUN","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/132992_HEADSHOT_R_LEBRUN_Alexis.png","rank":9},{"name":"Dang QIU","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/114715_Headshot_R_QIU_Dang.png","rank":10}]
const femalePlayers = [{"name":"SUN Yingsha","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/131163_HEADSHOT_R_SUN_Yingsha.png","rank":1},{"name":"WANG Manyu","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/121411_Headshot_R_WANG_Manyu.png","rank":2},{"name":"KUAI Man","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/135049_Headshot_R_KUAI_Man.png","rank":3},{"name":"CHEN Xingtong","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/121403_Headshot_R_CHEN_Xingtong.png","rank":4},{"name":"WANG Yidi","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/124110_Headshot_R_WANG_Yidi.png","rank":5},{"name":"Miwa HARIMOTO","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/136711_Headshot_R_Miwa HARIMOTO.png","rank":6},{"name":"ZHU Yuling","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/117332_Headshot_R_ZHU_Yuling.png","rank":7},{"name":"CHEN Yi","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/132132_Headshot_R_CHEN_Yi.png","rank":8},{"name":"Mima ITO","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/117821_HEADSHOT_R_Mima_ITO 1.png","rank":9},{"name":"Hina HAYATA","image":"https://wttsimfiles.blob.core.windows.net/wtt-media/photos/400px/123672_Headshot_R_HAYATA_Hina.png","rank":10}]

interface Player {
  name: string;
  image: string;
  rank: number;
}

interface Card extends Player {
  id: number;
  isFlipped: boolean;
  isMatched: boolean;
}

const shuffle = (array: Card[]): Card[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const createCards = (players: Player[]) => {
  const pairs = [...players, ...players].map((player, index) => ({
    id: index,
    ...player,
    isFlipped: false,
    isMatched: false
  }));
  return shuffle(pairs);
};

export default function MemoryGame() {
  // Estados para controlar el flujo del juego
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Función para iniciar el juego con la categoría seleccionada
  const startGame = (gender: 'male' | 'female') => {
    setSelectedGender(gender);
    setCards(createCards(gender === 'male' ? malePlayers : femalePlayers));
    setGameStarted(true);
    // Reiniciamos todos los estados del juego
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
    setShowAlert(false);
  };

  useEffect(() => {
    if (gameWon) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [gameWon]);

  const handleCardClick = (clickedCard: Card): void => {
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

  // Función modificada para volver a la pantalla de selección
  const resetGame = () => {
    setGameStarted(false);
    setSelectedGender(null);
    setCards([]);
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
    setShowAlert(false);
  };

  // Pantalla de selección inicial
  if (!gameStarted) {
    return (
      <div className="h-screen w-screen max-w-[1280px] max-h-[768px] mx-auto overflow-hidden">
        <div className="h-full flex flex-col items-center justify-center gap-8">
          <h1 className="text-3xl font-bold">Memoria: Top 10 Tenis de Mesa</h1>
          <div className="flex gap-4">
            <button
              onClick={() => startGame('male')}
              className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Jugar con Top 10 Masculino
            </button>
            <button
              onClick={() => startGame('female')}
              className="px-8 py-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Jugar con Top 10 Femenino
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla del juego
  return (
    <div className="h-screen w-screen max-w-[1280px] max-h-[768px] mx-auto overflow-hidden">
      <div className="p-2 h-full flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold">
            Memoria: Top 10 {selectedGender === 'male' ? 'Masculino' : 'Femenino'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-lg">Movimientos: {moves}</span>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700"
            >
              <Shuffle size={16} />
              Restart
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
                card.isFlipped || card.isMatched ? 'bg-white' : 'bg-gray-500'
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
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-500">
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
