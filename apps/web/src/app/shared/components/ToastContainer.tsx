'use client'

import { ToastContainer as ReactToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function ToastContainer() {
  return (
    <ReactToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastClassName="!bg-white !text-slate-900 dark:!bg-slate-800 dark:!text-white !border !border-slate-200 dark:!border-slate-700 !shadow-lg !rounded-lg"
      bodyClassName="!text-sm !font-medium"
      progressClassName="!bg-brand-primary"
      closeButton={({ closeToast }) => (
        <button
          onClick={closeToast}
          className="!text-slate-400 hover:!text-slate-600 dark:hover:!text-slate-300 !opacity-70 hover:!opacity-100 !text-lg !font-bold !leading-none !p-1"
        >
          ×
        </button>
      )}
    />
  )
}