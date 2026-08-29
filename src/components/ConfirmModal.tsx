import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDangerous = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="confirm-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs"
      onClick={onCancel}
    >
      <div
        id="confirm-modal-box"
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isDangerous
                ? 'bg-rose-100 text-rose-600'
                : 'bg-amber-100 text-amber-600'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-neutral-900">{title}</h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            id="confirm-modal-cancel"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            id="confirm-modal-confirm"
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-semibold text-white rounded-xl transition-all shadow-sm ${
              isDangerous
                ? 'bg-rose-600 hover:bg-rose-500'
                : 'bg-neutral-900 hover:bg-neutral-800'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
