import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn' // Usando el alias que configuramos

type Props = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean
  label?: string
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, hasError, label, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {/* Label dinámico basado en la imagen */}
        {label && (
          <label 
            htmlFor={id} 
            className="text-[13px] font-bold text-slate-700 block ml-1 dark:text-brand-text"
          >
            {label}
          </label>
        )}
        
        <input
          id={id}
          ref={ref}
          className={cn(
            'w-full h-[46px] px-4 rounded-xl bg-white text-sm transition-all duration-200 dark:bg-brand-bg',
            'border outline-none appearance-none dark:border-[#FF7A1A]',
            'placeholder:text-slate-400 text-slate-700 dark:text-brand-primary',

            // Estado Normal
            !hasError && [
              'border-slate-200',
              'focus:border-[#FF7A1A] focus:ring-4 focus:ring-[#FF7A1A]/10'
            ],

            // Estado Error
            hasError && [
              'border-red-400 text-red-900',
              'focus:border-red-500 focus:ring-4 focus:ring-red-100'
            ],

            // Estilos para tipos específicos (ej. date, file)
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'
export { Input }; 
export default Input;