import axios from "axios";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import styles from "./index.scss";

export function Sidebar() {
  const [collapsed] = useState(false);
  const [pages, setPages] = useState<string[]>();

  useEffect(() => {
    let mounted = true;

    axios.get<{ pages: string[] }>("/api/v1/pages").then(({ data }) => {
      if (mounted) {
        setPages(data.pages);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      data-testid="sidebar"
      className={clsx(styles.sidebar, { [styles.collapsed]: collapsed })}
    >
      <ul>
        {pages?.map((page) => (
          <li key={page}>
            <NavLink to={`/${page}`}>{page}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
