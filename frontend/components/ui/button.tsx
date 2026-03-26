interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...props }: ButtonProps) {
  const buttonClassName = className ? `button ${className}` : 'button';

  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
}
