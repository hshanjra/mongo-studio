import { Skeleton } from "./ui/skeleton";

export const SidebarModelSkeleton = () => {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-1/2 h-10" />
      <Skeleton className="w-1/4 h-10" />
    </div>
  );
};
