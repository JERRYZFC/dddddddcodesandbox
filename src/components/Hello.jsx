import React, { useState, useEffect } from "react";
import Row from "./Row";

// #PSEUDO JS
// const name = "Thanos";
// const handleNameChange = (ev) => { name = ev.target.value; };

// #HOOKS STYLE
const useFormHook = initialValue => {
  const [value, setValue] = useState(initialValue);
  const handleChange = ev => setValue(ev.target.value);

  return { value, onChange: handleChange };
};

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);
  const handleChange = ev => setValue(ev.target.value);

  return [value, handleChange];
};

export default function Hello(props = {}) {
  // const [name, setName] = useState('Hooky');
  // const handleNameChange = (ev) => setName(ev.target.value);

  // const initialName = props.name ? props.name : "Fancy Defy";
  // const [name, handleNameChange] = useFormInput(initialName);
  const name = useFormHook("Potty");
  const surname = useFormHook("Poppins");

  // useEffect(() => {
  //   document.title = `Cheerio ${name}`;
  // });

  return (
    <React.Fragment>
      <Row label="Hello">
        {/* <input value={name} onChange={handleNameChange} /> */}
        <input {...name} />
        <input {...surname} />
      </Row>
    </React.Fragment>
  );
}
