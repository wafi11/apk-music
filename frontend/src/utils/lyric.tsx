import { Mic2 } from "lucide-react";

export interface SyncedLine {
    time: number;
    text: string;
}
export function parseSynced(synced: string): SyncedLine[] {
    return synced
        .split("\n")
        .map((line) => {
            const match = line.match(/\[(\d+):(\d+(?:\.\d+)?)\](.*)/);
            if (!match) return null;
            const minutes = parseInt(match[1]);
            const seconds = parseFloat(match[2]);
            return { time: minutes * 60 + seconds, text: match[3].trim() };
        })
        .filter(Boolean) as SyncedLine[];
}


export function LyricLoadingSkeleton() {
    return (
        <div className="flex flex-col gap-3 pt-1 px-1">
            {["55%", "80%", "65%", "72%", "48%", "78%", "60%", "70%", "52%", "75%"].map((w, i) => (
                <div
                    key={i}
                    className="h-3 rounded-full bg-white/5 animate-pulse"
                    style={{ width: w, animationDelay: `${i * 80}ms` }}
                />
            ))}
        </div>
    );
}

export function LyricEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Mic2 size={22} className="text-white/20" />
            <p className="text-white/25 text-xs tracking-widest uppercase">
                No lyrics available
            </p>
        </div>
    );
}