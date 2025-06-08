import { useState } from 'react';
import Login from './components/Login';
import FileList from './components/FileList';

function App() {
  const [provider, setProvider] = useState(null);

  return (
    <div>
      {!provider ? (
        <Login onLogin={setProvider} />
      ) : (
        <FileList providerId={provider.id} />
      )}
    </div>
  );
}

export default App;
