import { Skeleton } from "@/components/ui/skeleton"

export function PostCardSkeleton() {
  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all relative">
      {/* Título */}
      <div className="flex-1">
        <Skeleton className="h-7 w-3/4 mb-4" />
        
        {/* Avatar e Nome */}
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Tags e Estrelas */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Skeleton className="h-6 w-20 rounded-full" />
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-4" />
            ))}
          </div>
        </div>

        {/* Botão de Like */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-4" />
        </div>
      </div>

      {/* Menu de Ações (três pontos) */}
      <div className="absolute top-4 right-4">
        <Skeleton className="h-6 w-6 rounded-lg" />
      </div>
    </div>
  )
} 