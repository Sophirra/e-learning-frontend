export function Content({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-44 z-0 h-[calc(100vh-11rem)] overflow-y-auto">
      {children}
    </div>
  );
  // ">{children}</div>;
}
