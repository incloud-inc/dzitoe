import { cn, getInisial } from '@/lib/utils';

type AvatarProps = {
  nama: string;
  className?: string;
};

export default function Avatar({ nama, className }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 font-semibold text-white',
        className,
      )}
    >
      {getInisial(nama)}
    </span>
  );
}
