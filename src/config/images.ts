/**
 * Centralized image configuration. No component or data file should embed a
 * raw image URL — everything routes through here so the source can move to
 * a CDN/backend later without touching UI code.
 *
 * NOTE: These are real photos of GK Solutions' actual fleet vehicles
 * (Chevrolet Spark, Chevrolet Beat, Toyota Hyryder, BMW X3).
 */

import spark from '@/assets/cars/spark.avif'
import beat from '@/assets/cars/beat.jpg'
import hyryder from '@/assets/cars/hyryder.jpeg'
import hyryder2 from '@/assets/cars/hyryder-2.webp'
import hyryder3 from '@/assets/cars/hyryder-3.jpeg'
import bmwX3 from '@/assets/cars/bmw-x3.jpeg'
import bmwX3_2 from '@/assets/cars/bmw-x3-2.jpeg'
import bmwX3_3 from '@/assets/cars/bmw-x3-3.avif'

import banner1 from '@/assets/banners/banner-1.jpg'
import banner2 from '@/assets/banners/banner-2.jpg'
import banner3 from '@/assets/banners/banner-3.jpg'
import banner4 from '@/assets/banners/banner-4.jpg'

export const carImagesBySlug: Record<string, string[]> = {
  spark: [spark],
  beat: [beat],
  hyryder: [hyryder, hyryder2, hyryder3],
  'bmw-x3': [bmwX3, bmwX3_2, bmwX3_3],
}

export const heroImage = bmwX3

export const promoBanners = [banner1, banner2, banner3, banner4]

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`

export const avatarPool = [
  unsplash('photo-1494790108377-be9c29b29330'),
  unsplash('photo-1544005313-94ddf0286df2'),
  unsplash('photo-1500648767791-00dcc994a43e'),
  unsplash('photo-1580489944761-15a19d654956'),
  unsplash('photo-1517841905240-472988babdf9'),
  unsplash('photo-1438761681033-6461ffad8d80'),
]
