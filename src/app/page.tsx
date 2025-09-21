'use client'
import React, { useEffect } from "react";
import { useRef, useState } from "react";
import { CalendarProps, DateProps, DateType } from "../types/page";
import { Utils } from "@/utils/page";

export default function Home() {

  const [show, setShow] = useState<boolean>(false);
  const [chooseDate, setChooseDate] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const body: HTMLBodyElement | null = document.querySelector("body");

    function handleClickOutside(e: MouseEvent) {
      const c: HTMLElement | null = (e.target as HTMLElement).closest("#calendar");
      if (!c) {
        setShow(false);
      }
    }

    body?.addEventListener("click", handleClickOutside);
    return () => {
      body?.removeEventListener("click", handleClickOutside);
    }
  }, []);

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.value = chooseDate;
    }
  }, [chooseDate])

  return (
    <div id="calendar" className="h-full w-full flex justify-center relative">
      <div className="flex w-72 flex-col gap-6">
        <input
          ref={inputRef}
          onFocus={() => setShow(true)}
          type="text"
          id="first_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="John"
          required />
      </div>

      {show && <Calendar setShow={setShow} setChooseDate={setChooseDate} />}
    </div>
  )
}

function Calendar({ setChooseDate, setShow }: CalendarProps) {
  const todayRef = useRef<Date>(new Date());
  const [month, setMonth] = useState<number>(todayRef.current.getMonth());
  const [year, setYear] = useState<number>(todayRef.current.getFullYear());

  function handleMonth(m: number) {
    if (m == -1 || m == 12) return;
    setMonth(m);
  }

  function handleYear(y: number) {
    if (y == 0) return;
    setYear(y);
  }

  return (
    <div className="p-5 m-4 flex flex-col justify-center items-center absolute top-[110%] z-50">
      <div className="flex flex-col w-[40vw] border rounded-lg overflow-hidden bg-white shadow-sm">

        <div className="flex">
          {/* Year */}
          <div className="flex w-full justify-center items-center py-2 bg-gray-100">
            <span
              className="py-2 px-4 m-1 bg-green-500 hover:bg-green-600 text-white font-bold rounded cursor-pointer transition"
              onClick={() => handleYear(year - 1)}
            >
              -
            </span>
            <span className="px-3 font-medium text-lg">{year}</span>
            <span
              className="py-2 px-4 m-1 bg-green-500 hover:bg-green-600 text-white font-bold rounded cursor-pointer transition"
              onClick={() => handleYear(year + 1)}
            >
              +
            </span>
          </div>

          {/* Month */}
          <div className="flex w-full justify-center items-center py-2 bg-gray-100">
            <span
              className="py-2 px-4 m-1 bg-green-500 hover:bg-green-600 text-white font-bold rounded cursor-pointer transition"
              onClick={() => handleMonth(month - 1)}
            >
              -
            </span>
            <span className="px-3 font-medium text-lg">{Utils.getAlphaMonth(month)}</span>
            <span
              className="py-2 px-4 m-1 bg-green-500 hover:bg-green-600 text-white font-bold rounded cursor-pointer transition"
              onClick={() => handleMonth(month + 1)}
            >
              +
            </span>
          </div>
        </div>

        <NamesOfWeek />
        <Dates year={year} month={month} date={1} setChooseDate={setChooseDate} setShow={setShow} />
      </div>
    </div>
  );
}

function NamesOfWeek() {
  let names = useRef(["su", "mo", "tu", "we", "th", "fr", "st"]);

  return (
    <div className="flex w-full bg-gray-200">
      {names.current.map((name) => (
        <span
          key={name}
          style={{ width: `${Utils.WIDTH}%` }}
          className="text-center font-semibold text-gray-700 py-2 border-r last:border-r-0"
        >
          {name.toUpperCase()}
        </span>
      ))}
    </div>
  );
}

function Dates(
  { year, month, date, setChooseDate, setShow }: DateProps
) {
  const [dates, setDates] = useState<DateType>([]);

  useEffect(() => {
    setDates([]);
    const allDates: DateType = [];
    let dayValue = 1;

    for (let i = 0; i < 6; i++) {
      let rowDates: any[] = [];
      let bk = false;

      for (let weekDay = 0; weekDay < 7; weekDay++) {
        const d = new Date(year, month, dayValue);
        const currentWeekDay = d.getDay();

        if (currentWeekDay != weekDay) {
          rowDates.push({ dayValue: -1, weekDay: -1 });
        } else {
          if (dayValue > d.getDate()) {
            bk = true;
            rowDates.push({ dayValue: -1, weekDay: -1 });
          } else {
            rowDates.push({ dayValue, weekDay });
          }
          dayValue++;
        }
      }
      allDates.push(rowDates);
      if (bk) break;
    }

    setDates((prev: DateType): DateType => {
        return [...prev, ...allDates]
    });
  }, [year, month, date]);

  function handleClick(dayValue: number) {
    console.log('chose', dayValue)
    if (dayValue == -1) return;
    setChooseDate(`${dayValue}-${month}-${year}`);
    setShow(false)
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-wrap">
        {dates.map((row, i) => (
          <div key={i} className="flex w-full">
            {row.map(({ dayValue, weekDay }, idx) => (
              <span
                key={idx}
                style={{ width: `${Utils.WIDTH}%` }}
                onClick={() => handleClick(dayValue)}
                className={`
                  text-center py-2 border border-gray-300
                  ${weekDay === new Date(year, month, dayValue).getDay() ? "bg-amber-100 border-amber-400 font-semibold" : ""}
                  ${weekDay === 0 ? "text-red-500" : "text-gray-700"}
                  hover:bg-gray-100 cursor-pointer
                `}
              >
                {dayValue == -1 ? "" : dayValue}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}