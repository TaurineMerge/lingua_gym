import { useTheme } from '@mui/material/styles';
import styles from '../../styles/NewMaterialBgLettersFont.module.css';

const LetterOverlay = () => {
  const theme = useTheme();

  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMaxYMin slice"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: -1,
        opacity: 0.4,
      }}
    >
      <g
        fill="#0A84FF"
        fontSize="48px"
        fontFamily={theme.typography.fontFamily}
        className={[styles.newMaterialBgLettersFont, styles.hideOnSmall].join(' ')}
      >

        <g transform={`rotate(20 600 80)`}>
          <text x="576" y="60">🗽</text>
        </g>
        <g transform={`rotate(-15 680 160)`}>
          <text x="680" y="162">🗼</text>
        </g>
        <g transform={`rotate(25 700 280)`}>
          <text x="576" y="110">Y</text>
        </g>
        <g transform={`rotate(-30 620 340)`}>
          <text x="656" y="78">🏯</text>
        </g>
        <g transform={`rotate(10 750 420)`}>
          <text x="680" y="120">M</text>
        </g>
        <g transform={`rotate(-20 720 520)`}>
          <text x="720" y="138" >G</text>
        </g>
      </g>
    </svg>
  );
};

export default LetterOverlay;