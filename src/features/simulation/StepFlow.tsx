import { useUIStore } from '@/stores/useUIStore';
import { motion } from 'framer-motion';

export const StepFlow = () => {
  const { currentStep, totalSteps } = useUIStore();

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-4">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                currentStep >= i + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`hidden sm:block absolute w-full h-1 -z-10 top-5 transition-colors ${
                  currentStep > i + 1 ? 'bg-indigo-600' : 'bg-muted'
                }`}
                style={{ width: '100%', left: '50%' }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};
