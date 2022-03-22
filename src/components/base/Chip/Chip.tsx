import { ReactElement } from 'react';

interface Props {
  left?: ReactElement;
  content: string | ReactElement;
  right?: ReactElement;
}

export default function Chip({ left, content, right }: Props) {
  const contentCx = typeof content === 'string' && ' px-2 ';
  return (
    <div className="flex justify-center items-center m-1 font-medium py-1 px-1 rounded-full border border-gray-300">
      {left && <div className="pl-3">{left}</div>}
      <div className={`text-xs font-normal leading-none max-w-full flex-initial px-3`}>{content}</div>
      {right && <div className="flex flex-auto flex-row-reverse pr-3">{right}</div>}
    </div>
  );
}
