import Logo from "../assets/Logo.svg";

export default function Header() {
  return (
    <h1 className="mx-1 h-[101px] px-4 pt-18 pb-10 text-2xl font-bold tracking-tighter text-[var(--color-purple)] transition-colors">
      <img src={Logo} />
    </h1>
  );
}
