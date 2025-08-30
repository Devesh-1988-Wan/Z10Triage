'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export function usePresence(roomId: string){
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [users, setUsers] = useState<string[]>([])

  useEffect(()=>{
    const channel = supabase.channel(`room:${roomId}`, { config: { presence: { key: crypto.randomUUID() } } })
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState() as Record<string, any>
        setUsers(Object.keys(state))
      })
      .subscribe(async (status)=>{
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() })
        }
      })
    return ()=> { supabase.removeChannel(channel) }
  },[roomId])

  return users
}
