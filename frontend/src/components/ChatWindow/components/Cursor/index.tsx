import { ICursor } from "../../../../atoms/cursor";
import css from './Cursor.module.css';

type CursorProps = {
  cursor: ICursor,
};

const Cursor: React.FC<CursorProps> = ({ cursor }) => {
  return (
    <div className={css.anotherPersonsCursor} style={{ top: cursor.y, left: cursor.x }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 4.27l10.476 8.73h-6.542l-3.934 5.117v-13.847zm-2-4.27v24l6.919-9h11.081l-18-15z"/></svg>
      <span>{cursor.name}</span>
    </div>
  );
}

export default Cursor;
