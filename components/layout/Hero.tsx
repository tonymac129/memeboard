interface HeroProps {
  text: string;
  description: string;
  children?: React.ReactNode;
}

function Hero({ text, description, children }: HeroProps) {
  return (
    <div className="flex flex-col py-10 gap-y-5 items-center">
      <h1 className="text-green-500 font-bold text-4xl">{text}</h1>
      <p className="text-zinc-300 w-[50%] text-center">{description}</p>
      {children}
    </div>
  );
}

export default Hero;
