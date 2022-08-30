import React from "react";
import { useState, useEffect } from "react";

export default function Countdown(props) {
  // console.log(typeof (props.startingTime));
  // console.log(props.startingTime);

  // console.log(props.startingTime.getHours());
  //記録された時刻
  const startingDate = props.startingDate;
  const startingHours = props.startingHours;
  const startingMinutes = props.startingMinutes;
  const startingSeconds = props.startingSeconds;
  //現在時刻
  const nowTime = new Date();
  const nowDate = nowTime.getDate();
  const nowHours = nowTime.getHours();
  const nowMinutes = nowTime.getMinutes();
  const nowSeconds = nowTime.getSeconds();
  //計算する
  //それっぽい時間の表示
  const remainedMinutes = 179 - startingMinutes;
  const remainedSeconds = 60 - startingSeconds;

  // const { startingMinutes = 111, startingSeconds = 0 } = props;
  const [mins, setMinutes] = useState(remainedMinutes);
  const [secs, setSeconds] = useState(remainedSeconds);
  useEffect(() => {
    let sampleInterval = setInterval(() => {
      if (secs > 0) {
        setSeconds(secs - 1);
      }
      if (secs === 0) {
        if (mins === 0) {
          clearInterval(sampleInterval);
        } else {
          setMinutes(mins - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(sampleInterval);
    };
  });

  return (
    <div className='w-[10%] bg-blue-300 flex flex-col justify-center items-center'>
      {!(mins && secs) ? "" : (
        <p>
          {" "}
          {mins}:{secs < 10 ? `0${secs}` : secs}
        </p>
      )}
    </div>
  );
}