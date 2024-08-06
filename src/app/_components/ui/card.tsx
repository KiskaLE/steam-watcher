export default async function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-100 p-10 shadow-md">
      {children}
    </div>
  );
}
