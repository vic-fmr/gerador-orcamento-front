import React, { useState, useRef, useEffect } from 'react'
import { Check, ChevronsUpDown, Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useClientStore } from '@/store/useClientStore'

interface ClientSelectProps {
  value: string
  onChange: (value: string) => void
  id?: string
}

export function ClientSelect({ value, onChange, id }: ClientSelectProps) {
  const clients = useClientStore((state) => state.clients)
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (clientName: string) => {
    onChange(clientName)
    setIsOpen(false)
    setSearchTerm('')
  }

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      <Button
        id={id}
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className="w-full justify-between h-9 px-3 text-left font-normal"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {value || "Selecione um cliente..."}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-card text-card-foreground shadow-lg animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Procurar cliente..."
              aria-label="Procurar cliente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}    
              autoFocus
            />          </div>
          <div className="max-h-[300px] overflow-y-auto p-1">
            {filteredClients.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Nenhum cliente encontrado.
              </div>
            ) : (
              filteredClients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => handleSelect(client.name)}
                >
                  <Check className={`mr-2 h-4 w-4 text-primary ${value === client.name ? 'opacity-100' : 'opacity-0'}`} />
                  {client.name}
                </button>
              ))
            )}
            
            <div className="border-t border-border mt-1 pt-1">
               <button
                 type="button"
                 className="flex w-full items-center rounded-sm px-2 py-2 text-sm text-primary font-medium hover:bg-primary hover:text-white cursor-pointer transition-colors"
                 onClick={() => {
                   if (searchTerm) handleSelect(searchTerm)
                 }}
               >
                 <Plus className="mr-2 h-4 w-4" />
                 {searchTerm ? `Adicionar "${searchTerm}"` : "Novo Cliente"}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
