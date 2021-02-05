import axios from "axios";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import styles from "./index.scss";

interface Page {
  id: string;
  name: string;
}

export function Sidebar() {
  const [collapsed] = useState(false);
  const [pages, setPages] = useState<Page[]>();

  useEffect(() => {
    let mounted = true;

    axios.get<Page[]>("/api/v1/pages").then(({ data }) => {
      /* istanbul ignore else */
      if (mounted) {
        setPages(data);
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
          <li key={page.id}>
            <NavLink to={`/${page.id}`}>{page.name}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
