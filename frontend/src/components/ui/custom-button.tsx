
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const CustomButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    fullWidth, 
    leftIcon, 
    rightIcon, 
    children, 
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/90': variant === 'secondary',
            'bg-accent text-accent-foreground hover:bg-accent/90': variant === 'accent',
            'bg-success text-accent-foreground hover:bg-success/90': variant === 'success',
            'border border-input bg-transparent hover:bg-primary/10 hover:text-primary': variant === 'outline',
            'bg-transparent hover:bg-accent/10 hover:text-accent': variant === 'ghost',
            'text-sm px-3 py-1.5': size === 'sm',
            'text-base px-4 py-2': size === 'md',
            'text-lg px-5 py-2.5': size === 'lg',
            'w-full': fullWidth,
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

CustomButton.displayName = 'CustomButton';

export { CustomButton };
