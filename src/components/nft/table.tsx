import React from 'react';
import { Switch } from '@chakra-ui/react';

interface IProps {
  title?: string;
  header?: any;
  body?: any;
  onClick: any;
  noCheckbox?: boolean;
}
const Table: React.FC<IProps> = ({ header, body, title, onClick, noCheckbox }: IProps) => {
  return (
    <div className="tb">
      {title && (
        <div className="head">
          <h4 className="db-subtitle">{title}</h4>
        </div>
      )}
      {header && header.length > 0 && (
        <div className="head">
          {header.map((i: any) => (
            <span key={i} className="ll">
              {i}
            </span>
          ))}
        </div>
      )}

      {body && body.length > 0 && (
        <>
          {body.map((i: any, o: any) => (
            <div key={o} className="tb-card body">
              {body[o].map((j: any) => (
                <span onClick={() => onClick()} key={j} className="ll">
                  {j}
                </span>
              ))}

              {!noCheckbox && (
                <span className="ll">
                  <Switch colorScheme="teal" size="lg" />
                </span>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Table;
