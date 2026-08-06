import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex w-full items-center justify-between gap-3 outline-none transition-[border-color,box-shadow,background-color] focus-visible:ring-2 focus-visible:ring-[#8D9B7D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#1E1E1E]/15 bg-white text-[#6B7860] transition-transform duration-200 group-data-[state=open]:rotate-180">
        <ChevronDown size={15} aria-hidden="true" />
      </span>
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      sideOffset={7}
      className={cn(
        'relative z-[80] max-h-80 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border-2 border-[#1E1E1E] bg-[#FEFDF9] p-1.5 text-[#1E1E1E] shadow-[7px_7px_0_rgba(30,30,30,0.92)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-0.5">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex min-h-13 w-full cursor-default select-none items-center rounded-xl py-2.5 pl-10 pr-3 text-xs outline-none transition-colors focus:bg-[#E1ECD3] data-[state=checked]:bg-[#1E1E1E] data-[state=checked]:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-3 grid h-5 w-5 place-items-center">
      <SelectPrimitive.ItemIndicator>
        <Check size={14} className="text-[#C8D8B8]" aria-hidden="true" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
};
