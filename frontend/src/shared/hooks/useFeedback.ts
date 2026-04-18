import { useState } from 'react';

interface UseFeedbackOptions {
  autoClose?: number;
}

export function useFeedback(options: UseFeedbackOptions = {}) {
  const { autoClose = 3000 } = options;
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; msg: string } | null>(null);

  const showSuccess = (msg: string) => {
    setFeedback({ type: 'success', msg });
    if (autoClose) setTimeout(() => setFeedback(null), autoClose);
  };

  const showError = (msg: string) => {
    setFeedback({ type: 'error', msg });
    if (autoClose) setTimeout(() => setFeedback(null), autoClose);
  };

  const showWarning = (msg: string) => {
    setFeedback({ type: 'warning', msg });
    if (autoClose) setTimeout(() => setFeedback(null), autoClose);
  };

  const showInfo = (msg: string) => {
    setFeedback({ type: 'info', msg });
    if (autoClose) setTimeout(() => setFeedback(null), autoClose);
  };

  const clear = () => setFeedback(null);

  return {
    feedback,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clear,
    isVisible: !!feedback
  };
}

