import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectNotification, clearNotification } from '../features/notification/notificationSlice';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const dispatch = useDispatch();
  const notification = useSelector(selectNotification);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  if (!notification.message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 flex-shrink-0" />,
  };

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className={`toast-card toast-${notification.type}`}>
        {icons[notification.type] || icons.info}
        <span className="toast-message">{notification.message}</span>
        <button
          onClick={() => dispatch(clearNotification())}
          className="toast-close"
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
