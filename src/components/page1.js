import React, { useRef, useEffect, useState } from "react";
import userPrevious from "./count";
const Page1 = () => {
  const myRef2 = useRef(0);
  //   const [count, setCount] = useState(0);
  useEffect(() => {
    myRef2.current = count;
    document.title = `${Math.random()}`;
  });
  //   function handleClick() {
  //     setTimeout(() => {
  //       console.log(count); // 3d
  //       console.log(myRef2.current); // 6
  //     }, 3000);
  //   }
  const [count, setCount] = useState(0);
  const pre = userPrevious(count);
  return (
    <div>
      <div onClick={() => setCount(count + 1)}>点击count{count}</div>
      <div>
        cur:{count},before:{pre}
      </div>
    </div>
  );
};

export default Page1;
