export function LoadingTile({ text }: { text?: string }) {
  return (
    <div className="gap-2 p-4 bg-slate-100 rounded-lg shadow-md hover:bg-slate-200 transition-all text-base">
      {text || "Loading..."}
    </div>
  );
}
