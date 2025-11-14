'use client'

import { Fragment } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { classNames } from '@/lib/utils'
import type { ProductOption } from '@/types/product'

interface VariantDropdownProps {
  option: ProductOption
  value: string
  onChange: (value: string) => void
  isOptionAvailable: (value: string) => boolean
}

export default function VariantDropdown({
  option,
  value,
  onChange,
  isOptionAvailable,
}: VariantDropdownProps) {
  const placeholder = `Select ${option.name}`
  const displayValue = value || placeholder

  return (
    <div className="relative w-full">
      <Listbox value={value} onChange={onChange}>
        {({ open }) => (
          <Fragment>
            <ListboxButton
              aria-label={`Select ${option.name}`}
              className="w-full inline-flex items-center justify-between gap-2 rounded-md border border-mist bg-parchment px-4 py-3 text-sm text-bark shadow-sm transition-colors hover:bg-mist focus:outline-none focus:ring-2 focus:ring-fern"
            >
              <span className={classNames('truncate capitalize', !value && 'text-bark/60')}>
                {displayValue}
              </span>
              <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-bark/50 flex-shrink-0" />
            </ListboxButton>

            <ListboxOptions
              anchor="bottom start"
              className="mt-2 w-[var(--button-width)] rounded-md border border-mist bg-parchment p-1 shadow-lg ring-1 ring-bark/10 focus:outline-none z-10"
            >
              {option.values.map((optionValue) => {
                const isAvailable = isOptionAvailable(optionValue)
                const isSelected = value === optionValue

                return (
                  <ListboxOption
                    key={optionValue}
                    value={optionValue}
                    disabled={!isAvailable}
                    className={({ active }) =>
                      classNames(
                        'group flex cursor-pointer items-center justify-between rounded-[6px] px-3 py-2 text-sm',
                        active && isAvailable && 'bg-mist',
                        !isAvailable && 'cursor-not-allowed opacity-50',
                        isSelected && isAvailable ? 'text-fern' : 'text-bark'
                      )
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={classNames(
                            'truncate capitalize',
                            selected && isAvailable && 'font-medium',
                            !isAvailable && 'line-through'
                          )}
                        >
                          {optionValue}
                          {!isAvailable && (
                            <span className="ml-2 text-xs">(Out of stock)</span>
                          )}
                        </span>
                        {selected && isAvailable && (
                          <CheckIcon aria-hidden="true" className="ml-3 h-4 w-4 text-fern flex-shrink-0" />
                        )}
                      </>
                    )}
                  </ListboxOption>
                )
              })}
            </ListboxOptions>
          </Fragment>
        )}
      </Listbox>
    </div>
  )
}
