import { Loader2 } from "lucide-react"
import React from "react"

interface UseUtilsProps<T> {
    data?: T[]
    renderItem: (item: T) => React.ReactNode
    loading?: boolean
    className?: string

    error?: string | null
    emptyMessage?: string
}

export function useUtils<T>({
    data,
    renderItem,
    loading = false,
    error = null,
    emptyMessage = "No data found"
}: UseUtilsProps<T>) {

    if (loading) {
        return <Loader2 className="animate-spin size-4" />
    }

    if (error) {
        return <p>{error}</p>
    }

    if (!data || data.length === 0) {
        return <p>{emptyMessage}</p>
    }

    return (
        <>
            {data.map((item, index) => (
                <React.Fragment key={index}>
                    {renderItem(item)}
                </React.Fragment>
            ))}
        </>
    )
}