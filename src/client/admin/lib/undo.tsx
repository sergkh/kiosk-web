import { toast } from "react-hot-toast";

/**
 * Executes an action after a delay, but allows user to cancel via toast.
 * 
 * @param message - Message to show in toast
 * @param action - The function to execute after delay
 * @param options - Optional { undoLabel, delay, onUndo }
 */
export default function performWithUndo(
  message: string,
  action: () => Promise<void> | void,
  options?: {
    undoLabel?: string;
    delay?: number;
    onUndo?: () => void;
  }
) {
  const undoLabel = options?.undoLabel ?? "Скасувати";
  const delay = options?.delay ?? 3000;

  const undoStyle = {'textDecoration': 'underline'}

  let cancelled = false;

  const toastId = toast((t) => 
    (
      <div>
        <span>{message}</span>
        &nbsp;
        <a style={undoStyle} onClick={() => {
            cancelled = true;
            options?.onUndo?.();
            toast.dismiss(t.id);
          }}
        >
          {undoLabel}
        </a>
      </div>
    ),
    { duration: delay }
  );

  setTimeout(() => {
    if (!cancelled) {
      try {
        action();
      } catch (err) {
        toast.error("Не вдалось виконати дію");
        options?.onUndo?.();
        console.error(err);
      }
    }
  }, delay);
}

const timeouts: Map<string, NodeJS.Timeout> = new Map();

export function delayedAction<T>(name: string, action: () => Promise<T> | T, delay: number = 2000) {  
  const existingTimeout = timeouts.get(name);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }
  const timeout = setTimeout(() => {
    action()    
  }, delay);

  timeouts.set(name, timeout);
}