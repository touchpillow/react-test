import {
  BorderOutlined,
  MinusOutlined,
  BorderInnerOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";

export default function Tool(props) {
  const { value } = props.item;
  const { mode } = props;
  const [color, setColor] = useState("#000");
  useEffect(() => {
    setColor(value === mode ? "#4d81ef" : "#000");
  }, [mode, value]);
  switch (value) {
    case "line":
      return <MinusOutlined style={{ color }} />;
    case "singleLine":
      return <MinusOutlined style={{ color }} />;
    case "rect":
      return <BorderOutlined style={{ color }} />;
    case "circle":
      return <MinusCircleOutlined style={{ color }} />;
    default:
      return <BorderInnerOutlined style={{ color }} />;
  }
}
