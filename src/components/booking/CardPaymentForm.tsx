import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { cardPaymentSchema, type CardPaymentFormValues } from '@/lib/validation'
import { formatCardNumber, formatExpiry } from '@/lib/format'

interface CardPaymentFormProps {
  onSubmit: (values: CardPaymentFormValues) => void
  formId: string
}

export function CardPaymentForm({ onSubmit, formId }: CardPaymentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CardPaymentFormValues>({
    resolver: zodResolver(cardPaymentSchema),
    defaultValues: { cardNumber: '', cardHolderName: '', expiry: '', cvv: '' },
  })

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Card number"
        inputMode="numeric"
        placeholder="4242 4242 4242 4242"
        value={watch('cardNumber')}
        onChange={(e) => setValue('cardNumber', formatCardNumber(e.target.value), { shouldValidate: true })}
        error={errors.cardNumber?.message}
      />
      <Input label="Name on card" placeholder="As printed on the card" {...register('cardHolderName')} error={errors.cardHolderName?.message} />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Expiry"
          placeholder="MM/YY"
          inputMode="numeric"
          value={watch('expiry')}
          onChange={(e) => setValue('expiry', formatExpiry(e.target.value), { shouldValidate: true })}
          error={errors.expiry?.message}
        />
        <Input label="CVV" placeholder="123" inputMode="numeric" maxLength={4} {...register('cvv')} error={errors.cvv?.message} />
      </div>
      <p className="text-xs text-ink-400">
        Test card: use 4242 4242 4242 4242 for success, or 4000 0000 0000 0002 to simulate a decline. No real card data is transmitted.
      </p>
    </form>
  )
}
