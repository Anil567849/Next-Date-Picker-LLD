type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

export type CalendarProps = {
  setChooseDate: Setter<string>;
  setShow: Setter<boolean>;
};

export type DateProps = CalendarProps & {
  year: number;
  month: number;
  date: number;
};

type Day = {
  dayValue: number;
  weekDay: number;
};

export type DateType = Day[][];