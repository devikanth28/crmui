import React, { useState } from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

const Checkbox = ({ id, name, label, value, checked: defaultChecked, onChange }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleCheckboxChange = () => {
    const newCheckedState = !isChecked;
    if (onChange) {
      setIsChecked(newCheckedState);
      onChange(newCheckedState);
    }
  };

  return (
    <FormGroup>
      <Label check>
        <Input class="form-check-input pointer"
          type="checkbox"
          id={id}
          name={name}
          value={value}
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        {' '}
        {label}
      </Label>
    </FormGroup>
  );
};

export default Checkbox;
