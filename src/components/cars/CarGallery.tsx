import { useState } from 'react'
import { Heart, Share2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useFavorites } from '@/hooks/useFavorites'
import { useToastStore } from '@/store/useToastStore'

export function CarGallery({ images, carId, name }: { images: string[]; carId: string; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(carId)
  const showToast = useToastStore((state) => state.show)

  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: name, url })
        return
      } catch {
        // user cancelled share sheet — fall through to clipboard copy
      }
    }
    await navigator.clipboard.writeText(url)
    showToast('Link copied to clipboard', 'success')
  }

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-ink-50">
        <img src={images[activeIndex]} alt={name} className="h-full w-full object-cover" />
        <div className="absolute right-3 top-3 flex gap-2">
          <button
            onClick={handleShare}
            aria-label="Share this vehicle"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-600 shadow-card hover:text-ink-900"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleFavorite(carId)}
            aria-pressed={favorite}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-600 shadow-card hover:text-danger-500"
          >
            <Heart className={cn('h-4 w-4', favorite && 'fill-danger-500 text-danger-500')} />
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
        {images.map((image, index) => (
          <button
            key={image + index}
            onClick={() => setActiveIndex(index)}
            aria-label={`View image ${index + 1}`}
            aria-current={activeIndex === index}
            className={cn(
              'aspect-[4/3] overflow-hidden rounded-md border-2',
              activeIndex === index ? 'border-ink-950' : 'border-transparent',
            )}
          >
            <img src={image} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
