import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
};

export default LoadingSpinner;
