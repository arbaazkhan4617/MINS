import { SkeletonCard } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="container-wide grid gap-6 py-16 md:grid-cols-2 lg:grid-cols-3">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </section>
  );
}
