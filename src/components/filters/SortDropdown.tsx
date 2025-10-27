'use client'

import { Fragment } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import type { SortOption } from '@/types/filter'

interface SortDropdownProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'newest', label: 'Newest' },
]

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const selected = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0]

  return (
    <div className="relative">
      <Listbox value={value} onChange={onChange}>
        {({ open }) => (
          <Fragment>
            <ListboxButton
              aria-label="Sort products"
              className="inline-flex items-center gap-2 rounded-md border border-mist bg-parchment px-3 py-2 text-sm text-bark shadow-sm transition-colors hover:bg-mist focus:outline-none focus:ring-2 focus:ring-fern"
            >
              <span className="text-bark/70">Sort:</span>
              <span className="font-medium text-bark">{selected.label}</span>
              <ChevronUpDownIcon aria-hidden="true" className="h-4 w-4 text-bark/50" />
            </ListboxButton>

            <ListboxOptions
              anchor="bottom start"
              className="mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-md border border-mist bg-parchment p-1 shadow-lg ring-1 ring-bark/10 focus:outline-none"
            >
              {OPTIONS.map((opt) => (
                <ListboxOption
                  key={opt.value}
                  value={opt.value}
                  className={({ active, selected }) =>
                    classNames(
                      'group flex cursor-pointer items-center justify-between rounded-[6px] px-3 py-2 text-sm',
                      active && 'bg-mist',
                      selected ? 'text-fern' : 'text-bark'
                    )
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={classNames('truncate', selected && 'font-medium')}>{opt.label}</span>
                      {selected && (
                        <CheckIcon aria-hidden="true" className="ml-3 h-4 w-4 text-fern" />
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Fragment>
        )}
      </Listbox>
    </div>
  )
}


