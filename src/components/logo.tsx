import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Image
        src="/favicon.ico"
        alt="Felafrika Technologies Logo"
        width={32}
        height={32}
        className="h-8 w-8"
      />
      <div className="flex flex-col">
        <span className="font-bold text-2xl tracking-tighter" style={{ color: '#F97316' }}>
          FELAFRIKA
        </span>
        <span className="text-xs tracking-widest text-foreground/80">TECHNOLOGIES</span>
      </div>
    </div>
  );
}
