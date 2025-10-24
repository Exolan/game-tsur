import React, { useRef, useState } from "react";
import { socket } from "../../socket";

import styles from "./RoleCard.module.css";

function RoleCard({ roleKey, disabled, roleData, setRoleSelect }) {
  const [classList, setClassList] = useState(styles.card);

  function handleClick() {
    if (disabled || roleData.isSelect) return;
    setClassList(`${classList} ${styles["is-flipped"]}`);

    setRoleSelect(roleKey);
    socket.emit("selectRole", roleKey);
  }

  return (
    <div
      className={`${classList} ${disabled ? "disabled" : ""}`}
      onClick={() => handleClick()}
    >
      <div className={styles.cardBack}>
        <div className={styles.cardBlockImg}>
          <img src="/images/card.svg" className={styles.cardImg} />
        </div>
        <div className={styles.cardBlockText}>
          <p className={styles.cardText}>выбрать</p>
        </div>
      </div>
      <div className={styles.cardFace}>
        <div className={styles.cardBlockImg}>
          <img src={`/images/${roleKey}.png`} className={styles.cardImg} />
        </div>
        <div className={styles.cardBlockText}>
          <p className={styles.cardText}>{roleData.displayName}</p>
        </div>
      </div>
    </div>
  );
}

export default RoleCard;
