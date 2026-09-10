import { extras } from '@/data/extras'
import { delay } from '@/lib/delay'
import type { ApiResult } from '@/types/common'
import type { Extra } from '@/types/extras'

export interface ExtrasApi {
  getExtras(): Promise<ApiResult<Extra[]>>
}

export const mockExtrasApi: ExtrasApi = {
  async getExtras() {
    await delay(150)
    return { success: true, data: extras }
  },
}
