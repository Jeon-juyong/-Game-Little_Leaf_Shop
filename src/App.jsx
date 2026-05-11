import { GameProvider, useGame } from './context/GameContext';
import TitleScreen from './screens/TitleScreen';
import MainShop from './screens/MainShop';
import CustomerScreen from './screens/CustomerScreen';
import PlantSelectionScreen from './screens/PlantSelectionScreen';
import ResultScreen from './screens/ResultScreen';
import ShopDecorateScreen from './screens/ShopDecorateScreen';
import PlantEncyclopediaScreen from './screens/PlantEncyclopediaScreen';
import StorageScreen from './screens/StorageScreen';
import PlantDiscoveryScreen from './screens/PlantDiscoveryScreen';

function GameRouter() {
  const { state } = useGame();

  return (
    <div className="game-wrapper">
      {state.screen === 'title' && <TitleScreen />}
      {state.screen === 'main' && <MainShop />}
      {state.screen === 'customer' && <CustomerScreen />}
      {state.screen === 'plant-select' && <PlantSelectionScreen />}
      {state.screen === 'result' && <ResultScreen />}
      {state.screen === 'decorate' && <ShopDecorateScreen />}
      {state.screen === 'encyclopedia' && <PlantEncyclopediaScreen />}
      {state.screen === 'storage' && <StorageScreen />}
      {state.screen === 'discovery' && <PlantDiscoveryScreen />}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
