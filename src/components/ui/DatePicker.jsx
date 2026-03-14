import React from 'react';
import Input from './Input';

export const DatePicker = React.forwardRef((props, ref) => {
  return (
    <Input 
      type="date"
      ref={ref}
      {...props}
    />
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
