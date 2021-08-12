import { useEffect, useRef, useState } from "react";
import { Select, Input, Button, InputNumber, Upload } from "antd";
import "./canvas.css";
import Tool from "./Tool";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
const { Option } = Select;
function MoveCom() {
  const defaultWidth = 1000;
  const defaultHeight = 750;
  const canvasEle = useRef();
  const ctx = canvasEle.current?.getContext("2d");
  const list = [
    {
      value: "line",
      title: "线条",
    },
    {
      value: "singleLine",
      title: "直线",
    },
    // {
    //   value: "circle",
    //   title: "圆",
    // },
    // {
    //   value: "abrase",
    //   title: "马赛克",
    // },
  ];
  const lineWidthList = [1, 2, 4, 6];
  const [mode, setMode] = useState("line");
  const [isStart, setIsStart] = useState(false);
  const [initPosition, setInitPosition] = useState({ x: 0, y: 0 });
  const [recordIndex, setRecordIndex] = useState(1);
  const [lineWidth, setLineWidth] = useState(1);
  const [lineColor, setLineColor] = useState("#000000");
  const [canvasTranslate, setTranslate] = useState([0, 0]);
  const [scale, setScale] = useState(100);
  const [canvasSize, setCanvasSize] = useState([defaultWidth, defaultHeight]);
  const [isPathMove, setIsPathMove] = useState(false);
  /**
   * 获取默认的数据记录
   * @param {*} x
   * @param {*} y
   * @returns
   */
  const getInitState = (x = 0, y = 0) => {
    return {
      type: "transform",
      id: Math.random(),
      transform: [
        [100, 100],
        [x, y],
      ],
    };
  };
  const [canvasState, setCanvasState] = useState([getInitState()]);

  /**
   * 修改缩放比例
   * @param {*} v
   */
  const setScale2 = (v) => {
    setScale(v);
    const preState = canvasState.slice(0, recordIndex);
    setCanvasState(
      preState.concat({
        type: "transform",
        id: Math.random(),
        transform: [
          [v, v],
          [canvasTranslate[0], canvasTranslate[1]],
        ],
      })
    );
    setRecordIndex(recordIndex + 1);
  };

  /**
   * 修改线条颜色
   * @param {*} e
   */
  const setLineColor2 = (e) => {
    setLineColor(e.target.value);
  };

  /**
   * 替换最后一个操作记录
   * @param {*} newState
   */
  const replaceState = (newState) => {
    const state = canvasState.slice(0, canvasState.length - 1);
    setCanvasState(state.concat(newState));
  };

  /**
   * 画笔移动时的处理
   * @param {*} x
   * @param {*} y
   */
  const lineMove = (x, y) => {
    const pre = canvasState[canvasState.length - 1];
    const path = new Path2D();

    path.addPath(pre.path);
    path.lineTo(x, y);

    replaceState(getCurState([path, pre.lineColor]));
  };

  /**
   * 画圆时的移动处理
   * @param {*} x
   * @param {*} y
   */
  const circleMove = (x, y) => {
    const path = new Path2D();
    const { x: initX, y: initY } = initPosition;
    path.ellipse(
      (initX + x) / 2,
      (initY + y) / 2,
      Math.abs((initX - x) / 2),
      Math.abs((initY - y) / 2),
      0,
      0,
      2 * Math.PI
    );
    replaceState(getCurState([path, path]));
  };

  /**
   * 画矩形时的移动处理
   * @param {*} x
   * @param {*} y
   */
  const singleLineMove = (x, y) => {
    const path = new Path2D();
    const { x: initX, y: initY } = initPosition;
    const pre = canvasState[canvasState.length - 1];
    ctx.beginPath();
    path.moveTo(initX, initY);
    path.lineTo(x, y);
    console.log(pre.lineColor, 1111);
    replaceState(getCurState([path, pre.lineColor]));
  };

  /**
   * 根据起点和重点生成连续的矩形路径
   * @param {*} x
   * @param {*} y
   * @param {*} x2
   * @param {*} y2
   * @param {*} step
   * @returns
   */
  const getLinearRect = (x, y, x2, y2, step = 5) => {
    const path = new Path2D();
    const disx = x2 - x;
    const disy = y2 - y;
    let c = Math.abs((disx * 100) / (step * scale));
    const ypercent = disy / c;
    let flag = x2 >= x ? 1 : -1;
    for (let i = 0; i <= c; i++) {
      path.rect(
        x2 - i * 5 * flag - 8,
        y2 - i * ypercent - 8,
        (16 * 100) / scale,
        (16 * 100) / scale
      );
    }
    return path;
  };

  /**
   * 橡皮擦时的移动处理
   * @param {*} x
   * @param {*} y
   */
  const abraseMove = (x, y) => {
    const pre = canvasState[canvasState.length - 1].path;

    const path = getLinearRect(initPosition.x, initPosition.y, x, y);
    path.addPath(pre);
    setInitPosition({ x, y });
    replaceState(getCurState([path.path, path.lineColor], true, true));
  };

  /**
   * 移动模式时，鼠标按下事件
   * @param {*} x
   * @param {*} y
   * @returns
   */
  const moveMouseDown = (x, y) => {
    if (!canvasState.length) return;
    setInitPosition({ x, y });
    const preState = canvasState.slice(0, recordIndex);
    setCanvasState(
      preState.concat({
        type: "transform",
        id: Math.random(),
        transform: [
          [scale, scale],
          [canvasTranslate[0], canvasTranslate[1]],
        ],
      })
    );
    setRecordIndex(recordIndex + 1);
  };

  const movePathEvent = (x, y) => {
    const pre = canvasState[canvasState.length - 1];
    const { x: initX, y: initY } = initPosition;
    const newState = {
      ...pre,
      curOffset: [x - initX, y - initY],
    };
    replaceState(newState);
  };

  /**
   * 鼠标移动事件
   * @param {*} e
   * @returns
   */
  function mousemoveEvent(e) {
    if (!isStart) return;
    ctx.lineJoin = "round";
    const [translateX, translateY] = canvasTranslate;
    const [x, y] = [
      ((e.offsetX - translateX) * 100) / scale,
      ((e.offsetY - translateY) * 100) / scale,
    ];
    if (isPathMove) {
      movePathEvent(x, y);
      return;
    }
    switch (mode) {
      case "line":
        lineMove(x, y);
        break;
      //   case "circle":
      //     circleMove(x, y);
      //     break;
      case "singleLine":
        singleLineMove(x, y);
        break;
      case "pathMove":
        pathMove(x, y);
        break;
      case "move":
        canvasMove(x, y);
        break;
      default:
        abraseMove(x, y);
    }
  }

  const juadgeIsChoose = (x, y) => {
    const state = canvasState
      .slice(0, recordIndex)
      .filter((item) => item.type === "path");
    let index = -1;
    for (let i = state.length - 1; i >= 0; i--) {
      ctx.resetTransform();
      const item = state[i];
      ctx.lineWidth = item.lineWidth;
      ctx.translate(item.offset[0], item.offset[1]);
      if (ctx.isPointInStroke(item.path, x, y)) {
        index = i;
        break;
      }
    }

    // ctx.shadowColor = "black";
    // ctx.shadowOffsetX = 3;
    // ctx.shadowOffsetY = 3;

    // ctx.shadowBlur = 10;
    // for (const item of state) {
    //   ctx.lineWidth = item.lineWidth;
    //   if (item.type !== "path") continue;
    //   if (ctx.isPointInStroke(item.path, x, y)) {
    //     console.log(item, 1);
    //   }
    //   if (ctx.isPointInPath(item.path, x, y)) {
    //     console.log(item, 2);
    //   }
    // }
    if (index >= 0) {
      debugger;
      console.log(state[index].offset);
      const newState = {
        ...state[index],
        isMoving: true,
      };
      console.log(newState.offset);
      setCanvasState(canvasState.slice(0, recordIndex).concat(newState));
      setRecordIndex(recordIndex + 1);
      setIsPathMove(true);
      return true;
    }
  };

  /**
   * 鼠标按下事件
   * @param {*} e 事件对象
   * @returns
   */
  function mousedownEvent(e) {
    setIsStart(true);
    const [translateX, translateY] = canvasTranslate;
    const [x, y] = [
      ((e.offsetX - translateX) * 100) / scale,
      ((e.offsetY - translateY) * 100) / scale,
    ];
    setInitPosition({ x, y });
    const isChoose = juadgeIsChoose(x, y);
    if (isChoose) {
      return;
    }
    if (mode === "move") {
      moveMouseDown(x, y);
      return;
    }
    const newState = canvasState.slice(0, recordIndex);
    const newPath = new Path2D();
    newPath.moveTo(x, y);
    setCanvasState(newState.concat(getCurState([newPath])));
    setRecordIndex(recordIndex + 1);
  }

  /**
   * 鼠标松开事件
   * @param {*} e
   * @returns
   */
  function mouseupEvent() {
    if (!isStart) return;
    if (isPathMove) {
      const pre = canvasState[canvasState.length - 1];

      const { offset, curOffset } = pre;
      console.log(pre);
      setCanvasState(
        canvasState.slice(0, canvasState.length - 1).concat({
          ...pre,
          isMoving: false,
          offset: [offset[0] + curOffset[0], offset[1] + curOffset[1]],
          curOffset: [0, 0],
        })
      );
    }
    setIsPathMove(false);
    // recordState();
    setIsStart(false);

    // setCurPath(null);
  }

  /**
   * 画布移动事件
   * @param {*} x
   * @param {*} y
   */
  const canvasMove = (x, y) => {
    const [preX, preY] = canvasTranslate;
    const { x: initX, y: initY } = initPosition;
    setTranslate([preX + x - initX, preY + y - initY]);
    replaceState({
      type: "transform",
      id: Math.random(),
      transform: [
        [scale, scale],
        [preX + x - initX, preY + y - initY],
      ],
    });
  };

  //事件绑定
  useEffect(() => {
    const canvas = canvasEle.current;
    canvas.addEventListener("mousedown", mousedownEvent);
    canvas.addEventListener("mousemove", mousemoveEvent);
    window.addEventListener("mouseup", mouseupEvent);
    return () => {
      canvas.removeEventListener("mousedown", mousedownEvent);
      canvas.removeEventListener("mousemove", mousemoveEvent);
      window.removeEventListener("mouseup", mouseupEvent);
    };
  });

  //画布移动模式下，修改画布的cursor
  useEffect(() => {
    if (mode === "move") {
      canvasEle.current?.classList.add("move-canvas");
    } else {
      canvasEle.current?.classList.remove("move-canvas");
    }
  }, [mode]);

  /**
   * 前进/后退事件
   * @param {*} v
   */
  const frontOrBack = (v) => {
    setRecordIndex(Math.max(1, Math.min(canvasState.length, recordIndex + v)));
  };

  /**
   * 生成当前的操作记录
   * @param {*} path
   * @param {*} fill
   * @returns
   */
  const getCurState = (
    [path, lineColor2 = lineColor],
    fill,
    isAbrase = false
  ) => {
    return {
      type: "path",
      id: Math.random(),
      scale,
      path,
      offset: [0, 0],
      curOffset: [0, 0],
      lineWidth: lineWidth,
      lineColor: lineColor2,
      fill,
      isAbrase,
    };
  };

  //画布渲染
  useEffect(() => {
    if (!canvasState.length) return;
    const ctx = canvasEle.current.getContext("2d");
    ctx.resetTransform();
    ctx.clearRect(0, 0, defaultWidth, defaultHeight);
    const contentState = [];
    // const imgState = [];
    const transformState = [];
    const validState = canvasState.slice(0, recordIndex);
    const idMap = validState.reduce((pre, item, index) => {
      pre[item.id] = index;
      return pre;
    }, {});
    for (let i = 0; i < validState.length; i++) {
      const item = validState[i];
      if (idMap[item.id] !== i) continue;

      if (item.type === "img") {
        // imgState.push(item);
        contentState.push(item);
      } else if (item.type === "transform") {
        transformState.push(item);
      } else {
        contentState.push(item);
      }
    }
    // const contentState = canvasState
    //   .slice(0, recordIndex)
    //   .filter((item) => item.type !== "transform");
    // const transformState = canvasState
    //   .slice(0, recordIndex)
    //   .filter((item) => item.type === "transform")
    //   .pop()?.transform;

    const [[x, y], [x2, y2]] = transformState.pop().transform;
    ctx.translate(x2, y2);
    ctx.scale(x / 100, y / 100);
    setScale(x);
    setTranslate([x2, y2]);

    for (const item of contentState) {
      const { img, size } = item;
      if (item.type === "img") {
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          (-1 * size[0]) / 2,
          (-1 * size[1]) / 2,
          size[0],
          size[1]
        );
        continue;
      }
      ctx.beginPath();
      ctx.lineWidth = item.lineWidth;
      ctx.strokeStyle = item.lineColor;
      if (item.fill) {
        // CanvasRenderingContext2D.globalCompositeOperation = "source-atop";

        ctx.fillStyle = "#fff";
        ctx.fill(item.path);
        // CanvasRenderingContext2D.globalCompositeOperation = "source-over";
      } else {
        ctx.resetTransform();
        ctx.translate(
          item.offset[0] + item.curOffset[0],
          item.offset[1] + item.curOffset[1]
        );
        console.log(item.isMoving);
        if (item.isMoving) {
          // ctx.shadowColor = "black";
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          ctx.shadowBlur = 5;
          // ctx.strokeStyle = "red";
        } else {
          // ctx.shadowOffsetX = 0;
          // ctx.shadowOffsetY = 0;
          // ctx.shadowBlur = 10;
        }
        ctx.stroke(item.path);
      }
    }
  }, [canvasState, recordIndex]);

  /**
   * 初始化画布状态
   * @param {*} w
   * @param {*} h
   * @param {*} state
   */
  const initCanvas = (w = defaultWidth, h = defaultHeight, state = []) => {
    for (const item of canvasState) {
      if (item.type === "img") {
        window.URL.revokeObjectURL(item.img.src);
      }
    }
    setCanvasSize([w, h]);
    setScale(100);
    setTranslate([w / 2, h / 2]);
    setCanvasState([getInitState(w / 2, h / 2), ...state]);
    setRecordIndex(state.length + 1);
  };

  /**
   * 选择图片
   * @param {*} e
   * @returns
   */
  const selectFile = (e) => {
    const url = window.URL.createObjectURL(e.file);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const n = Math.min(defaultWidth / img.width, defaultHeight / img.height);
      const size = [img.width * n, img.height * n];
      initCanvas(...size, [
        {
          type: "img",
          img,
          size,
          id: Math.random(),
        },
      ]);
    };
    return false;
  };

  /**
   * 下载图片
   */
  const downLoadImg = () => {
    const aEle = document.createElement("a");
    document.body.appendChild(aEle);
    aEle.href = canvasEle.current.toDataURL();
    aEle.download = `${Date.now()}.jpg`;
    aEle.click();
    document.body.removeChild(aEle);
  };

  const pathMove = () => {};
  return (
    <div className="container">
      <div className="header">
        <div className="tools">
          {list.map((item) => {
            //   const Com = item.component;
            return (
              <div
                className={
                  mode === item.value ? "tool-item cur-tool" : "tool-item"
                }
                key={item.value}
                onClick={setMode.bind(this, item.value)}
                title={item.title}
              >
                <Tool key={item.value} item={item} mode={mode}></Tool>
              </div>
            );
          })}
          {/* <div
            title="橡皮"
            className="tool-item img-box"
            onClick={setMode.bind(this, "abrase")}
          >
            <img
              className={mode === "abrase" ? "cur-move move-img" : "move-img"}
              src={require("../asset/img/abrase.svg").default}
              // src="../asset/img/hand.svg"
              alt=""
            />
          </div> */}
          <div
            title="移动"
            className="tool-item img-box"
            onClick={setMode.bind(this, "move")}
          >
            <img
              className={mode === "move" ? "cur-move move-img" : "move-img"}
              src={require("../asset/img/hand.svg").default}
              // src="../asset/img/hand.svg"
              alt=""
            />
          </div>
          {/* <div
            title="图形移动"
            className="tool-item img-box"
            onClick={setMode.bind(this, "pathMove")}
          >
            <img
              className={mode === "move" ? "cur-move move-img" : "move-img"}
              src={require("../asset/img/hand.svg").default}
              // src="../asset/img/hand.svg"
              alt=""
            />
          </div> */}
          <div className="tool-item" style={{ width: "60px" }}>
            <Input
              style={{ width: 40 }}
              type="color"
              value={lineColor}
              title="线条颜色"
              onChange={setLineColor2}
              format="#rrggbb"
            />
          </div>
          <div className="tool-item" style={{ width: "120px" }}>
            <Select
              title="线宽"
              style={{ width: 100 }}
              defaultValue={1}
              value={lineWidth}
              onChange={setLineWidth.bind(this)}
            >
              {lineWidthList.map((item) => (
                <Option
                  title="线宽"
                  key={item}
                  value={item}
                >{`${item}px`}</Option>
              ))}
            </Select>
          </div>
          <div
            className="tool-item"
            title="后退"
            onClick={frontOrBack.bind(this, -1)}
          >
            <ArrowLeftOutlined />
          </div>
          <div
            className="tool-item"
            title="前进"
            onClick={frontOrBack.bind(this, 1)}
          >
            <ArrowRightOutlined />
          </div>
          {/* <div className="tool-item" style={{ width: "160px" }}>
            <span className="text">缩放比例:</span>
            <InputNumber
              style={{ width: "60px" }}
              value={scale}
              min={20}
              max={500}
              step={10}
              formatter={(v) => Math.round(v / 10) * 10}
              onChange={setScale2}
            />
            %
          </div> */}
        </div>
        <div className="header-right">
          {/* <Upload
            // beforeUpload={false}
            maxCount={1}
            showUploadList={false}
            onChange={selectFile}
            beforeUpload={selectFile}
            accept="image/*"
          >
            <Button>选择文件</Button>
          </Upload> */}
          ,
        </div>
      </div>
      <div className="canvas-box">
        <canvas
          className="canvas-content"
          ref={canvasEle}
          width={canvasSize[0]}
          height={canvasSize[1]}
        ></canvas>
      </div>
      {/* <div className="footer">
        <Button
          className="action-btn"
          onClick={initCanvas.bind(this, defaultWidth, defaultHeight, [])}
        >
          清空画布
        </Button>
        <Button
          className="action-btn"
          type="primary"
          icon={<DownloadOutlined />}
          onClick={downLoadImg}
        >
          下载
        </Button>
      </div> */}
    </div>
  );
}
export default MoveCom;
