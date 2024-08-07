import React from 'react';
import { CircularProgress } from 'react-cssfx-loading';

const Loading: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </div>
  );
};

export default Loading;
