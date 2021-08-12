import { useEffect, useRef } from "react";

function userPrevious(state) {
  const ref = useRef();
  useEffect(() => {
    ref.current = state;
  });
  return ref.current;
}
export default userPrevious;
