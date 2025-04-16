import { useTheme } from '@mui/material/styles';
import styles from '../styles/NewMaterialBgLettersFont.module.css';

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
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.5,
      }}
    >
      <g fill="#0A84FF" fontSize="64" fontFamily={theme.typography.fontFamily} className={styles.new_material_bg_letters_font}>
        <text x="580" y="60" transform="rotate(20 600,80)">A</text>
        <text x="680" y="160" transform="rotate(-15 680,160)">E</text>
        <text x="580" y="90" transform="rotate(25 700,280)">B</text>
        <text x="620" y="340" transform="rotate(-30 620,340)">R</text>
        <text x="680" y="120" transform="rotate(10 750,420)">Ф</text>
        <text x="720" y="140" transform="rotate(-20 720,520)">Є</text>
      </g>
    </svg>
  );
};

export default LetterOverlay;
