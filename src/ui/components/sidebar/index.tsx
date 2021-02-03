import clsx from "clsx";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import styles from "./index.scss";

export function Sidebar() {
  const [collapsed] = useState(false);
  const [pages, setPages] = useState<string[]>();

  useEffect(() => {
    window
      .fetch("/api/v1/pages")
      .then((resp) => resp.json())
      .then((json) => setPages(json.pages));
  }, []);

  return (
    <div
      data-testid="sidebar"
      className={clsx(styles.sidebar, { [styles.collapsed]: collapsed })}
    >
      <ul>
        {pages?.map((page) => (
          <li>
            <NavLink to={`/${page}`}>{page}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
