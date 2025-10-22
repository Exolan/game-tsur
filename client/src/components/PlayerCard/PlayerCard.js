import styles from "./PlayerCard.module.css";

function PlayerCard({ isReady }) {
  const statusClass = isReady ? styles.ready : styles.notReady;

  return (
    <div className={`${styles.card} ${statusClass}`}>
      <div className={styles.imgBlock}>
        {isReady ? (
          <img src="/images/player-ready.png" className={styles.imgPlayer} />
        ) : (
          <img src="/images/player.png" className={styles.imgPlayer} />
        )}
      </div>
      {isReady ? (
        <div className={styles.statusBlock}>
          <div className={styles.statusImgBlock}>
            <img src="/images/ready.png" className={styles.imgStatus} />
          </div>
          <div className={styles.statusText}>
            <p className={styles.text}>готов</p>
          </div>
        </div>
      ) : (
        <div className={styles.statusBlock}>
          <div className={styles.statusImgBlock}>
            <img src="/images/not-ready.png" className={styles.imgStatus} />
          </div>
          <div className={styles.statusText}>
            <p className={styles.text}>не готов</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerCard;
