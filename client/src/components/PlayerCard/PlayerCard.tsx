import React from "react";
import styles from "./PlayerCard.module.css";

interface PlayerCardProps {
  playerId: number;
  isReady: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ playerId, isReady }) => {
  const statusClass = isReady ? styles.ready : styles.notReady;

  return (
    <div className={`${styles.card} ${statusClass}`} key={playerId}>
      <div className={styles.imgBlock}>
        {isReady ? (
          <img
            src="/images/player-ready.png"
            className={styles.imgPlayer}
            alt=""
          />
        ) : (
          <img src="/images/player.png" className={styles.imgPlayer} alt="" />
        )}
      </div>
      {isReady ? (
        <div className={styles.statusBlock}>
          <div className={styles.statusImgBlock}>
            <img src="/images/ready.png" className={styles.imgStatus} alt="" />
          </div>
          <div className={styles.statusText}>
            <p className={styles.text}>готов</p>
          </div>
        </div>
      ) : (
        <div className={styles.statusBlock}>
          <div className={styles.statusImgBlock}>
            <img
              src="/images/not-ready.png"
              className={styles.imgStatus}
              alt=""
            />
          </div>
          <div className={styles.statusText}>
            <p className={styles.text}>не готов</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
