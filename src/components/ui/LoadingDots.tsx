export default function LoadingDots() {
  return (
    <div className="flex gap-2">
      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-200ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-100ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" />
    </div>
  );
}
