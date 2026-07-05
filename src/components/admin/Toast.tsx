"use client";

import { useEffect, useState, createContext, useContext, useCallback } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2);
    setItems(prev => [...prev, { id, type, message }]);
    setTimeout(() => setItems(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
        {items.map(item => (
          <ToastItem
            key={item.id}
            item={item}
            onDismiss={() => setItems(prev => prev.filter(t => t.id !== item.id))}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const colors = {
    success: { bg: "bg-green-50 border-green-200", icon: "text-green-500", text: "text-green-800" },
    error:   { bg: "bg-red-50 border-red-200",     icon: "text-red-500",   text: "text-red-800"   },
    info:    { bg: "bg-blue-50 border-blue-200",    icon: "text-blue-500",  text: "text-blue-800"  },
  }[item.type];

  const Icon = item.type === "success" ? CheckCircle : item.type === "error" ? XCircle : AlertCircle;

  return (
    <div
      className={[
        "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-64 max-w-80",
        "transition-all duration-300",
        colors.bg,
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      ].join(" ")}
    >
      <Icon size={17} className={`flex-shrink-0 ${colors.icon}`} />
      <span className={`flex-1 text-sm font-medium ${colors.text}`}>{item.message}</span>
      <button onClick={onDismiss} className={`${colors.icon} opacity-60 hover:opacity-100`}>
        <X size={14} />
      </button>
    </div>
  );
}
