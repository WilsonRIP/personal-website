import { komikax, heyComic, kgHappy, orangeJuice2 } from '@/app/fonts';

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${komikax.variable} ${heyComic.variable} ${kgHappy.variable} ${orangeJuice2.variable}`}>
      <div className="font-komikax">
        {children}
      </div>
    </div>
  );
} 