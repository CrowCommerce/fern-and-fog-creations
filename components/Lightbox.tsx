'use client'

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useEffect } from 'react'

interface LightboxProps {
  images: Array<{ src: string; alt: string; title: string }>
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}

export default function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrevious,
  onNext,
}: LightboxProps) {
  const currentImage = images[currentIndex]

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          onPrevious()
          break
        case 'ArrowRight':
          onNext()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onPrevious, onNext])

  if (!currentImage) return null

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[70]">
      <DialogBackdrop className="fixed inset-0 bg-moss/95 transition-opacity" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          <DialogPanel className="relative w-full max-w-5xl">
            {/* Image */}
            <div className="relative bg-bark/20 rounded-lg overflow-hidden max-h-[70vh] flex items-center justify-center">
              {/* Close Button - inside image container */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-bark/50 hover:bg-bark/70 text-parchment rounded-full transition-colors cursor-pointer"
                aria-label="Close lightbox"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <img
                src={currentImage.src}
                alt={currentImage.alt}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>

            {/* Image Info */}
            <div className="mt-4 text-center">
              <h3 className="text-xl font-display font-semibold text-parchment">
                {currentImage.title}
              </h3>
              <p className="mt-1 text-sm text-mist">
                {currentIndex + 1} of {images.length}
              </p>
            </div>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={onPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-bark/50 hover:bg-bark/70 text-parchment rounded-full transition-colors cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={onNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-bark/50 hover:bg-bark/70 text-parchment rounded-full transition-colors cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              </>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

