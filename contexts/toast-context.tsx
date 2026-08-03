import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Info, X } from 'lucide-react-native';
import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, View } from 'react-native';

interface ToastOptions {
  title: string;
  message: string | null;
  duration: number | null;
}

interface ToastContextData {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextData | undefined>(undefined);

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const opacityInitialValue: number = 0;
  const opacityFinalValue: number = 1;

  const translateYInitialValue: number = -20;
  const translateYFinalValue: number = 0;

  const animationDuration: number = 250;

  const timeoutDefaultDuration: number = 3000;

  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  const opacity = useRef(new Animated.Value(opacityInitialValue)).current;
  const translateY = useRef(new Animated.Value(translateYInitialValue)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: opacityInitialValue,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: translateYInitialValue,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setOpen(false);
      setTitle('');
      setMessage(null);
    });
  }, [opacity, translateY]);

  const showToast = useCallback(
    ({ title, message, duration }: ToastOptions) => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      setOpen(true);
      setTitle(title);
      setMessage(message);

      opacity.setValue(opacityInitialValue);
      translateY.setValue(translateYInitialValue);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: opacityFinalValue,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: translateYFinalValue,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();

      timeoutRef.current = setTimeout(hideToast, duration ?? timeoutDefaultDuration);
    },
    [opacity, translateY, hideToast]
  );

  const handleClose = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    hideToast();
  }, [hideToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {open && (
        <Animated.View
          className="rounded-xl border border-border bg-background"
          style={{
            position: 'absolute',
            top: 50,
            left: 20,
            right: 20,
            padding: 14,
            zIndex: 999,
            opacity,
            transform: [{ translateY }],
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8,
          }}>
          <Icon as={Info} size={24} />
          <View style={{ flex: 1 }}>
            <Text className="text-xl text-foreground">{title}</Text>
            {message !== null && <Text className="text-sm text-muted-foreground">{message}</Text>}
          </View>
          <Icon as={X} size={24} onPress={hideToast} />
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast must be used inside of a ToastProvider');
  }

  return context;
}
