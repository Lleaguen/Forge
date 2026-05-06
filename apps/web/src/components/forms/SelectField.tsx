'use client'

interface SelectOption {
  value: string
  label: string
  description?: string
}

interface SelectFieldProps {
  options: SelectOption[]
  register: any
  name: string
  selectedValue?: string
}

export function SelectField({ options, register, name, selectedValue }: SelectFieldProps) {
  const selectedOption = options.find(opt => opt.value === selectedValue)
  
  return (
    <>
      <select
        {...register(name)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {selectedOption?.description && (
        <p className="mt-1 text-xs text-gray-500">
          {selectedOption.description}
        </p>
      )}
    </>
  )
}