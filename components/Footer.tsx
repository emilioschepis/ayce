type Props = {};

const Footer: React.FC<Props> = () => {
  return (
    <footer className="flex h-12 items-center justify-center bg-white p-4">
      <a
        href="https://github.com/emilioschepis/ayce"
        className="mr-1 text-blue-700"
      >
        GitHub
      </a>
      •
      <a
        href="https://twitter.com/emilioschepis"
        className="mx-1 text-blue-700"
      >
        Twitter
      </a>
      • 2022
    </footer>
  );
};

export default Footer;
