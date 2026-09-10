export interface Extra {
  id: string
  name: string
  description: string
  pricePerDay: number
  icon: string
  available: boolean
}

export interface SelectedExtra {
  extraId: string
  quantity: number
}
