import AppRoutes from './routes';
import AppProviders from './app/AppProviders';

function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
